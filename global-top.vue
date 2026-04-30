<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { getLayout, getSectionTitle } from './utils/layoutHelper'

const enabled = $slidev.configs.sectionBar === true

interface SectionGroup {
  title: string
  sectionNo: number
  slideNos: number[]
}

/**
 * Compute section groups to determine the bar height.
 * The SectionBar UI is rendered inside each body layout (content, default, split)
 * so it lives within .slidev-layout and inherits per-slide CSS variable overrides.
 */
const sections = computed((): SectionGroup[] => {
  if (!enabled) return []
  const slides = $slidev.nav.slides ?? []
  const result: SectionGroup[] = []
  let cur: SectionGroup | null = null

  for (const slide of slides) {
    const layout = getLayout(slide)
    const no = slide.no ?? 0
    if (layout === 'backup') break
    if (layout === 'section') {
      const title = getSectionTitle(slide, `§${result.length + 1}`)
      cur = { title, sectionNo: no, slideNos: [] }
      result.push(cur)
    } else if (layout !== 'cover' && layout !== 'end' && layout !== 'toc' && layout !== 'blank' && cur) {
      cur.slideNos.push(no)
    }
  }
  return result
})

const currentPage = computed(() => $slidev.nav.currentPage)

const currentSlide = computed(() => {
  const slides = $slidev.nav.slides ?? []
  const idx = (currentPage.value ?? 1) - 1
  return slides[idx] as any
})

const barMode = computed(() => {
  const s = currentSlide.value
  const local =
    s?.frontmatter?.sectionBarMode ??
    s?.meta?.slide?.frontmatter?.sectionBarMode ??
    s?.meta?.frontmatter?.sectionBarMode
  return (local ?? ($slidev.configs.sectionBarMode as string) ?? 'full') as string
})

/** Keep --ustc-nav-h on :root in sync so layout padding-top is always correct. */
watchEffect(() => {
  if (!enabled || sections.value.length === 0) {
    document.documentElement.style.setProperty('--ustc-nav-h', '0px')
  } else if (barMode.value === 'minimal') {
    document.documentElement.style.setProperty('--ustc-nav-h', '1.5rem')
  } else {
    document.documentElement.style.setProperty('--ustc-nav-h', '2rem')
  }
})
</script>

<template>
  <!-- No DOM output: SectionBar is rendered inside each body layout so it
       inherits per-slide CSS variable overrides from .slidev-layout. -->
</template>
