<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMd } from '../utils/markdown'

const props = withDefaults(
  defineProps<{
    title?: string
    bg?: string
    borderColor?: string
  }>(),
  {
    bg: 'blue-pale',
    borderColor: 'var(--ustc-blue)',
  },
)

const bgResolved = computed(() => {
  if (props.bg === 'blue-pale') return 'var(--ustc-blue-pale)'
  if (props.bg === 'gray-soft') return 'var(--ustc-box-bg-gray)'
  return props.bg
})

const borderColorResolved = computed(() => props.borderColor)
</script>

<template>
  <div class="result-box">
    <p v-if="title" class="result-box-title" v-html="renderInlineMd(title)" />
    <div class="result-box-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.result-box {
  border: 2px solid v-bind(borderColorResolved);
  border-radius: 6px;
  background: v-bind(bgResolved);
  padding: 0.7rem 1rem;
  margin-bottom: 0.7rem;
}

.result-box-title {
  font-weight: var(--ustc-fw-semibold);
  color: var(--ustc-text);
  font-size: var(--ustc-fs-result-title);
  margin: 0 0 0.4rem;
}

.result-box-body :deep(p) {
  margin: 0.15rem 0;
  line-height: 1.5;
}
</style>
