<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName } from './layoutHelper'

const props = withDefaults(defineProps<{
  density?: 'normal' | 'dense'
  footer?: boolean
  footerMode?: 'full' | 'minimal'
  footnote?: 'overlay' | 'flow'
  sectionBar?: boolean
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
</script>

<template>
  <div class="slidev-layout content" :class="pageClass">
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
