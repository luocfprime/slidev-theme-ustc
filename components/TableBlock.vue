<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { DEFAULT_NUMBER_SUFFIX, tableDefaults } from '../utils/defaults'

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    caption?: string
    captionAlign?: 'left' | 'center'
    width?: string
    prefix?: string
    numberSuffix?: string
    /** Auto-injected by setup/transformers.ts numberingTransformer at compile time.
     *  Numeric for body tables; string for appendix tables (e.g. "A.1"). */
    number?: number | string
    /** Set to false to opt out of auto-numbering (no number rendered, no counter consumed). */
    numbered?: boolean
    wip?: boolean
  }>(),
  {
    ...tableDefaults,
    numbered: true,
    wip: false,
  },
)

const displayPrefix = computed(
  () => props.prefix || ($slidev.configs.tablePrefix as string | undefined) || 'Table',
)

const displayNumberSuffix = computed(
  () =>
    props.numberSuffix ??
    ($slidev.configs.tableNumberSuffix as string | undefined) ??
    DEFAULT_NUMBER_SUFFIX,
)

const showLabel = computed(() => props.numbered !== false && props.number != null)
const hasCaptionContent = computed(() => !!slots.caption || !!props.caption)
const labelText = computed(() => {
  const base = `${displayPrefix.value} ${props.number}`
  return hasCaptionContent.value ? `${base}${displayNumberSuffix.value}` : base
})
</script>

<template>
  <div class="table-block" :style="{ width: props.width }">
    <div
      v-if="showLabel || hasCaptionContent || props.wip"
      class="table-block-caption"
      :style="{ justifyContent: captionAlign === 'left' ? 'flex-start' : 'center' }"
    >
      <span v-if="showLabel || hasCaptionContent" class="table-block-caption-text">
        <span v-if="showLabel" class="table-caption-label">{{ labelText }}</span>
        <slot name="caption">
          <span v-if="props.caption" v-html="renderInlineMd(props.caption)" />
        </slot>
      </span>
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

/* Slidev wraps slot markdown in <p>. Flatten so caption stays inline within the flex row,
   and force inherit so the global `:where(p)` body-size rule doesn't override the
   caption's font-size / line-height / color. */
.table-block-caption :deep(p) {
  display: inline;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

.wip-badge {
  display: inline-block;
  background: var(--ustc-wip);
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
