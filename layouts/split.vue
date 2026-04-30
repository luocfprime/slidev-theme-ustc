<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, useSlots } from 'vue'
import { getPresenterName, resolveBodyMargin, handleBackground } from '../utils/layoutHelper'
import { renderInlineMd } from '../utils/markdown'
import { splitDefaults } from '../utils/defaults'

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
  align?: 'left' | 'center' | 'right'
  subtitle?: string
  background?: string
  wip?: boolean
}>(), {
  ...splitDefaults,
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? [], $slidev.configs.presenter))
const slots = useSlots()
const hasColumns = computed(() => Boolean(slots.left || slots.right))

const pageClass = computed(() => ({
  dense: props.density === 'dense',
  'footnotes-flow': props.footnote === 'flow',
  'no-section-bar': props.sectionBar === false,
  'is-wip': props.wip === true,
}))

const pageStyle = computed(() => {
  const s: Record<string, string> = { ...resolveBodyMargin(props.margin) }
  if (props.lineHeight) s['--ustc-lh'] = String(props.lineHeight)
  if (props.align) s.textAlign = props.align
  if (props.background) Object.assign(s, handleBackground(props.background))
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
    gap: gapMap[props.gap] ?? gapMap.md,
    alignItems: 'start',
  }
})

const layoutEl = ref<HTMLElement>()

// No-columns mode only: move .content-subtitle right after the h1 in the DOM
// so we don't need flex+order CSS to reorder it. In hasColumns mode the
// subtitle already lives inside .split-header next to the h1.
function placeSubtitle() {
  const root = layoutEl.value
  if (!root) return
  const subtitle = root.querySelector(':scope > .content-subtitle')
  const h1 = root.querySelector(':scope > h1')
  if (!subtitle || !h1) return
  if (h1.nextElementSibling !== subtitle) {
    h1.insertAdjacentElement('afterend', subtitle)
  }
}

onMounted(placeSubtitle)
onUpdated(placeSubtitle)
</script>

<template>
  <div ref="layoutEl" class="slidev-layout split" :class="pageClass" :style="pageStyle">
    <SectionBar :visible="props.sectionBar === false ? false : undefined" />

    <template v-if="hasColumns">
      <div class="split-header">
        <slot />
        <div v-if="props.subtitle" class="content-subtitle" v-html="renderInlineMd(props.subtitle)" />
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
