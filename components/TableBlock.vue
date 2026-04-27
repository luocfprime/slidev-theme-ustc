<script lang="ts">
let _tableMapPromise: Promise<Map<number, number>> | null = null
</script>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  caption?: string
  captionAlign?: 'left' | 'center'
  width?: string
  prefix?: string
  number?: number
}>(), {
  caption: '',
  captionAlign: 'center',
  width: '100%',
  prefix: '',
  number: 0,
})

const { slides } = useNav()
const { $page } = useSlideContext()

const globalPrefix = computed(() => {
  const fm = (slides.value[0] as any)?.meta?.slide?.frontmatter
  return (fm?.tablePrefix as string) ?? 'Table'
})

function buildTableMap(): Promise<Map<number, number>> {
  if (_tableMapPromise) return _tableMapPromise
  _tableMapPromise = (async () => {
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
          const count = (content.match(/<TableBlock\b/g) ?? []).length
          if (count > 0) {
            map.set(no, globalNum)
            globalNum += count
          }
        }
      } catch {}
    }
    return map
  })()
  return _tableMapPromise!
}

const el = ref<HTMLElement>()
const autoNumber = ref(0)

onMounted(async () => {
  if (props.number > 0) return
  const map = await buildTableMap()
  const slideEl = el.value?.closest('.slidev-page') ?? el.value?.closest('.slidev-layout')
  const allTables = Array.from(slideEl?.querySelectorAll('.table-block') ?? [])
  const localIdx = allTables.indexOf(el.value!)
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
  <div ref="el" class="table-block" :style="{ width }">
    <p v-if="fullCaption" class="table-block-caption" :style="{ textAlign: captionAlign }">
      {{ fullCaption }}
    </p>
    <slot />
  </div>
</template>

<style scoped>
.table-block {
  max-width: 100%;
}

.table-block-caption {
  margin: 0 0 0.3rem;
}
</style>
