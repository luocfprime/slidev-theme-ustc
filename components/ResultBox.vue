<script setup lang="ts">
import { renderInlineMd } from '../utils/markdown'
defineProps<{
  title?: string
}>()
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
  border: 2px solid var(--ustc-blue);
  border-radius: 6px;
  background: var(--ustc-blue-pale);
  padding: 0.7rem 1rem;
  margin: 0.7rem 0;
}

.result-box-title {
  font-weight: var(--ustc-fw-semibold);
  color: var(--ustc-blue-dark);
  font-size: var(--ustc-fs-result-title);
  margin: 0 0 0.4rem;
}

.result-box-body :deep(p) {
  margin: 0.15rem 0;
  line-height: 1.5;
}
</style>
