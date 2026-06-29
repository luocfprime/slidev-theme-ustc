<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { calloutDefaults } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    type?: 'note' | 'tip' | 'warning' | 'important' | 'example'
    title?: string
    showIcon?: boolean
    filled?: boolean
  }>(),
  {
    ...calloutDefaults,
  },
)

const iconMap: Record<string, string> = {
  note: 'i-mdi-information-outline',
  tip: 'i-mdi-lightbulb-outline',
  warning: 'i-mdi-alert-outline',
  important: 'i-mdi-alert-circle-outline',
  example: 'i-mdi-beaker-outline',
}

const icon = computed(() => iconMap[props.type] ?? 'i-mdi-information-outline')
const hasTitle = computed(() => (props.title ?? '').trim().length > 0)
const hasIcon = computed(() => props.showIcon && hasTitle.value)
</script>

<template>
  <div class="callout" :class="[`callout-${type}`, { 'callout-filled': filled }]">
    <div v-if="hasTitle" class="callout-title">
      <span v-if="hasIcon" class="callout-icon" :class="icon" aria-hidden="true" />
      <span class="callout-title-text" v-html="renderInlineMd(title)" />
    </div>
    <div class="callout-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  display: block;
  padding: 0.42rem 0.85rem 0.46rem 0.9rem;
  border-radius: 0;
  border-left: 4px solid;
  margin-bottom: 0.65rem;
  line-height: var(--ustc-lh);
  background: transparent;
  color: var(--ustc-text);
}

.callout-filled {
  border-radius: 6px;
  background: var(--callout-bg);
}

.callout-icon {
  display: inline-flex;
  width: 1.05em;
  height: 1.05em;
  flex-shrink: 0;
}

.callout .callout-body :deep(p) {
  margin: 0.1rem 0;
  line-height: var(--ustc-lh);
}

.callout .callout-body :deep(p):first-child {
  margin-top: 0;
}

.callout .callout-body :deep(p):last-child {
  margin-bottom: 0;
}

.callout .callout-body :deep(code) {
  font-size: 0.88em;
}

.callout-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: var(--ustc-fw-semibold);
  margin: 0 0 0.18rem;
  font-size: var(--ustc-fs-callout-title);
  line-height: 1.28;
}

.callout-title-text {
  min-width: 0;
}

/* note — blue */
.callout-note {
  --callout-bg: rgba(30, 76, 144, 0.06);
  border-left-color: var(--ustc-blue);
}
.callout-note .callout-icon {
  color: var(--ustc-blue);
}
.callout-note .callout-title {
  color: var(--ustc-blue-dark);
}

/* tip — teal */
.callout-tip {
  --callout-bg: rgba(5, 150, 105, 0.06);
  border-left-color: #059669;
}
.callout-tip .callout-icon {
  color: #059669;
}
.callout-tip .callout-title {
  color: #065f46;
}

/* warning — amber */
.callout-warning {
  --callout-bg: rgba(217, 119, 6, 0.07);
  border-left-color: #d97706;
}
.callout-warning .callout-icon {
  color: #d97706;
}
.callout-warning .callout-title {
  color: #92400e;
}

/* important — red */
.callout-important {
  --callout-bg: rgba(220, 38, 38, 0.06);
  border-left-color: #dc2626;
}
.callout-important .callout-icon {
  color: #dc2626;
}
.callout-important .callout-title {
  color: #991b1b;
}

/* example — purple */
.callout-example {
  --callout-bg: rgba(109, 40, 217, 0.06);
  border-left-color: #7c3aed;
}
.callout-example .callout-icon {
  color: #7c3aed;
}
.callout-example .callout-title {
  color: #4c1d95;
}
</style>
