<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { getSectionBarMode } from './utils/layoutHelper'
import { buildSectionGroups } from './utils/sectionModel'

const enabled = $slidev.configs.sectionBar === true

/**
 * Compute section groups to determine the bar height.
 * The SectionBar UI is rendered inside each body layout (content, default, split)
 * so it lives within .slidev-layout and inherits per-slide CSS variable overrides.
 */
const sections = computed(() => {
  if (!enabled) return []
  return buildSectionGroups($slidev.nav.slides ?? [])
})

const currentPage = computed(() => $slidev.nav.currentPage)

const currentSlide = computed(() => {
  const slides = $slidev.nav.slides ?? []
  const idx = (currentPage.value ?? 1) - 1
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return slides[idx] as any
})

const barMode = computed(() =>
  getSectionBarMode(currentSlide.value, ($slidev.configs.sectionBarMode as string) ?? 'full'),
)

/** Keep --ustc-nav-h on :root in sync so layout padding-top is always correct. */
watchEffect(() => {
  if (!enabled || sections.value.length === 0) {
    document.documentElement.style.setProperty('--ustc-nav-h', '0px')
  } else if (barMode.value === 'minimal' || barMode.value === 'labels') {
    document.documentElement.style.setProperty('--ustc-nav-h', 'var(--ustc-nav-h-minimal)')
  } else {
    document.documentElement.style.setProperty('--ustc-nav-h', 'var(--ustc-nav-h-full)')
  }
})
</script>

<template>
  <!-- No DOM output: SectionBar is rendered inside each body layout so it
       inherits per-slide CSS variable overrides from .slidev-layout. -->
</template>
