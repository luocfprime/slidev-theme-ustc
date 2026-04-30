<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { videoDefaults } from '../utils/defaults'

const base = import.meta.env.BASE_URL

const props = withDefaults(defineProps<{
  src?: string
  caption?: string
  width?: string
  videoWidth?: string | number
  captionAlign?: 'left' | 'center'
  captionInsetLeft?: string | number
  captionInsetRight?: string | number
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  wip?: boolean
}>(), {
  ...videoDefaults,
})

if (import.meta.env.DEV && !props.src && !props.wip) {
  console.warn('[VideoBlock] missing `src` and not flagged `wip`; this will render a broken <video>.')
}

const toCss = (v: string | number) => typeof v === 'number' ? `${v}px` : v

const resolvedSrc = computed(() => {
  if (!props.src) return undefined
  return props.src.startsWith('/') ? base.replace(/\/$/, '') + props.src : props.src
})

const videoStyle = computed(() => ({ width: toCss(props.videoWidth) }))

const captionStyle = computed(() => ({
  paddingLeft: toCss(props.captionInsetLeft),
  paddingRight: toCss(props.captionInsetRight),
  textAlign: props.captionAlign,
}))
</script>

<template>
  <figure class="video-block" :class="{ 'is-wip': props.wip }" :style="{ width: props.width }">
    <video
      :src="resolvedSrc"
      class="video-element"
      :style="videoStyle"
      :controls="props.controls"
      :autoplay="props.autoplay"
      :loop="props.loop"
      :muted="props.muted || props.autoplay"
      playsinline
    />
    <span v-if="props.wip" class="wip-badge">WIP</span>
    <figcaption v-if="props.caption" class="figure-caption" :style="captionStyle" v-html="renderInlineMd(props.caption)" />
  </figure>
</template>

<style scoped>
.video-block {
  margin: 0 auto;
  display: block;
  max-width: 100%;
}

.video-element {
  width: 100%;
  display: block;
  margin: 0 auto;
  max-height: 38rem;
}

.figure-caption {
  margin-top: var(--ustc-fig-caption-gap);
}

.video-block.is-wip {
  position: relative;
}

.wip-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--ustc-wip);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.06em;
  line-height: 1.5;
}
</style>
