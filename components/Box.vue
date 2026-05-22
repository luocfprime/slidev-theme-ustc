<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    bg?: string
    border?: boolean
    radius?: string
  }>(),
  {
    bg: 'transparent',
    border: true,
    radius: '0',
  },
)

const bgResolved = computed(() => {
  if (props.bg === 'blue-pale') return 'var(--ustc-blue-pale)'
  if (props.bg === 'gray-soft') return 'var(--ustc-box-bg-gray)'
  return props.bg
})
</script>

<template>
  <div class="box" :class="{ 'box-no-border': !border }">
    <slot />
  </div>
</template>

<style scoped>
.box {
  background: v-bind(bgResolved);
  border: var(--ustc-box-border-width) solid var(--ustc-box-border-color);
  border-radius: v-bind(radius);
  padding: var(--ustc-box-padding);
  margin-bottom: 0.6rem;
}

.box-no-border {
  border: none;
}

/* Collapse first/last paragraph margins inside the box so its edges stay
   flush with the content. This is container-edge handling, not typography
   override — font-size / line-height / color stay inherited. */
.box :deep(p:first-child) {
  margin-top: 0;
}

.box :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
