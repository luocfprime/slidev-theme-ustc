<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName } from '../utils/layoutHelper'
import { footerDefaults } from '../utils/defaults'

const props = withDefaults(defineProps<{
  footer?: boolean
  footerMode?: 'full' | 'minimal'
  wip?: boolean
}>(), {
  ...footerDefaults,
  wip: false,
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? [], $slidev.configs.presenter))
</script>

<template>
  <div class="slidev-layout section" :class="{ 'is-wip': props.wip }">
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
