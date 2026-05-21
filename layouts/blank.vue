<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground } from '../utils/layoutHelper'

const props = withDefaults(
  defineProps<{
    wip?: boolean
    background?: string
  }>(),
  {
    wip: false,
  },
)

const bgStyle = computed(() => (props.background ? handleBackground(props.background) : undefined))
</script>

<template>
  <div class="slidev-layout blank" :class="{ 'is-wip': props.wip }" :style="bgStyle">
    <slot />
  </div>
</template>
