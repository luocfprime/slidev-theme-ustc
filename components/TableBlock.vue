<script setup lang="ts">
import { computed, ref, onMounted, inject, type Ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  caption?: string
  captionAlign?: 'left' | 'center'
  width?: string
  prefix?: string
  number?: number
}>(), {
  caption: '',
  captionAlign: 'center',
  width: '100%',
  prefix: '',
  number: 0,
})

const { $page } = useSlideContext()

const tableMapRef = inject<Ref<Map<number, number>>>('ustcTableMap', ref(new Map()))
const globalPrefix = inject<string>('ustcTablePrefix', 'Table')

const el = ref<HTMLElement>()
const localIdx = ref(0)

onMounted(() => {
  if (props.number > 0) return
  const slideEl = el.value?.closest('.slidev-page') ?? el.value?.closest('.slidev-layout')
  const allTables = Array.from(slideEl?.querySelectorAll('.table-block') ?? [])
  localIdx.value = Math.max(0, allTables.indexOf(el.value!))
})

const autoNumber = computed(() => {
  if (props.number > 0) return 0
  const startNum = tableMapRef.value.get($page.value) ?? 0
  return startNum ? startNum + localIdx.value : 0
})

const displayPrefix = computed(() => props.prefix || globalPrefix)

const fullCaption = computed(() => {
  const num = props.number > 0 ? props.number : autoNumber.value
  if (!num && !props.caption) return ''
  if (!num) return props.caption
  const label = `${displayPrefix.value} ${num}`
  return props.caption ? `${label}. ${props.caption}` : label
})
</script>

<template>
  <div ref="el" class="table-block" :style="{ width }">
    <p v-if="fullCaption" class="table-block-caption" :style="{ textAlign: captionAlign }">
      {{ fullCaption }}
    </p>
    <slot />
  </div>
</template>

<style scoped>
.table-block {
  max-width: 100%;
}

.table-block-caption {
  margin: 0 0 0.3rem;
}
</style>
