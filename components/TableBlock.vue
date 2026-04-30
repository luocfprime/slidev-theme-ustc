<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMd } from '../utils/markdown'
import { DEFAULT_NUMBER_SUFFIX, tableDefaults } from '../utils/defaults'
import { formatNumberedCaption } from '../utils/captionFormat'

const props = withDefaults(defineProps<{
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
}>(), {
  ...tableDefaults,
  numbered: true,
  wip: false,
})

const displayPrefix = computed(
  () => props.prefix || ($slidev.configs.tablePrefix as string | undefined) || 'Table',
)

const displayNumberSuffix = computed(
  () => props.numberSuffix ?? ($slidev.configs.tableNumberSuffix as string | undefined) ?? DEFAULT_NUMBER_SUFFIX,
)

const fullCaption = computed(() => formatNumberedCaption({
  prefix: displayPrefix.value,
  number: props.number,
  caption: props.caption,
  numbered: props.numbered,
  numberSuffix: displayNumberSuffix.value,
}))
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
