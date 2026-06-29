<script setup lang="ts">
import { computed, type StyleValue } from 'vue'
import { vspaceDefaults } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    size?: string | number
  }>(),
  {
    ...vspaceDefaults,
  },
)

const sizeMap: Record<string, string> = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}

const toCssSize = (value: string | number) => {
  if (typeof value === 'number') return `${value}px`
  const trimmed = value.trim()
  const negative = trimmed.startsWith('-')
  const token = negative ? trimmed.slice(1).trim() : trimmed
  const resolved = sizeMap[token] ?? (/^\d+(?:\.\d+)?$/.test(token) ? `${token}px` : token)
  return negative ? `-${resolved}` : resolved
}

const spaceStyle = computed<StyleValue>(() => {
  const size = toCssSize(props.size)
  if (size.startsWith('-')) {
    return {
      height: 0,
      marginBottom: size,
    }
  }
  return {
    height: size,
  }
})
</script>

<template>
  <div class="vspace" aria-hidden="true" :style="spaceStyle" />
</template>

<style scoped>
.vspace {
  display: block;
  width: 100%;
  min-height: 0;
  margin: 0;
  padding: 0;
  flex: 0 0 auto;
  pointer-events: none;
}
</style>
