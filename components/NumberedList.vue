<script setup lang="ts">
import { computed, type StyleValue } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { numberedListDefaults, type NumberedListItem } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    items?: NumberedListItem[]
    start?: number
    color?: string
    divider?: boolean
  }>(),
  {
    ...numberedListDefaults,
  },
)

const listStyle = computed<StyleValue>(() => ({
  '--ustc-numbered-list-accent': props.color,
}))
</script>

<template>
  <ol class="numbered-list" :class="{ 'numbered-list-no-divider': !divider }" :style="listStyle">
    <li v-for="(item, index) in items" :key="`${index}-${item.title}`" class="numbered-list-item">
      <span class="numbered-list-marker">
        <span class="numbered-list-marker-text">{{ start + index }}</span>
      </span>
      <div class="numbered-list-content">
        <p class="numbered-list-title" v-html="renderInlineMd(item.title)" />
        <p v-if="item.body" class="numbered-list-body" v-html="renderInlineMd(item.body)" />
      </div>
    </li>
  </ol>
</template>

<style scoped>
ol.numbered-list.numbered-list {
  --ustc-numbered-list-accent: var(--ustc-blue);
  --ustc-numbered-list-line: #d7dfeb;
  --ustc-numbered-list-marker-size: calc(var(--ustc-fs-body) * 1.24);
  --ustc-numbered-list-marker-gap: 0.75rem;
  --ustc-numbered-list-item-gap: 0.6rem;

  display: grid;
  gap: var(--ustc-numbered-list-item-gap);
  margin: 0 0 var(--ustc-component-gap);
  padding: 0;
  list-style: none;
}

li.numbered-list-item.numbered-list-item {
  display: grid;
  grid-template-columns: var(--ustc-numbered-list-marker-size) minmax(0, 1fr);
  column-gap: var(--ustc-numbered-list-marker-gap);
  align-items: start;
  margin: 0;
  padding: 0;
}

.numbered-list-marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ustc-numbered-list-marker-size);
  height: var(--ustc-numbered-list-marker-size);
  border-radius: 999px;
  background: var(--ustc-numbered-list-accent);
  color: #fff;
  font-size: calc(var(--ustc-numbered-list-marker-size) * 0.68);
  font-weight: var(--ustc-fw-semibold);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.numbered-list-marker-text {
  display: block;
  line-height: 1;
  transform: translateY(0.02em);
}

.numbered-list-content {
  min-width: 0;
  padding-bottom: 0.62rem;
  border-bottom: 1px solid var(--ustc-numbered-list-line);
}

.numbered-list-item:last-child .numbered-list-content,
.numbered-list-no-divider .numbered-list-content {
  padding-bottom: 0;
  border-bottom: 0;
}

.numbered-list-title {
  margin: 0;
  color: var(--ustc-numbered-list-accent);
  font-size: var(--ustc-fs-body);
  font-weight: var(--ustc-fw-semibold);
  line-height: 1.24;
}

.numbered-list-body {
  margin: 0.48rem 0 0;
  color: var(--ustc-text);
  font-size: var(--ustc-fs-body);
  line-height: 1.35;
}

.numbered-list-body :deep(code),
.numbered-list-title :deep(code) {
  font-size: 0.88em;
}
</style>
