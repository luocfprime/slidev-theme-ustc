<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  x: string
  y: string
  w?: string
  z?: number
}>()

const style = computed(() => ({
  position: 'absolute' as const,
  left: props.x,
  top: props.y,
  width: props.w ?? 'auto',
  zIndex: props.z ?? 10,
}))
</script>

<template>
  <div class="prim-abs" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.prim-abs {
  box-sizing: border-box;
}
</style>
