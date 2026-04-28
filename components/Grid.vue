<script setup lang="ts">
import { computed } from 'vue'
import { gridDefaults } from '../utils/defaults'

const props = withDefaults(defineProps<{
  cols?: string
  gap?: 'sm' | 'md' | 'lg'
  alignY?: 'top' | 'center' | 'bottom'
}>(), {
  ...gridDefaults,
})

const gridStyle = computed(() => {
  const gapMap = { sm: '0.8rem', md: '1.4rem', lg: '2rem' }
  const alignMap = { top: 'start', center: 'center', bottom: 'end' }

  const trimmed = props.cols.trim()
  const templateColumns = /^\d+$/.test(trimmed)
    ? `repeat(${trimmed}, 1fr)`
    : /^[\d\s]+$/.test(trimmed)
      ? trimmed.split(/\s+/).map(n => `${n}fr`).join(' ')
      : trimmed

  return {
    display: 'grid',
    gridTemplateColumns: templateColumns,
    gap: gapMap[props.gap as keyof typeof gapMap] ?? gapMap.md,
    alignItems: alignMap[props.alignY],
  }
})
</script>

<template>
  <div class="grid" :style="gridStyle">
    <slot />
  </div>
</template>

<style scoped>
.grid {
  width: 100%;
}
</style>
