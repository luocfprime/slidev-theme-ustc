<script setup lang="ts">
import { computed } from 'vue'
import { gridDefaults } from '../defaults'

const props = withDefaults(defineProps<{
  cols?: string
  gap?: 'sm' | 'md' | 'lg'
  align?: 'top' | 'center' | 'bottom'
}>(), {
  ...gridDefaults,
})

const gridStyle = computed(() => {
  const gapMap = { sm: '0.6rem', md: '1.2rem', lg: '2rem' }
  const alignMap = { top: 'start', center: 'center', bottom: 'end' }

  const trimmed = props.cols.trim()
  const templateColumns = /^\d+$/.test(trimmed)
    ? `repeat(${trimmed}, 1fr)`
    : trimmed.split(/\s+/).map(n => `${n}fr`).join(' ')

  return {
    display: 'grid',
    gridTemplateColumns: templateColumns,
    gap: gapMap[props.gap],
    alignItems: alignMap[props.align],
  }
})
</script>

<template>
  <div class="prim-grid" :style="gridStyle">
    <slot />
  </div>
</template>

<style scoped>
.prim-grid {
  width: 100%;
}
</style>
