<script>
import Plotly from 'plotly.js-dist'

export default {
  props: {
    filePath: String,
    graphWidth: Number,
    graphHeight: Number,
    xTitleFontSize: Number,
    yTitleFontSize: Number,
    tickFontSize: Number,
    legendFontSize: Number,
    annotationFontSizeScale: Number,
  },
  data() {
    return {
      plotlyConfig: null,
      errorMessage: '',
      renderRaf: null,
    }
  },
  mounted() {
    this.createPlot()
    window.addEventListener('resize', this.resizePlot)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizePlot)
    if (this.renderRaf) cancelAnimationFrame(this.renderRaf)
    if (this.$refs.plotDiv) Plotly.purge(this.$refs.plotDiv)
  },
  methods: {
    async createPlot() {
      if (!this.filePath) return
      try {
        const res = await fetch(this.filePath)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        this.plotlyConfig = await res.json()
        this.scheduleDraw()
      } catch (err) {
        this.errorMessage = `Load failed: ${err?.message ?? err}`
      }
    },
    scheduleDraw() {
      if (this.renderRaf) cancelAnimationFrame(this.renderRaf)
      this.renderRaf = requestAnimationFrame(() => this.drawPlot())
    },
    buildSpec() {
      const base = this.plotlyConfig ?? {}
      const data = Array.isArray(base.data) ? base.data : []
      const layout = { ...(base.layout ?? {}) }

      if (this.graphWidth !== undefined) {
        layout.width = this.graphWidth
      } else {
        delete layout.width  // let responsive config control width
      }
      if (this.graphHeight !== undefined) layout.height = this.graphHeight

      if (this.legendFontSize !== undefined && layout.legend) {
        layout.legend = { ...layout.legend, font: { ...(layout.legend.font ?? {}), size: this.legendFontSize } }
      }

      layout.xaxis = { ...(layout.xaxis ?? {}) }
      layout.yaxis = { ...(layout.yaxis ?? {}) }

      if (this.xTitleFontSize !== undefined) layout.xaxis.titlefont = { size: this.xTitleFontSize }
      if (this.yTitleFontSize !== undefined) layout.yaxis.titlefont = { size: this.yTitleFontSize }
      if (this.tickFontSize !== undefined) {
        layout.xaxis.tickfont = { size: this.tickFontSize }
        layout.yaxis.tickfont = { size: this.tickFontSize }
      }

      if (this.annotationFontSizeScale !== undefined && Array.isArray(layout.annotations)) {
        layout.annotations = layout.annotations.map((a) => {
          const cloned = { ...a }
          const cur = Number(cloned?.font?.size ?? 12)
          cloned.font = { ...(cloned.font ?? {}), size: cur * this.annotationFontSizeScale }
          return cloned
        })
      }

      return { data, layout }
    },
    drawPlot() {
      if (!this.plotlyConfig || !this.$refs.plotDiv) return
      const el = this.$refs.plotDiv
      if (!el.offsetParent || el.clientWidth === 0) { this.scheduleDraw(); return }
      const { data, layout } = this.buildSpec()
      Plotly.react(el, data, layout, { displayModeBar: false, responsive: true })
        .then(() => this.resizePlot())
        .catch((err) => { this.errorMessage = `Render failed: ${err?.message ?? err}` })
    },
    resizePlot() {
      if (this.$refs.plotDiv) Plotly.Plots.resize(this.$refs.plotDiv).catch(() => {})
    },
  },
}
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
