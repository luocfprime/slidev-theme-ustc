<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName } from '../utils/layoutHelper'
import { footerDefaults } from '../utils/defaults'

const props = withDefaults(defineProps<{
  footer?: boolean
  footerMode?: 'full' | 'minimal'
}>(), {
  ...footerDefaults,
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? []))
</script>

<template>
  <div class="slidev-layout backup">
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
