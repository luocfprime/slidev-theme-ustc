<script setup lang="ts">
import { computed, ref, onMounted, inject, type Ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  caption?: string
  width?: string
  captionAlign?: 'left' | 'center'
  captionInsetLeft?: string | number
  captionInsetRight?: string | number
  prefix?: string
  number?: number
}>(), {
  alt: '',
  caption: '',
  width: '100%',
  captionAlign: 'center',
  captionInsetLeft: 0,
  captionInsetRight: 0,
  prefix: '',
  number: 0,
})

const toCss = (v: string | number) => typeof v === 'number' ? `${v}px` : v

const captionStyle = computed(() => ({
  paddingLeft: toCss(props.captionInsetLeft),
  paddingRight: toCss(props.captionInsetRight),
  textAlign: props.captionAlign,
}))

const { $page } = useSlideContext()

const figureMapRef = inject<Ref<Map<number, number>>>('ustcFigureMap', ref(new Map()))
const globalPrefix = inject<string>('ustcFigurePrefix', 'Figure')

const el = ref<HTMLElement>()
const localIdx = ref(0)

onMounted(() => {
  if (props.number > 0) return
  const slideEl = el.value?.closest('.slidev-page') ?? el.value?.closest('.slidev-layout')
  const allFigures = Array.from(slideEl?.querySelectorAll('.figure-block') ?? [])
  localIdx.value = Math.max(0, allFigures.indexOf(el.value!))
})

const autoNumber = computed(() => {
  if (props.number > 0) return 0
  const startNum = figureMapRef.value.get($page.value) ?? 0
  return startNum ? startNum + localIdx.value : 0
})

const displayPrefix = computed(() => props.prefix || globalPrefix)

const fullCaption = computed(() => {
  const num = props.number > 0 ? props.number : autoNumber.value
  if (!num && !props.caption) return ''
  if (!num) return props.caption
  const label = `${displayPrefix.value} ${num}`
  return props.caption ? `${label}. ${props.caption}` : label
})
</script>

<template>
  <figure ref="el" class="figure-block" :style="{ width: props.width }">
    <img :src="props.src" :alt="props.alt" class="figure-image" />
    <figcaption v-if="fullCaption" class="figure-caption" :style="captionStyle">
      {{ fullCaption }}
    </figcaption>
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
  max-height: 30rem;
  object-fit: contain;
}

.figure-caption {
  margin-top: 0.35rem;
}
</style>
