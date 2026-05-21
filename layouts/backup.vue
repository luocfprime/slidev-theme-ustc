<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName, handleBackground } from '../utils/layoutHelper'
import { footerDefaults } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    footer?: boolean
    footerMode?: 'full' | 'minimal'
    wip?: boolean
    background?: string
  }>(),
  {
    ...footerDefaults,
    wip: false,
  },
)

const presenterName = computed(() =>
  getPresenterName($slidev.configs.authors ?? [], $slidev.configs.presenterName),
)

const bgStyle = computed(() => (props.background ? handleBackground(props.background) : undefined))
</script>

<template>
  <div class="slidev-layout backup" :class="{ 'is-wip': props.wip }" :style="bgStyle">
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
