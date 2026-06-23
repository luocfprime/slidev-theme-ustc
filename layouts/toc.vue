<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName, handleBackground } from '../utils/layoutHelper'
import { renderInlineMd } from '../utils/markdown'
import { tocDefaults } from '../utils/defaults'
import { buildSectionGroups } from '../utils/sectionModel'

type TocVariant = 'arrow' | 'classic'

const props = withDefaults(
  defineProps<{
    highlight?: number
    footer?: boolean
    footerMode?: 'full' | 'minimal'
    columns?: 1 | 2
    variant?: TocVariant
    wip?: boolean
    background?: string
  }>(),
  {
    ...tocDefaults,
  },
)

const bgStyle = computed(() => (props.background ? handleBackground(props.background) : undefined))

const presenterName = computed(() =>
  getPresenterName($slidev.configs.authors ?? [], $slidev.configs.presenterName),
)

interface TocEntry {
  title: string
  no: number
  index: number
}

const sections = computed((): TocEntry[] => {
  return buildSectionGroups($slidev.nav.slides ?? [], { stopAtBackup: false }).map(
    (section, i) => ({ title: section.title, no: section.sectionNo, index: i + 1 }),
  )
})

const hasHighlight = computed(() => props.highlight > 0)

const effectiveVariant = computed<TocVariant>(() => {
  if (props.variant) return props.variant
  return props.columns === undefined ? 'arrow' : 'classic'
})

const effectiveColumns = computed(() => props.columns ?? 1)

const isClassic = computed(() => effectiveVariant.value === 'classic')

const tocRows = computed(() => Math.ceil((sections.value.length || 1) / effectiveColumns.value))

const autoFontSize = computed(() => {
  const size = Math.min(1.9, Math.max(1.0, 12 / tocRows.value))
  return `${size.toFixed(2)}rem`
})

function formatTocIndex(index: number): string {
  return index.toString().padStart(2, '0')
}
</script>

<template>
  <div
    class="slidev-layout toc"
    :class="[`toc-variant-${effectiveVariant}`, { 'is-wip': props.wip }]"
    :style="bgStyle"
  >
    <slot />

    <ol
      class="toc-list"
      :class="{ 'toc-two-col': isClassic && effectiveColumns === 2 }"
      :style="{ '--toc-fs': autoFontSize, '--toc-rows': tocRows }"
    >
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
        <span v-if="effectiveVariant === 'arrow'" class="toc-num">{{
          formatTocIndex(entry.index)
        }}</span>
        <span v-if="effectiveVariant === 'arrow'" class="toc-arrow">▶</span>
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
