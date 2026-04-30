<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName } from '../utils/layoutHelper'
import { renderInlineMd } from '../utils/markdown'
import { tocDefaults } from '../utils/defaults'
import { buildSectionGroups } from '../utils/sectionModel'

const props = withDefaults(defineProps<{
  highlight?: number
  footer?: boolean
  footerMode?: 'full' | 'minimal'
  columns?: 1 | 2
  wip?: boolean
}>(), {
  ...tocDefaults,
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? [], $slidev.configs.presenter))

interface TocEntry {
  title: string
  no: number
  index: number
}

const sections = computed((): TocEntry[] => {
  return buildSectionGroups($slidev.nav.slides ?? [], { stopAtBackup: false })
    .map((section, i) => ({ title: section.title, no: section.sectionNo, index: i + 1 }))
})

const hasHighlight = computed(() => props.highlight > 0)

const tocRows = computed(() => Math.ceil((sections.value.length || 1) / props.columns))

const autoFontSize = computed(() => {
  const size = Math.min(1.9, Math.max(1.0, 12 / tocRows.value))
  return `${size.toFixed(2)}rem`
})
</script>

<template>
  <div class="slidev-layout toc" :class="{ 'is-wip': props.wip }">
    <slot />

    <ol class="toc-list" :class="{ 'toc-two-col': columns === 2 }" :style="{ '--toc-fs': autoFontSize, '--toc-rows': tocRows }">
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
        <span class="toc-label" v-html="renderInlineMd(entry.title)" />
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
