<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, useSlots } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { DEFAULT_NUMBER_SUFFIX, figureDefaults } from '../utils/defaults'

const base = import.meta.env.BASE_URL
const slots = useSlots()

const props = withDefaults(
  defineProps<{
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
    /** Click-to-zoom lightbox. Tristate: omit to inherit the deck-wide
     *  `figureZoom` headmatter; `true`/`false` overrides it for this figure.
     *  Interactive only — a no-op in PDF/PNG export, where the figure still
     *  renders at its normal size. */
    zoomable?: boolean
    wip?: boolean
  }>(),
  {
    ...figureDefaults,
    numbered: true,
    // Explicit `undefined` default: keeps `zoomable` a true tristate. Without a
    // declared default, Vue casts an absent Boolean prop to `false`, which would
    // collapse "not set → inherit `figureZoom`" into "forced off".
    zoomable: undefined,
    wip: false,
  },
)

if (import.meta.env.DEV && !props.src && !props.wip) {
  console.warn(
    '[FigureBlock] missing `src` and not flagged `wip`; this will render a broken <img>.',
  )
}

const toCss = (v: string | number) => (typeof v === 'number' ? `${v}px` : v)

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
  () =>
    props.numberSuffix ??
    ($slidev.configs.figureNumberSuffix as string | undefined) ??
    DEFAULT_NUMBER_SUFFIX,
)

const showLabel = computed(() => props.numbered !== false && props.number != null)
const hasCaptionContent = computed(() => !!slots.caption || !!props.caption)
const labelText = computed(() => {
  const base = `${displayPrefix.value} ${props.number}`
  return hasCaptionContent.value ? `${base}${displayNumberSuffix.value}` : base
})

// Click-to-zoom. Tristate `zoomable` prop overrides the deck-wide
// `figureZoom` headmatter; both default off, so existing decks are unaffected.
const zoomEnabled = computed(
  () => props.zoomable ?? ($slidev.configs.figureZoom as boolean | undefined) ?? false,
)

const isOpen = ref(false)
const openZoom = () => {
  if (zoomEnabled.value && resolvedSrc.value) isOpen.value = true
}
const closeZoom = () => {
  isOpen.value = false
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeZoom()
}

// Only listen for Esc while the overlay is open; keep teardown symmetric so a
// figure unmounting mid-zoom (e.g. slide navigation) never leaks a listener.
watch(isOpen, (open) => {
  if (typeof window === 'undefined') return
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <figure class="figure-block" :class="{ 'is-wip': props.wip }" :style="{ width: props.width }">
    <img
      :src="resolvedSrc"
      :alt="props.alt"
      class="figure-image"
      :class="{ 'is-zoomable': zoomEnabled }"
      :style="imageStyle"
      @click="openZoom"
    />
    <span v-if="props.wip" class="wip-badge">WIP</span>
    <figcaption v-if="showLabel || hasCaptionContent" class="figure-caption" :style="captionStyle">
      <span v-if="showLabel" class="figure-caption-label">{{ labelText }}</span>
      <slot name="caption">
        <span v-if="props.caption" v-html="renderInlineMd(props.caption)" />
      </slot>
    </figcaption>
  </figure>

  <Teleport to="body">
    <Transition name="ustc-zoom">
      <div v-if="isOpen" class="ustc-zoom-overlay" @click="closeZoom">
        <img :src="resolvedSrc" :alt="props.alt" class="ustc-zoom-img" />
      </div>
    </Transition>
  </Teleport>
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

/* Slidev wraps slot markdown in <p>. Flatten so caption stays single-line-flow,
   and force inherit so the global `:where(p)` body-size rule doesn't override the
   caption's font-size / line-height / color. */
.figure-caption :deep(p) {
  display: inline;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

.figure-block.is-wip {
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

.figure-image.is-zoomable {
  cursor: zoom-in;
}

/* Lightbox overlay (teleported to <body>, so it sits above slide chrome).
   Scoped styles still apply: the scope attribute travels with the element. */
.ustc-zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--ustc-zoom-backdrop);
  cursor: zoom-out;
}

.ustc-zoom-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}

.ustc-zoom-enter-active,
.ustc-zoom-leave-active {
  transition: opacity 0.2s ease;
}
.ustc-zoom-enter-active .ustc-zoom-img,
.ustc-zoom-leave-active .ustc-zoom-img {
  transition: transform 0.2s ease;
}
.ustc-zoom-enter-from,
.ustc-zoom-leave-to {
  opacity: 0;
}
.ustc-zoom-enter-from .ustc-zoom-img,
.ustc-zoom-leave-to .ustc-zoom-img {
  transform: scale(0.92);
}
</style>
