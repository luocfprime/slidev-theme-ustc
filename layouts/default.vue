<script setup lang="ts">
// Intentionally identical to layouts/content.vue — changes must be mirrored there.
import { computed, onMounted, onUpdated, ref } from 'vue'
import { getPresenterName, resolveBodyMargin, handleBackground } from '../utils/layoutHelper'
import { renderInlineMd } from '../utils/markdown'
import { bodyDefaults } from '../utils/defaults'

const props = withDefaults(defineProps<{
  density?: 'normal' | 'dense'
  margin?: 'normal' | 'tight' | 'tighter' | 'none'
  footer?: boolean
  footerMode?: 'full' | 'minimal'
  footnote?: 'overlay' | 'flow'
  sectionBar?: boolean
  lineHeight?: number
  align?: 'left' | 'center' | 'right'
  subtitle?: string
  background?: string
  wip?: boolean
}>(), {
  ...bodyDefaults,
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? [], $slidev.configs.presenter))

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

const layoutEl = ref<HTMLElement>()

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
  <div ref="layoutEl" class="slidev-layout content" :class="pageClass" :style="pageStyle">
    <SectionBar :visible="props.sectionBar === false ? false : undefined" />

    <slot />

    <div v-if="props.subtitle" class="content-subtitle" v-html="renderInlineMd(props.subtitle)" />

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
