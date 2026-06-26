<script setup lang="ts">
import { computed, type StyleValue } from 'vue'
import { renderInlineMd } from '../utils/markdown'

const props = defineProps<{
  title?: string
  color?: string
}>()

const blockStyle = computed<StyleValue | undefined>(() =>
  props.color ? { '--ustc-block-accent': props.color } : undefined,
)
</script>

<template>
  <div class="block" :class="{ 'block-untitled': !title }" :style="blockStyle">
    <p v-if="title" class="block-title" v-html="renderInlineMd(title)" />
    <div class="block-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.block {
  --ustc-block-accent: var(--ustc-blue-dark);
  --ustc-block-border: color-mix(in srgb, var(--ustc-block-accent) 24%, transparent);

  position: relative;
  background: #fff;
  border: 2px solid var(--ustc-block-border);
  border-radius: 6px;
  box-shadow: none;
  padding: 0 1rem 0.9rem;
  margin-top: 0.78rem;
  margin-bottom: 0.55rem;
}

.block-untitled {
  margin-top: 0;
  padding-top: 0.72rem;
}

.block-title {
  position: relative;
  top: -0.78rem;
  left: 0.55rem;
  display: inline-block;
  max-width: calc(100% - 1.1rem);
  overflow-wrap: anywhere;
  font-weight: var(--ustc-fw-semibold);
  color: var(--ustc-block-accent);
  font-size: var(--ustc-fs-block-title);
  letter-spacing: 0;
  margin: 0 0 -0.28rem;
  padding: 0 0.34rem;
  background: #fff;
  line-height: 1.25;
}

.block-body :deep(p):first-child {
  margin-top: 0;
}

.block-body :deep(p):last-child {
  margin-bottom: 0;
}

.block-untitled .block-body :deep(p):first-child {
  margin-top: 0;
}

.block-body :deep(ul),
.block-body :deep(ol) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>
