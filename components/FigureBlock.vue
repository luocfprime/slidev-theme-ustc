<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { DEFAULT_NUMBER_SUFFIX, figureDefaults } from '../utils/defaults'
import { formatNumberedCaption } from '../utils/captionFormat'

const base = import.meta.env.BASE_URL

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  caption?: string
  width?: string
  imageWidth?: string | number
  captionAlign?: 'left' | 'center'
  captionInsetLeft?: string | number
  captionInsetRight?: string | number
  prefix?: string
  numberSuffix?: string
  /** Auto-injected by setup/transformers.ts numberingTransformer at compile time.
   *  Numeric for body figures (1, 2, 3, ...); string for appendix figures
   *  with prefix (e.g. "A.1", "A.2"). */
  number?: number | string
  /** Set to false to opt out of auto-numbering (no number rendered, no counter consumed). */
  numbered?: boolean
  wip?: boolean
}>(), {
  ...figureDefaults,
  numbered: true,
  wip: false,
})

if (import.meta.env.DEV && !props.src && !props.wip) {
  console.warn('[FigureBlock] missing `src` and not flagged `wip`; this will render a broken <img>.')
}

const toCss = (v: string | number) => typeof v === 'number' ? `${v}px` : v

const resolvedSrc = computed(() => {
  if (!props.src) return undefined
  return props.src.startsWith('/') ? base.replace(/\/$/, '') + props.src : props.src
})

const captionStyle = computed(() => ({
  paddingLeft: toCss(props.captionInsetLeft),
  paddingRight: toCss(props.captionInsetRight),
  textAlign: props.captionAlign,
}))

const imageStyle = computed(() => ({
  width: toCss(props.imageWidth),
}))

const displayPrefix = computed(
  () => props.prefix || ($slidev.configs.figurePrefix as string | undefined) || 'Figure',
)

const displayNumberSuffix = computed(
  () => props.numberSuffix ?? ($slidev.configs.figureNumberSuffix as string | undefined) ?? DEFAULT_NUMBER_SUFFIX,
)

const fullCaption = computed(() => formatNumberedCaption({
  prefix: displayPrefix.value,
  number: props.number,
  caption: props.caption,
  numbered: props.numbered,
  numberSuffix: displayNumberSuffix.value,
}))
</script>

<template>
  <figure class="figure-block" :class="{ 'is-wip': props.wip }" :style="{ width: props.width }">
    <img
      :src="resolvedSrc"
      :alt="props.alt"
      class="figure-image"
      :style="imageStyle"
    />
    <span v-if="props.wip" class="wip-badge">WIP</span>
    <figcaption v-if="fullCaption" class="figure-caption" :style="captionStyle" v-html="renderInlineMd(fullCaption)" />
  </figure>
</template>

<style scoped>
.figure-block {
  margin: 0 auto;
  display: block;
  max-width: 100%;
}

.figure-image {
  width: 100%;
  display: block;
  margin: 0 auto;
  max-height: 38rem;
  object-fit: contain;
}

.figure-caption {
  margin-top: var(--ustc-fig-caption-gap);
}

.figure-block.is-wip {
  position: relative;
}

.wip-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #dc2626;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.06em;
  line-height: 1.5;
}
</style>
