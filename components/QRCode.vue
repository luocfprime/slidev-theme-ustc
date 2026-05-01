<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { renderInlineMd } from '../utils/markdown'
import { qrcodeDefaults } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    url?: string
    size?: number
    color?: string
    background?: string
    caption?: string
    wip?: boolean
  }>(),
  {
    ...qrcodeDefaults,
  },
)

if (import.meta.env.DEV && !props.url && !props.wip) {
  console.warn('[QRCode] missing `url` and not flagged `wip`; QR will be empty.')
}
</script>

<template>
  <figure class="ustc-qrcode-wrap" :class="{ 'is-wip': props.wip }">
    <div class="ustc-qrcode-stage" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
      <QrcodeVue
        v-if="props.url"
        :value="props.url"
        :size="props.size"
        :foreground="props.color"
        :background="props.background"
        render-as="svg"
        class="ustc-qrcode"
      />
      <div v-else-if="props.wip" class="ustc-qrcode-placeholder" />
      <span v-if="props.wip" class="wip-badge">WIP</span>
    </div>
    <figcaption
      v-if="props.caption"
      class="ustc-qrcode-caption"
      v-html="renderInlineMd(props.caption)"
    />
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

.ustc-qrcode-stage {
  position: relative;
  display: block;
}

.ustc-qrcode {
  display: block;
}

.ustc-qrcode-placeholder {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(220, 38, 38, 0.06),
    rgba(220, 38, 38, 0.06) 8px,
    rgba(220, 38, 38, 0.12) 8px,
    rgba(220, 38, 38, 0.12) 16px
  );
  border: 1.5px dashed var(--ustc-wip);
  border-radius: 4px;
  box-sizing: border-box;
}

.wip-badge {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background: var(--ustc-wip);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.06em;
  line-height: 1.5;
}

.ustc-qrcode-caption {
  font-size: var(--ustc-fs-caption);
  color: var(--ustc-text-muted);
  text-align: center;
  line-height: var(--ustc-lh-caption);
}
</style>
