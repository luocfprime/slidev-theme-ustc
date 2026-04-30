<script setup lang="ts">
import { computed } from 'vue'
import { useBodyLayout } from '../utils/useBodyLayout'
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

const { presenterName, pageClass, pageStyle, layoutEl } = useBodyLayout(props)
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
