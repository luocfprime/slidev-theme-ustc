<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName } from './layoutHelper'

const props = withDefaults(defineProps<{
  density?: 'normal' | 'dense'
  footer?: boolean
  footerMode?: 'full' | 'minimal'
  footnote?: 'overlay' | 'flow'
  sectionBar?: boolean
  lineHeight?: number
  align?: 'left' | 'center' | 'right' | 'justify'
  subtitle?: string
}>(), {
  density: 'normal',
  footer: true,
  footerMode: 'full',
  footnote: 'overlay',
  sectionBar: true,
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? []))

const pageClass = computed(() => ({
  dense: props.density === 'dense',
  'footnotes-flow': props.footnote === 'flow',
  'no-section-bar': props.sectionBar === false,
}))

const pageStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.lineHeight) s['--ustc-lh'] = String(props.lineHeight)
  if (props.align) s.textAlign = props.align
  return s
})
</script>

<template>
  <div class="slidev-layout content" :class="pageClass" :style="pageStyle">
    <slot />

    <div v-if="props.subtitle" class="content-subtitle">{{ props.subtitle }}</div>

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
