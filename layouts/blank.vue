<script setup lang="ts">
const props = withDefaults(defineProps<{
  wip?: boolean
}>(), {
  wip: false,
})
</script>

<template>
  <div class="slidev-layout blank" :class="{ 'is-wip': props.wip }">
    <slot />
  </div>
</template>
