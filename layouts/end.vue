<script setup lang="ts">
import { computed } from 'vue'
import { getPresenterName, handleBackground } from '../utils/layoutHelper'
import { endDefaults } from '../utils/defaults'

const props = withDefaults(
  defineProps<{
    showLogo?: boolean
    logoSrc?: string
    logoAlt?: string
    footer?: boolean
    footerMode?: 'full' | 'minimal'
    wip?: boolean
    background?: string
  }>(),
  {
    ...endDefaults,
  },
)

const presenterName = computed(() =>
  getPresenterName(
    $slidev.configs.authors ?? [],
    $slidev.configs.presenterName as string | undefined,
  ),
)

const bgStyle = computed(() => (props.background ? handleBackground(props.background) : undefined))
</script>

<template>
  <div class="slidev-layout end" :class="{ 'is-wip': props.wip }" :style="bgStyle">
    <img
      v-if="props.showLogo && props.logoSrc"
      :src="props.logoSrc"
      :alt="props.logoAlt"
      class="end-logo"
    />
    <slot />
    <div v-if="$slots.contact" class="end-contact">
      <slot name="contact" />
    </div>
    <PageFooter
      v-if="props.footer"
      :title="$slidev.configs.talkTitle"
      :author="presenterName"
      :meeting="$slidev.configs.conference"
      :date="$slidev.configs.date"
      :mode="props.footerMode"
    />
  </div>
</template>
