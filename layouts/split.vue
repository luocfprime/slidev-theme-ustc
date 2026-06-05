<script setup lang="ts">
import { computed, onMounted, onUpdated, useSlots } from 'vue'
import { useBodyLayout } from '../utils/useBodyLayout'
import { renderInlineMd } from '../utils/markdown'
import { splitDefaults } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    density?: 'normal' | 'compact' | 'dense'
    margin?: 'normal' | 'tight' | 'tighter' | 'none'
    footer?: boolean
    footerMode?: 'full' | 'minimal'
    ratio?: string
    footnote?: 'overlay' | 'flow'
    gap?: 'sm' | 'md' | 'lg'
    sectionBar?: boolean
    lineHeight?: number
    align?: 'left' | 'center' | 'right'
    subtitle?: string
    background?: string
    wip?: boolean
  }>(),
  {
    ...splitDefaults,
  },
)

const { presenterName, pageClass, pageStyle, layoutEl } = useBodyLayout(props)

const slots = useSlots()
const hasColumns = computed(() => Boolean(slots.left || slots.right))

// In hasColumns mode, h1 and subtitle are inside .split-header (not direct
// children of root), so useBodyLayout's placeSubtitle() can't find them.
// Mirror the same logic scoped to .split-header instead.
function placeSubtitleInHeader() {
  if (!hasColumns.value) return
  const header = layoutEl.value?.querySelector<HTMLElement>('.split-header')
  if (!header) return
  const subtitle = header.querySelector<HTMLElement>(':scope > .content-subtitle')
  const h1 = header.querySelector<HTMLElement>(':scope > h1')
  if (!subtitle || !h1 || h1.nextElementSibling === subtitle) return
  h1.insertAdjacentElement('afterend', subtitle)
}

onMounted(placeSubtitleInHeader)
onUpdated(placeSubtitleInHeader)

const gridStyle = computed(() => {
  const parts = (props.ratio ?? '2:1').split(':').map(Number)
  const cols =
    parts.length === 2 && parts.every((n) => n > 0) ? `${parts[0]}fr ${parts[1]}fr` : '2fr 1fr'
  const gapMap: Record<string, string> = { sm: '0.8rem', md: '1.4rem', lg: '2rem' }
  return {
    display: 'grid',
    gridTemplateColumns: cols,
    gap: gapMap[props.gap] ?? gapMap.md,
    alignItems: 'start',
  }
})
</script>

<template>
  <div ref="layoutEl" class="slidev-layout split" :class="pageClass" :style="pageStyle">
    <SectionBar :visible="props.sectionBar === false ? false : undefined" />

    <template v-if="hasColumns">
      <div class="split-header">
        <slot />
        <div
          v-if="props.subtitle"
          class="content-subtitle"
          v-html="renderInlineMd(props.subtitle)"
        />
      </div>
      <div :style="gridStyle">
        <div class="split-col"><slot name="left" /></div>
        <div class="split-col"><slot name="right" /></div>
      </div>
    </template>
    <template v-else>
      <slot />
      <div v-if="props.subtitle" class="content-subtitle" v-html="renderInlineMd(props.subtitle)" />
    </template>

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

<style scoped>
.split-header {
  margin-bottom: var(--ustc-title-gap);
}
.split-col {
  min-width: 0;
}
</style>
