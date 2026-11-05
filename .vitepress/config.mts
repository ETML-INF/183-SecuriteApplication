import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync, existsSync, mkdirSync, copyFileSync, statSync } from 'node:fs'
import path from 'node:path'
import pkg from '../package.json'

// Fail build when siteBase doesn't match the actual GitHub repo name (CI only)
if (process.env.GITHUB_REPOSITORY) {
  const expected = `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  if (pkg.siteBase !== expected) {
    throw new Error(`[config] siteBase mismatch: package.json="${pkg.siteBase}" vs GITHUB_REPOSITORY implies "${expected}"`)
  }
}

// VitePress ne connaît pas ces extensions et ajouterait « .html » aux liens (02-Auth.docx -> 02-Auth.docx.html)
// Côté build (markdown) via process.env ; côté navigateur (router) via .env (VITE_EXTRA_EXTENSIONS)
process.env.VITE_EXTRA_EXTENSIONS ??= 'docx,pptx,xlsx,sql'

const repoUrl = process.env.GITHUB_REPOSITORY
  ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
  : 'https://github.com/ETML-INF/183-SecuriteApplication'

// Fichiers non-markdown (pdf, pptx, docx, zip...) référencés par les pages : copiés tels quels dans le site
const staticDirs = ['supports', 'legal', 'exercices']
// Copiés tels quels : tout sauf les .md (pages VitePress), les backups `~` et le dump local exercices/hack/wip.
// Les corrigés X-*.md sont aussi copiés (bruts), car le parcours renvoie les élèves vers eux.
const isStatic = (f: string) =>
  !f.endsWith('~') && !f.includes('/wip/') && (!f.endsWith('.md') || path.basename(f).startsWith('X-'))

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(f => {
    const p = `${dir}/${f}`
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}

const mdFiles = (dir: string) =>
  existsSync(dir) ? walk(dir).filter(f => f.endsWith('.md') && !path.basename(f).startsWith('X-')).sort() : []

// Titre = H1 de la page, préfixé du numéro du fichier (01-dangers.md → "01 — Risques…") pour faciliter la navigation
const title = (f: string) => {
  const h1 = readFileSync(f, 'utf-8').match(/^#\s+(.*)/m)?.[1] ?? path.basename(f, '.md')
  const num = path.basename(f).match(/^(\d+)-/)?.[1]
  return num ? `${num} — ${h1}` : h1
}

const slides = readdirSync('slides').filter(f => f.endsWith('.md')).sort()
  .map(f => ({ text: path.basename(f, '.md'), link: `${pkg.siteBase}slides/${path.basename(f, '.md')}/`, target: '_blank' }))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ICT-183 Sécurité',
  description: 'Module ICT 183 : implémenter la sécurité des applications',
  lang: 'fr-CH',
  base: pkg.siteBase,

  srcExclude: ['slides/**', 'docs/**', 'idees.md', 'exercices/**/X-*.md'],

  rewrites: { 'README.md': 'index.md' },

  // Les dumps HTML (ex. exercices/hack/wip) ne doivent pas être scannés par Vite en dev
  vite: {
    optimizeDeps: { entries: ['!exercices/**', '!node_modules/**'] },
    plugins: [{
      // En dev, sert les fichiers statiques (docx, zip, pdf...) que buildEnd ne copie qu'au build
      name: 'serve-static-assets-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = decodeURIComponent((req.url ?? '').split('?')[0])
          if (!url.startsWith(pkg.siteBase)) return next()
          const rel = url.slice(pkg.siteBase.length)
          if (!staticDirs.some(d => rel.startsWith(d + '/')) || rel.includes('..')) return next()
          const f = path.resolve(rel)
          if (!existsSync(f) || !statSync(f).isFile() || !isStatic(rel)) return next()
          if (f.endsWith('.md')) res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          else res.setHeader('Content-Disposition', 'inline')
          res.end(readFileSync(f))
        })
      },
    }],
  },

  themeConfig: {
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Thématiques', link: '/thematiques/00-parcours' },
      { text: 'Exercices', link: '/exercices/ListeDesQuestions' },
      { text: 'Slides', items: slides },
    ],

    sidebar: [
      {
        text: 'Thématiques',
        items: mdFiles('thematiques').map(f => ({ text: title(f), link: '/' + f.replace(/\.md$/, '') })),
      },
      {
        text: 'Exercices',
        items: mdFiles('exercices').map(f => ({ text: title(f), link: '/' + f.replace(/\.md$/, '') })),
      },
      {
        text: 'Slides',
        items: slides,
      },
    ],

    socialLinks: [{ icon: 'github', link: repoUrl }],
    search: { provider: 'local' },
  },

  ignoreDeadLinks: [
    /^http:\/\/localhost/, // services Docker locaux des exercices
    /\/slides\//, // Slidev output — not VitePress pages
    /\.(pdf|xlsx|docx|csv|pptx|zip|sql|txt)$/i, // static assets copied in buildEnd
  ],

  buildEnd: (siteConfig) => {
    for (const dir of staticDirs.filter(existsSync)) {
      for (const f of walk(dir).filter(isStatic)) {
        const dest = path.join(siteConfig.outDir, f)
        mkdirSync(path.dirname(dest), { recursive: true })
        copyFileSync(f, dest)
      }
    }
  },
})
