<script setup lang="ts">
import { computed, type StyleValue } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { noteDefaults } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    title?: string
    color?: string
    divider?: boolean
  }>(),
  {
    ...noteDefaults,
  },
)

const noteStyle = computed<StyleValue>(() => ({
  '--ustc-note-accent': props.color,
}))
</script>

<template>
  <div class="note" :class="{ 'note-no-divider': !divider }" :style="noteStyle">
    <p v-if="title" class="note-title" v-html="renderInlineMd(title)" />
    <div class="note-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.note {
  --ustc-note-accent: var(--ustc-blue-dark);
  --ustc-note-divider: #d6dfed;

  background: transparent;
  border: 0;
  color: var(--ustc-text);
  margin: 0;
  padding: 0;
}

.note-title {
  margin: 0 0 0.2rem;
  padding: 0 0 0.15rem;
  border-bottom: 2px solid var(--ustc-note-divider);
  color: var(--ustc-note-accent);
  font-size: var(--ustc-fs-note-title);
  font-weight: 800;
  line-height: var(--ustc-lh);
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

.note-no-divider .note-title {
  margin-bottom: 0.2rem;
  padding-bottom: 0;
  border-bottom: 0;
}

.note-body {
  font-size: var(--ustc-fs-note-body);
  line-height: 1.55;
}

.note-body :deep(p) {
  margin: 0;
  font-size: var(--ustc-fs-note-body);
  line-height: 1.55;
}

.note-body :deep(p + p) {
  margin-top: 0.35rem;
}

.note-body :deep(ul),
.note-body :deep(ol) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.note-body :deep(code),
.note-title :deep(code) {
  font-size: 0.88em;
}
</style>
