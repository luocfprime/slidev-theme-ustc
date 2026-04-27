<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { calloutDefaults } from '../defaults'

const props = withDefaults(defineProps<{
  type?: 'note' | 'tip' | 'warning' | 'important' | 'example'
  title?: string
}>(), {
  ...calloutDefaults,
})

const iconMap: Record<string, string> = {
  note:      'i-mdi-information-outline',
  tip:       'i-mdi-lightbulb-outline',
  warning:   'i-mdi-alert-outline',
  important: 'i-mdi-alert-circle-outline',
  example:   'i-mdi-beaker-outline',
}

const icon = computed(() => iconMap[props.type] ?? 'i-mdi-information-outline')
const hasTitle = computed(() => props.title.trim().length > 0)
</script>

<template>
  <div class="callout" :class="`callout-${type}`">
    <span v-if="hasTitle" class="callout-icon" :class="icon" aria-hidden="true" />
    <div class="callout-body">
      <div v-if="hasTitle" class="callout-title" v-html="renderInlineMd(title)" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  display: flex;
  gap: 0.65rem;
  padding: 0.7rem 0.9rem;
  border-radius: 6px;
  border-left: 4px solid;
  margin: 0.65rem 0;
  line-height: 1.48;
}

.callout-icon {
  display: inline-block;
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  margin-top: 0.18rem;
}

.callout-body {
  flex: 1;
  min-width: 0;
}

.callout .callout-body :deep(p) {
  margin: 0.1rem 0;
  font-size: var(--ustc-fs-callout, 1.15rem);
  line-height: 1.48;
}

.callout .callout-body :deep(li) {
  font-size: var(--ustc-fs-callout, 1.15rem);
}

.callout .callout-body :deep(code) {
  font-size: 0.88em;
}

.callout-title {
  font-weight: 650;
  margin: 0 0 0.15rem;
  font-size: 1.1rem;
}

/* note — blue */
.callout-note {
  background: rgba(30, 76, 144, 0.06);
  border-left-color: var(--ustc-blue);
  color: var(--ustc-text);
}
.callout-note .callout-icon { color: var(--ustc-blue); }
.callout-note .callout-title { color: var(--ustc-blue-dark); }

/* tip — teal */
.callout-tip {
  background: rgba(5, 150, 105, 0.06);
  border-left-color: #059669;
  color: var(--ustc-text);
}
.callout-tip .callout-icon { color: #059669; }
.callout-tip .callout-title { color: #065f46; }

/* warning — amber */
.callout-warning {
  background: rgba(217, 119, 6, 0.07);
  border-left-color: #d97706;
  color: var(--ustc-text);
}
.callout-warning .callout-icon { color: #d97706; }
.callout-warning .callout-title { color: #92400e; }

/* important — red */
.callout-important {
  background: rgba(220, 38, 38, 0.06);
  border-left-color: #dc2626;
  color: var(--ustc-text);
}
.callout-important .callout-icon { color: #dc2626; }
.callout-important .callout-title { color: #991b1b; }

/* example — purple */
.callout-example {
  background: rgba(109, 40, 217, 0.06);
  border-left-color: #7c3aed;
  color: var(--ustc-text);
}
.callout-example .callout-icon { color: #7c3aed; }
.callout-example .callout-title { color: #4c1d95; }
</style>
