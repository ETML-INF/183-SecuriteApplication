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

const repoUrl = process.env.GITHUB_REPOSITORY
  ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
  : 'https://github.com/ETML-INF/183-SecuriteApplication'

// Fichiers non-markdown (pdf, pptx, docx, zip...) référencés par les pages : copiés tels quels dans le site
const staticDirs = ['supports', 'legal']

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
  vite: { optimizeDeps: { entries: ['!exercices/**', '!node_modules/**'] } },

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
      for (const f of walk(dir).filter(f => !f.endsWith('.md') && !f.endsWith('~'))) {
        const dest = path.join(siteConfig.outDir, f)
        mkdirSync(path.dirname(dest), { recursive: true })
        copyFileSync(f, dest)
      }
    }
  },
})
