<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { renderInlineMd } from '../utils/markdown'
import { figureDefaults } from '../utils/defaults'
import { figureMapShared, figurePrefixShared } from '../utils/numbering'
import { useLocalIndex } from '../utils/useLocalIndex'

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
  wip?: boolean
}>(), {
  ...figureDefaults,
  wip: false,
})

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

const { $page } = useSlideContext()

const { el, localIdx } = useLocalIndex('figure-block')

const autoNumber = computed(() => {
  const startNum = figureMapShared.value.get($page.value) ?? 0
  return startNum ? startNum + localIdx.value : 0
})

const displayPrefix = computed(() => props.prefix || figurePrefixShared.value)

const fullCaption = computed(() => {
  const num = autoNumber.value
  if (!num && !props.caption) return ''
  if (!num) return props.caption
  const label = `${displayPrefix.value} ${num}`
  return props.caption ? `${label}. ${props.caption}` : label
})
</script>

<template>
  <figure ref="el" class="figure-block" :class="{ 'is-wip': props.wip }" :style="{ width: props.width }">
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
