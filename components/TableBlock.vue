<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { renderInlineMd } from '../utils/markdown'
import { tableDefaults } from '../utils/defaults'
import { tableMapShared, tablePrefixShared } from '../utils/numbering'
import { useLocalIndex } from '../utils/useLocalIndex'

const props = withDefaults(defineProps<{
  caption?: string
  captionAlign?: 'left' | 'center'
  width?: string
  prefix?: string
  wip?: boolean
}>(), {
  ...tableDefaults,
  wip: false,
})

const { $page } = useSlideContext()

const { el, localIdx } = useLocalIndex('table-block')

const autoNumber = computed(() => {
  const startNum = tableMapShared.value.get($page.value) ?? 0
  return startNum ? startNum + localIdx.value : 0
})

const displayPrefix = computed(() => props.prefix || tablePrefixShared.value)

const fullCaption = computed(() => {
  const num = autoNumber.value
  if (!num && !props.caption) return ''
  if (!num) return props.caption
  const label = `${displayPrefix.value} ${num}`
  return props.caption ? `${label}. ${props.caption}` : label
})
</script>

<template>
  <div ref="el" class="table-block" :style="{ width }">
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
