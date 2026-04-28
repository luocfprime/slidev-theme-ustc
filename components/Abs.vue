<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  x: string | number
  y: string | number
  w?: string | number
  z?: number
}>()

const toCss = (v: string | number) => typeof v === 'number' ? `${v}px` : v

const style = computed(() => ({
  position: 'absolute' as const,
  left: toCss(props.x),
  top: toCss(props.y),
  width: props.w != null ? toCss(props.w) : 'auto',
  zIndex: props.z ?? 10,
}))
</script>

<template>
  <div class="abs" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.abs {
  box-sizing: border-box;
}
</style>
