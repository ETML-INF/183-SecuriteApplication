<script setup lang="ts">
// Pipeline d'une requête. `oom` = true : l'erreur "mémoire pleine" court-circuite NETTOYER.
import { useId } from 'vue'
const props = defineProps({ oom: { type: Boolean, default: false } })
const uid = 'fs' + useId().replace(/[^a-zA-Z0-9]/g, '')
const stages = ['ALLOUER', 'UTILISER', 'TRAITER', 'NETTOYER', 'FIN']
</script>

<template>
  <svg :viewBox="oom ? `0 -40 900 104` : `0 0 900 64`" class="flow" role="img" aria-label="Pipeline d'une requête">
    <defs>
      <marker :id="uid + '-gray'" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto"><path d="M0 0L10 5L0 10z" fill="#d1d5db" /></marker>
      <marker :id="uid + '-red'" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fca5a5" /></marker>
    </defs>
    <template v-for="(s, i) in stages" :key="s">
      <rect
        :x="20 + i * 176" y="10" width="148" height="44" rx="8"
        :class="['box', oom && i === 2 ? 'err' : '', oom && i === 3 ? 'skip' : '', oom && i === 4 ? 'goal' : '']"
      />
      <text :x="94 + i * 176" y="38" text-anchor="middle" :class="['lbl', oom && i === 3 ? 'skiptxt' : '']">{{ s }}</text>
      <line v-if="i < 4" :x1="168 + i * 176" y1="32" :x2="196 + i * 176" y2="32"
            :class="['link', oom && i >= 2 ? 'dim' : '']" :marker-end="'url(#' + uid + '-gray)'" />
    </template>
    <g v-if="oom">
      <line x1="580" y1="48" x2="664" y2="16" class="cross" />
      <line x1="580" y1="16" x2="664" y2="48" class="cross" />
      <path d="M446 8 C446 -46, 798 -46, 798 6" class="shortcut" :marker-end="'url(#' + uid + '-red)'" />
      <text x="622" y="-8" text-anchor="middle" class="short-lbl">OOM : saut direct à FIN</text>
    </g>
  </svg>
</template>

<style scoped>
.flow { width: 100%; max-height: 110px; background: #111827; border-radius: 10px; }
.box { fill: #1d4ed8; stroke: #93c5fd; stroke-width: 2; }
.box.err { fill: #b91c1c; stroke: #fecaca; }
.box.skip { fill: #374151; stroke: #6b7280; stroke-dasharray: 5 4; }
.box.goal { fill: #1d4ed8; stroke: #fecaca; stroke-width: 3; }
.lbl { fill: #fff; font: 700 18px ui-monospace, monospace; }
.skiptxt { fill: #9ca3af; }
.link { stroke: #d1d5db; stroke-width: 2.5; }
.link.dim { opacity: .25; }
.cross { stroke: #fca5a5; stroke-width: 5; stroke-linecap: round; }
.shortcut { fill: none; stroke: #fca5a5; stroke-width: 4; stroke-dasharray: 10 7; animation: dash 1s linear infinite; }
.short-lbl { fill: #fecaca; font: 700 17px ui-sans-serif, sans-serif; }
@keyframes dash { to { stroke-dashoffset: -34; } }
</style>
