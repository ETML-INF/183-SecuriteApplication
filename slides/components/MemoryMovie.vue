<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'
const uid = 'mm' + useId().replace(/[^a-zA-Z0-9]/g, '')

// "Film" de l'attaque PHP2Shell. Lecture automatique ou pas à pas.
// from/to permettent de ne jouer qu'une partie du film.
const props = defineProps({
  from: { type: Number, default: 0 },
  to: { type: Number, default: 8 },
  autoplay: { type: Boolean, default: false },
  speed: { type: Number, default: 3500 },
})

type Kind = 'free' | 'data' | 'evil' | 'ptr' | 'ptrbad' | 'exec'
interface Step {
  text: string
  stage: number          // étape active du pipeline (-1 = aucune)
  oom?: boolean          // erreur mémoire pleine
  shortcut?: boolean     // flèche raccourci visible
  cells: Kind[]
  ring?: number          // case mise en évidence
  req?: 'A' | 'B' | 'C' | ''
  gauge: number          // 0..100
  arrow?: 'write' | 'leak' | 'ptr' | ''
  shell?: boolean
}

const steps: Step[] = [
  { text: 'Le worker est au repos : sa mémoire est propre.',
    stage: -1, cells: ['ptr', 'free', 'free', 'free'], req: '', gauge: 5 },
  { text: 'Requête A (attaquant) : ALLOUER une case mémoire.',
    stage: 0, cells: ['ptr', 'free', 'data', 'free'], ring: 2, req: 'A', gauge: 20, arrow: 'write' },
  { text: 'UTILISER : A y écrit ses octets « open shell » (inertes pour l’instant).',
    stage: 1, cells: ['ptr', 'free', 'evil', 'free'], ring: 2, req: 'A', gauge: 45, arrow: 'write' },
  { text: 'TRAITER : A gonfle sa consommation de mémoire jusqu’à la limite.',
    stage: 2, cells: ['ptr', 'free', 'evil', 'free'], req: 'A', gauge: 100 },
  { text: 'OUT OF MEMORY ! PHP stoppe net : NETTOYER est sauté, raccourci direct vers FIN.',
    stage: 2, oom: true, shortcut: true, cells: ['ptr', 'free', 'evil', 'free'], req: 'A', gauge: 100 },
  { text: 'FIN : le worker repart en service… mais la case « open shell » n’a jamais été vidée.',
    stage: 4, shortcut: true, cells: ['ptr', 'free', 'evil', 'free'], ring: 2, req: '', gauge: 5 },
  { text: 'Requête B (visiteur innocent), même worker : elle lit la case résiduelle → fuite.',
    stage: -1, cells: ['ptr', 'free', 'evil', 'free'], ring: 2, req: 'B', gauge: 10, arrow: 'leak' },
  { text: 'Requête C (attaquant) : même technique sur la case du pointeur → il désigne la case 2.',
    stage: -1, cells: ['ptrbad', 'free', 'evil', 'free'], ring: 0, req: 'C', gauge: 100, arrow: 'ptr' },
  { text: 'Le worker suit le pointeur et exécute « open shell » : accès shell sur le serveur.',
    stage: -1, cells: ['ptrbad', 'free', 'exec', 'free'], ring: 2, req: 'C', gauge: 20, arrow: 'ptr', shell: true },
]

const stages = ['ALLOUER', 'UTILISER', 'TRAITER', 'NETTOYER', 'FIN']
const cellText: Record<Kind, string> = { free: 'libre', data: 'data', evil: 'open shell', ptr: '→ ?', ptrbad: '→ 2', exec: 'EXEC' }
const reqLabel: Record<string, string> = { A: 'Requête A · attaquant', B: 'Requête B · visiteur', C: 'Requête C · attaquant', '': 'aucune requête' }

const first = computed(() => Math.min(Math.max(props.from, 0), steps.length - 1))
const last = computed(() => Math.min(props.to, steps.length - 1))
const idx = ref(first.value)
const playing = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

const s = computed(() => steps[idx.value])
const skipped = computed(() => idx.value >= 4 && idx.value <= 5)
const count = computed(() => last.value - first.value + 1)

function stop() { playing.value = false; if (timer) clearInterval(timer); timer = undefined }
function next() { if (idx.value < last.value) idx.value++; else stop() }
function stepForward() { stop(); next() }
function prev() { stop(); if (idx.value > first.value) idx.value-- }
function play() {
  stop()
  if (idx.value >= last.value) idx.value = first.value
  playing.value = true
  timer = setInterval(next, props.speed)
}
function restart() { idx.value = first.value; play() }
function toggle() { playing.value ? stop() : play() }
if (props.autoplay) setTimeout(play, 600)
onBeforeUnmount(stop)
</script>

<template>
  <div class="movie">
    <svg viewBox="0 -48 900 350" class="stage" role="img" aria-label="Animation de l'attaque">
      <defs>
        <marker :id="uid + '-gray'" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto"><path d="M0 0L10 5L0 10z" fill="#d1d5db" /></marker>
        <marker :id="uid + '-red'" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fca5a5" /></marker>
        <marker :id="uid + '-yellow'" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fde047" /></marker>
      </defs>

      <!-- pipeline -->
      <template v-for="(n, i) in stages" :key="n">
        <rect :x="20 + i * 176" y="10" width="148" height="44" rx="8"
              :class="['box', s.stage === i ? (s.oom ? 'err' : 'on') : '', i === 3 && skipped ? 'skip' : '']" />
        <text :x="94 + i * 176" y="38" text-anchor="middle" :class="['lbl', i === 3 && skipped ? 'skiptxt' : '']">{{ n }}</text>
        <line v-if="i < 4" :x1="168 + i * 176" y1="32" :x2="196 + i * 176" y2="32"
              :class="['link', skipped && i >= 2 ? 'dim' : '']" :marker-end="'url(#' + uid + '-gray)'" />
      </template>
      <g :class="['fade', s.shortcut ? 'show' : '']">
        <line x1="580" y1="48" x2="664" y2="16" class="cross" />
        <line x1="580" y1="16" x2="664" y2="48" class="cross" />
        <path d="M446 8 C446 -46, 798 -46, 798 6" class="shortcut" :marker-end="'url(#' + uid + '-red)'" />
        <text x="622" y="-8" text-anchor="middle" class="short-lbl">OOM : saut direct à FIN</text>
      </g>

      <!-- mémoire du worker -->
      <text x="40" y="108" class="cap">Mémoire du worker</text>
      <g v-for="(k, i) in s.cells" :key="i">
        <rect :x="40 + i * 150" y="125" width="120" height="70" rx="8"
              :class="['cell', 'k-' + k, s.ring === i ? 'ring' : '']" />
        <text :x="100 + i * 150" y="167" text-anchor="middle" :class="['ctext', 't-' + k]">{{ cellText[k] }}</text>
        <text :x="100 + i * 150" y="215" text-anchor="middle" class="idx">case {{ i }}</text>
      </g>

      <!-- requête + jauge -->
      <rect x="690" y="115" width="200" height="34" rx="17" :class="['req', 'r-' + (s.req || 'none')]" />
      <text x="790" y="137" text-anchor="middle" class="reqtxt">{{ reqLabel[s.req || ''] }}</text>
      <text x="690" y="178" class="cap">Mémoire utilisée</text>
      <rect x="690" y="188" width="200" height="18" rx="9" class="gauge-bg" />
      <rect x="690" y="188" height="18" rx="9" :width="Math.max(s.gauge, 2) * 2" :class="['gauge', s.gauge >= 100 ? 'full' : '']" />
      <text x="890" y="224" text-anchor="end" class="idx">limite</text>

      <!-- flèches -->
      <path v-if="s.arrow === 'write'" d="M790 113 C790 70, 400 70, 400 121" class="arrow red flow" :marker-end="'url(#' + uid + '-red)'" />
      <text v-if="s.arrow === 'write'" x="600" y="78" text-anchor="middle" class="albl">écrit</text>
      <g v-if="s.arrow === 'leak'">
        <path d="M400 197 L400 252" class="arrow yellow flow" :marker-end="'url(#' + uid + '-yellow)'" />
        <rect x="270" y="256" width="260" height="38" rx="8" class="leak" />
        <text x="400" y="280" text-anchor="middle" class="leaktxt">réponse à B : « open shell »</text>
      </g>
      <g v-if="s.arrow === 'ptr'">
        <path d="M100 232 C100 290, 400 290, 400 200" class="arrow yellow flow" :marker-end="'url(#' + uid + '-yellow)'" />
        <text x="250" y="287" text-anchor="middle" class="albl y">pointeur corrompu</text>
      </g>
      <g :class="['fade', s.shell ? 'show' : '']">
        <rect x="580" y="250" width="250" height="44" rx="8" class="shell" />
        <text x="705" y="279" text-anchor="middle" class="shelltxt">$ ACCÈS SHELL</text>
      </g>
    </svg>

    <div class="caption"><span class="n">{{ idx - first + 1 }}/{{ count }}</span> {{ s.text }}</div>

    <div class="ctrl">
      <button tabindex="-1" @mousedown.prevent @click="prev">Préc.</button>
      <button tabindex="-1" @mousedown.prevent @click="toggle">{{ playing ? 'Pause' : 'Lecture' }}</button>
      <button tabindex="-1" @mousedown.prevent @click="stepForward">Suiv.</button>
      <button tabindex="-1" @mousedown.prevent @click="restart">↺</button>
      <span class="dots"><i v-for="n in count" :key="n" :class="{ on: n - 1 + first <= idx }" /></span>
    </div>
  </div>
</template>

<style scoped>
.movie { background: #111827; border-radius: 12px; padding: 8px 10px 10px; color: #fff; }
.stage { width: 100%; max-height: 300px; display: block; }
.box { fill: #374151; stroke: #6b7280; stroke-width: 2; transition: all .5s; }
.box.on { fill: #1d4ed8; stroke: #93c5fd; }
.box.err { fill: #b91c1c; stroke: #fecaca; stroke-width: 3; }
.box.skip { fill: #1f2937; stroke: #6b7280; stroke-dasharray: 5 4; }
.lbl { fill: #fff; font: 700 18px ui-monospace, monospace; }
.skiptxt { fill: #9ca3af; text-decoration: line-through; }
.link { stroke: #d1d5db; stroke-width: 2.5; transition: opacity .5s; }
.link.dim { opacity: .25; }
.fade { opacity: 0; transition: opacity .6s; }
.fade.show { opacity: 1; }
.cross { stroke: #fca5a5; stroke-width: 5; stroke-linecap: round; }
.shortcut { fill: none; stroke: #fca5a5; stroke-width: 4; stroke-dasharray: 10 7; animation: dash 1s linear infinite; }
.short-lbl { fill: #fecaca; font: 700 17px ui-sans-serif, sans-serif; }
.cap { fill: #e5e7eb; font: 600 15px ui-sans-serif, sans-serif; }
.idx { fill: #d1d5db; font: 14px ui-sans-serif, sans-serif; }
.cell { stroke: transparent; stroke-width: 4; transition: fill .6s, stroke .4s; }
.k-free { fill: #374151; } .k-data { fill: #1d4ed8; } .k-evil { fill: #b91c1c; }
.k-ptr { fill: #eab308; } .k-ptrbad { fill: #eab308; } .k-exec { fill: #dc2626; }
.cell.ring { stroke: #fb923c; }
.k-exec.ring { stroke: #fff; }
.ctext { font: 700 19px ui-monospace, monospace; fill: #fff; }
.t-ptr, .t-ptrbad { fill: #111827; }
.req { transition: fill .4s; fill: #374151; }
.r-A, .r-C { fill: #b91c1c; } .r-B { fill: #15803d; }
.reqtxt { fill: #fff; font: 700 15px ui-sans-serif, sans-serif; }
.gauge-bg { fill: #374151; }
.gauge { fill: #3b82f6; transition: width .8s, fill .4s; }
.gauge.full { fill: #ef4444; }
.arrow { fill: none; stroke-width: 4; }
.arrow.red { stroke: #fca5a5; } .arrow.yellow { stroke: #fde047; }
.flow { stroke-dasharray: 10 7; animation: dash 1s linear infinite; }
.albl { fill: #fecaca; font: 700 16px ui-sans-serif, sans-serif; } .albl.y { fill: #fde047; }
.leak { fill: #854d0e; stroke: #fde047; stroke-width: 2; }
.leaktxt { fill: #fef9c3; font: 700 16px ui-sans-serif, sans-serif; }
.shell { fill: #000; stroke: #86efac; stroke-width: 3; }
.shelltxt { fill: #86efac; font: 700 22px ui-monospace, monospace; }
@keyframes dash { to { stroke-dashoffset: -34; } }

.caption { margin-top: 6px; min-height: 2.6em; font-size: 15px; line-height: 1.3; color: #fff; }
.caption .n { background: #1d4ed8; border-radius: 6px; padding: 1px 7px; margin-right: 6px; font-weight: 700; }
.ctrl { display: flex; gap: 8px; align-items: center; margin-top: 4px; }
.ctrl button { background: #1f2937; color: #fff; border: 1px solid #6b7280; border-radius: 6px; padding: 2px 12px; font-size: 14px; cursor: pointer; }
.ctrl button:hover { background: #374151; }
.dots { margin-left: auto; display: flex; gap: 5px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; background: #4b5563; }
.dots i.on { background: #60a5fa; }
</style>
