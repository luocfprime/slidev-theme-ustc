<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { renderInlineMd } from '../utils/markdown'
import { figureDefaults } from '../utils/defaults'
import { figureMapShared, figurePrefixShared } from '../utils/numbering'

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  caption?: string
  width?: string
  imageWidth?: string | number
  captionAlign?: 'left' | 'center'
  captionInsetLeft?: string | number
  captionInsetRight?: string | number
  prefix?: string
}>(), {
  ...figureDefaults,
})

const toCss = (v: string | number) => typeof v === 'number' ? `${v}px` : v

const captionStyle = computed(() => ({
  paddingLeft: toCss(props.captionInsetLeft),
  paddingRight: toCss(props.captionInsetRight),
  textAlign: props.captionAlign,
}))

const imageStyle = computed(() => ({
  width: toCss(props.imageWidth),
}))

const { $page } = useSlideContext()

const el = ref<HTMLElement>()
const localIdx = ref(0)

watch(el, (newEl) => {
  if (!newEl) return
  const slideEl = newEl.closest('.slidev-page') ?? newEl.closest('.slidev-layout')
  const allFigures = Array.from(slideEl?.querySelectorAll('.figure-block') ?? [])
  localIdx.value = Math.max(0, allFigures.indexOf(newEl))
}, { immediate: true })

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
  <figure ref="el" class="figure-block" :style="{ width: props.width }">
    <img :src="props.src" :alt="props.alt" class="figure-image" :style="imageStyle" />
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
</style>
