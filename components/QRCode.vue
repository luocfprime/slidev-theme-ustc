<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { renderInlineMd } from '../utils/markdown'
import { qrcodeDefaults } from '../utils/defaults'

withDefaults(defineProps<{
  url: string
  size?: number
  color?: string
  background?: string
  caption?: string
}>(), {
  ...qrcodeDefaults,
})
</script>

<template>
  <figure class="ustc-qrcode-wrap">
    <QrcodeVue
      :value="url"
      :size="size"
      :foreground="color"
      :background="background"
      render-as="svg"
      class="ustc-qrcode"
    />
    <figcaption v-if="caption" class="ustc-qrcode-caption" v-html="renderInlineMd(caption)" />
  </figure>
</template>

<style scoped>
.ustc-qrcode-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
}

.ustc-qrcode {
  display: block;
}

.ustc-qrcode-caption {
  font-size: 1.1rem;
  color: var(--ustc-text-muted);
  text-align: center;
  line-height: 1.35;
}
</style>
