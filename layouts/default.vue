<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName, resolveBodyMargin } from '../utils/layoutHelper'
import { bodyDefaults } from '../utils/defaults'

const props = withDefaults(defineProps<{
  density?: 'normal' | 'dense'
  margin?: 'normal' | 'tight' | 'tighter' | 'none'
  footer?: boolean
  footerMode?: 'full' | 'minimal'
  footnote?: 'overlay' | 'flow'
  sectionBar?: boolean
}>(), {
  ...bodyDefaults,
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? []))

const pageClass = computed(() => ({
  dense: props.density === 'dense',
  'footnotes-flow': props.footnote === 'flow',
  'no-section-bar': props.sectionBar === false,
}))

const pageStyle = computed(() => resolveBodyMargin(props.margin))
</script>

<template>
  <div class="slidev-layout content" :class="pageClass" :style="pageStyle">
    <slot />

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
