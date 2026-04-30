<script setup lang="ts">
import { useAttrs } from 'vue'
import BodyLayout from '../components/BodyLayout.vue'

const attrs = useAttrs()
</script>

<template>
  <BodyLayout v-bind="attrs">
    <slot />
  </BodyLayout>
</template>
