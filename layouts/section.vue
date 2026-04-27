<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName } from './layoutHelper'

const props = withDefaults(defineProps<{
  footer?: boolean
  footerMode?: 'full' | 'minimal'
}>(), {
  footer: true,
  footerMode: 'full',
})

const presenterName = computed(() => getPresenterName($slidev.configs.authors ?? []))
</script>

<template>
  <div class="slidev-layout section">
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
