<script setup lang="ts">
import { renderInlineMd } from '../utils/markdown'
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="prim-block" :class="{ 'prim-block-untitled': !title }">
    <p v-if="title" class="prim-block-title" v-html="renderInlineMd(title)" />
    <div class="prim-block-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.prim-block {
  background: #fff;
  border: 1px solid rgba(30, 76, 144, 0.16);
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.035);
  padding: 0 0.95rem 0.62rem;
  margin: 0.55rem 0;
}

.prim-block-untitled {
  padding-top: 0.58rem;
}

.prim-block-title {
  font-weight: var(--ustc-fw-semibold);
  color: var(--ustc-blue-dark);
  font-size: 1.05rem;
  letter-spacing: 0;
  margin: 0 -0.95rem 0.48rem;
  padding: 0.32rem 0.95rem 0.3rem;
  background: rgba(30, 76, 144, 0.035);
  border-bottom: 1px solid rgba(30, 76, 144, 0.14);
  line-height: 1.28;
}

.prim-block-body :deep(p):first-child {
  margin-top: 0.35rem;
}

.prim-block-body :deep(p):last-child {
  margin-bottom: 0;
}

.prim-block-untitled .prim-block-body :deep(p):first-child {
  margin-top: 0;
}

.prim-block-body :deep(ul),
.prim-block-body :deep(ol) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>
