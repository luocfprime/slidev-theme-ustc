<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { tableDefaults } from '../utils/defaults'

const props = withDefaults(defineProps<{
  caption?: string
  captionAlign?: 'left' | 'center'
  width?: string
  prefix?: string
  /** Auto-injected by setup/transformers.ts numberingTransformer at compile time. */
  number?: number
  /** Set to false to opt out of auto-numbering (no number rendered, no counter consumed). */
  numbered?: boolean
  wip?: boolean
}>(), {
  ...tableDefaults,
  numbered: true,
  wip: false,
})

const displayPrefix = computed(
  () => props.prefix || ($slidev.configs.tablePrefix as string | undefined) || 'Table',
)

const fullCaption = computed(() => {
  const showLabel = props.numbered !== false && props.number != null
  if (!showLabel && !props.caption) return ''
  if (!showLabel) return props.caption ?? ''
  const label = `${displayPrefix.value} ${props.number}`
  return props.caption ? `${label}. ${props.caption}` : label
})
</script>

<template>
  <div class="table-block" :style="{ width: props.width }">
    <div v-if="fullCaption || props.wip" class="table-block-caption" :style="{ justifyContent: captionAlign === 'left' ? 'flex-start' : 'center' }">
      <span v-if="fullCaption" v-html="renderInlineMd(fullCaption)" />
      <span v-if="props.wip" class="wip-badge">WIP</span>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.table-block {
  max-width: 100%;
}

.table-block-caption {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 var(--ustc-tab-caption-gap);
}

.wip-badge {
  display: inline-block;
  background: #dc2626;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.06em;
  line-height: 1.5;
  vertical-align: middle;
}
</style>
