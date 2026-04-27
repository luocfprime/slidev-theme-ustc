<script lang="ts">
// Module-level cache shared across all FigureBlock instances
let _figureMapPromise: Promise<Map<number, number>> | null = null
export function resetFigureMap() { _figureMapPromise = null }
</script>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

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

const { slides } = useNav()
const { $page } = useSlideContext()

const globalPrefix = computed(() => {
  const fm = (slides.value[0] as any)?.meta?.slide?.frontmatter
  return (fm?.figurePrefix as string) ?? 'Figure'
})

function buildFigureMap(): Promise<Map<number, number>> {
  if (_figureMapPromise) return _figureMapPromise
  _figureMapPromise = (async () => {
    const map = new Map<number, number>()
    const allSlides = slides.value ?? []
    let globalNum = 1
    for (const slide of allSlides) {
      const no = (slide as any).no as number
      try {
        const res = await fetch(`/__slidev/slides/${no}.json`)
        if (res.ok) {
          const info = await res.json()
          const content: string = info.content ?? ''
          const count = (content.match(/<FigureBlock\b/g) ?? []).length
          if (count > 0) {
            map.set(no, globalNum)
            globalNum += count
          }
        }
      } catch {}
    }
    return map
  })()
  return _figureMapPromise!
}

const el = ref<HTMLElement>()
const autoNumber = ref(0)

onMounted(async () => {
  if (props.number > 0) return
  const map = await buildFigureMap()
  const slideEl = el.value?.closest('.slidev-page') ?? el.value?.closest('.slidev-layout')
  const allFigures = Array.from(slideEl?.querySelectorAll('.figure-block') ?? [])
  const localIdx = allFigures.indexOf(el.value!)
  const startNum = map.get($page.value) ?? 1
  autoNumber.value = startNum + (localIdx >= 0 ? localIdx : 0)
})

const displayPrefix = computed(() => props.prefix || globalPrefix.value)

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
