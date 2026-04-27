<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName } from './layoutHelper'

const props = withDefaults(defineProps<{
  highlight?: number
  footer?: boolean
  footerMode?: 'full' | 'minimal'
}>(), {
  highlight: 0,
  footer: true,
  footerMode: 'full',
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? []))

function getLayout(slide: any): string {
  return slide?.frontmatter?.layout ?? slide?.meta?.layout ?? slide?.meta?.frontmatter?.layout ?? ''
}

interface TocEntry {
  title: string
  no: number
  index: number
}

const sections = computed((): TocEntry[] => {
  const slides = $slidev.nav.slides ?? []
  const result: TocEntry[] = []

  slides.forEach((slide: any, i: number) => {
    if (getLayout(slide) === 'section') {
      const title: string =
        slide.frontmatter?.sectionLabel ??
        slide.meta?.slide?.frontmatter?.sectionLabel ??
        slide.meta?.frontmatter?.sectionLabel ??
        slide.meta?.slide?.title ??
        slide.meta?.title ??
        slide.title ??
        slide.frontmatter?.title ??
        `§${result.length + 1}`
      result.push({ title, no: slide.no ?? (i + 1), index: result.length + 1 })
    }
  })
  return result
})

const hasHighlight = computed(() => props.highlight > 0)
</script>

<template>
  <div class="slidev-layout toc">
    <slot />

    <ol class="toc-list">
      <li
        v-for="entry in sections"
        :key="entry.index"
        class="toc-item"
        :class="{
          'is-highlighted': hasHighlight && entry.index === highlight,
          'is-dimmed': hasHighlight && entry.index !== highlight,
        }"
        @click="$slidev.nav.go(entry.no)"
      >
        <span class="toc-label">{{ entry.title }}</span>
      </li>
    </ol>

    <PageFooter
      v-if="props.footer"
      :title="$slidev.configs.talkTitle"
      :author="presenterName"
      :meeting="$slidev.configs.conference"
      :date="$slidev.configs.date"
      :mode="props.footerMode"
    />
  </div>
</template>
