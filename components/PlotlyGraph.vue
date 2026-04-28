<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Plotly from 'plotly.js-dist'

const props = defineProps<{
  filePath?: string
  graphWidth?: number
  graphHeight?: number
  xTitleFontSize?: number
  yTitleFontSize?: number
  tickFontSize?: number
  legendFontSize?: number
  annotationFontSizeScale?: number
}>()

const plotDiv = ref<HTMLElement>()
const errorMessage = ref('')
let renderRaf: number | null = null
let plotlyConfig: any = null

const base = import.meta.env.BASE_URL

async function createPlot() {
  if (!props.filePath) return
  try {
    const resolvedPath = props.filePath.startsWith('/')
      ? base.replace(/\/$/, '') + props.filePath
      : props.filePath
    const res = await fetch(resolvedPath)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    plotlyConfig = await res.json()
    scheduleDraw()
  } catch (err: any) {
    errorMessage.value = `Load failed: ${err?.message ?? err}`
  }
}

function scheduleDraw() {
  if (renderRaf) cancelAnimationFrame(renderRaf)
  renderRaf = requestAnimationFrame(() => drawPlot())
}

function buildSpec() {
  const base = plotlyConfig ?? {}
  const data = Array.isArray(base.data) ? base.data : []
  const layout: any = { ...(base.layout ?? {}) }

  if (props.graphWidth !== undefined) {
    layout.width = props.graphWidth
  } else {
    delete layout.width
  }
  if (props.graphHeight !== undefined) layout.height = props.graphHeight

  if (props.legendFontSize !== undefined && layout.legend) {
    layout.legend = { ...layout.legend, font: { ...(layout.legend.font ?? {}), size: props.legendFontSize } }
  }

  layout.xaxis = { ...(layout.xaxis ?? {}) }
  layout.yaxis = { ...(layout.yaxis ?? {}) }

  if (props.xTitleFontSize !== undefined) layout.xaxis.titlefont = { size: props.xTitleFontSize }
  if (props.yTitleFontSize !== undefined) layout.yaxis.titlefont = { size: props.yTitleFontSize }
  if (props.tickFontSize !== undefined) {
    layout.xaxis.tickfont = { size: props.tickFontSize }
    layout.yaxis.tickfont = { size: props.tickFontSize }
  }

  if (props.annotationFontSizeScale !== undefined && Array.isArray(layout.annotations)) {
    layout.annotations = layout.annotations.map((a: any) => {
      const cloned = { ...a }
      const cur = Number(cloned?.font?.size ?? 12)
      cloned.font = { ...(cloned.font ?? {}), size: cur * props.annotationFontSizeScale }
      return cloned
    })
  }

  return { data, layout }
}

function drawPlot() {
  if (!plotlyConfig || !plotDiv.value) return
  const el = plotDiv.value
  if (!el.offsetParent || el.clientWidth === 0) { scheduleDraw(); return }
  const { data, layout } = buildSpec()
  Plotly.react(el, data, layout, { displayModeBar: false, responsive: true })
    .then(() => resizePlot())
    .catch((err: any) => { errorMessage.value = `Render failed: ${err?.message ?? err}` })
}

function resizePlot() {
  if (plotDiv.value) Plotly.Plots.resize(plotDiv.value).catch(() => {})
}

onMounted(() => {
  createPlot()
  window.addEventListener('resize', resizePlot)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizePlot)
  if (renderRaf) cancelAnimationFrame(renderRaf)
  if (plotDiv.value) Plotly.purge(plotDiv.value)
})
</script>

<template>
  <div class="plotly-wrap">
    <div ref="plotDiv" class="plotly-canvas" />
    <p v-if="errorMessage" class="plotly-error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.plotly-wrap  { width: 100%; }
.plotly-canvas { width: 100%; }
.plotly-error {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #b91c1c;
}
</style>
