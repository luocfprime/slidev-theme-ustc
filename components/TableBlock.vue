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
}>(), {
  ...tableDefaults,
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
    <p v-if="fullCaption" class="table-block-caption" :style="{ textAlign: captionAlign }" v-html="renderInlineMd(fullCaption)" />
    <slot />
  </div>
</template>

<style scoped>
.table-block {
  max-width: 100%;
}

.table-block-caption {
  margin: 0 0 var(--ustc-tab-caption-gap);
}
</style>
