<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { getPresenterName, resolveBodyMargin, handleBackground } from '../utils/layoutHelper'
import { bodyDefaults } from '../utils/defaults'

const props = withDefaults(defineProps<{
  density?: 'normal' | 'dense'
  margin?: 'normal' | 'tight' | 'tighter' | 'none'
  footer?: boolean
  footerMode?: 'full' | 'minimal'
  ratio?: string
  footnote?: 'overlay' | 'flow'
  gap?: 'sm' | 'md' | 'lg'
  sectionBar?: boolean
  lineHeight?: number
  align?: 'left' | 'center' | 'right' | 'justify'
  background?: string
}>(), {
  ...bodyDefaults,
  ratio: '2:1',
  gap: 'md' as 'sm' | 'md' | 'lg',
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? []))
const slots = useSlots()
const hasColumns = computed(() => Boolean(slots.left || slots.right))

const pageClass = computed(() => ({
  dense: props.density === 'dense',
  'footnotes-flow': props.footnote === 'flow',
  'no-section-bar': props.sectionBar === false,
}))

const pageStyle = computed(() => {
  const s: Record<string, string> = { ...resolveBodyMargin(props.margin) }
  if (props.lineHeight) s['--ustc-lh'] = String(props.lineHeight)
  if (props.align) s.textAlign = props.align
  if (props.background) Object.assign(s, handleBackground(props.background, false, 1.0))
  return s
})

const gridStyle = computed(() => {
  const parts = (props.ratio ?? '2:1').split(':').map(Number)
  const cols = parts.length === 2 && parts.every(n => n > 0)
    ? `${parts[0]}fr ${parts[1]}fr`
    : '2fr 1fr'
  const gapMap: Record<string, string> = { sm: '0.8rem', md: '1.4rem', lg: '2rem' }
  return {
    display: 'grid',
    gridTemplateColumns: cols,
    gap: gapMap[props.gap],
    alignItems: 'start',
  }
})
</script>

<template>
  <div class="slidev-layout split" :class="pageClass" :style="pageStyle">
    <template v-if="hasColumns">
      <div class="split-header">
        <slot />
      </div>
      <div :style="gridStyle">
        <div class="split-col"><slot name="left" /></div>
        <div class="split-col"><slot name="right" /></div>
      </div>
    </template>
    <template v-else>
      <slot />
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
  margin-bottom: 0.2rem;
}
.split-col {
  min-width: 0;
}
</style>
