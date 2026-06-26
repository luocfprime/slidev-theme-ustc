<script setup lang="ts">
import { computed } from 'vue'

// Inline pill badge for academic factual tags (CCF A, Oral, dataset/status
// labels). Content is a slot, so it accepts plain text, emoji, or Slidev
// Iconify icons (e.g. <mdi-github />) — the component handles inline baseline
// alignment and sizes icons relative to the text so they sit flush with it.
// Pass `href` to turn the badge into a link (e.g. arXiv / project page / repo).
const props = withDefaults(
  defineProps<{
    variant?: 'soft' | 'solid' | 'outline'
    color?: string
    href?: string
  }>(),
  {
    variant: 'soft',
    color: 'var(--ustc-blue)',
    href: '',
  },
)

// External links (http(s):// or protocol-relative //) open in a new tab;
// in-deck anchors (e.g. #/5) navigate in place.
const isExternal = computed(() => /^(https?:)?\/\//.test(props.href))
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    class="ustc-badge"
    :class="`is-${variant}`"
    :style="{ '--badge-color': color }"
    :href="href || undefined"
    :target="href && isExternal ? '_blank' : undefined"
    :rel="href && isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.ustc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  vertical-align: middle;
  /* Anchor the default size to the current layout's --ustc-fs-body so dense /
     compact variable swaps affect badges. Use --ustc-fs-badge for an explicit
     fixed override, or --ustc-fs-badge-scale to keep density-aware scaling. */
  font-size: var(
    --ustc-fs-badge,
    calc(var(--ustc-fs-body, 1.4rem) * var(--ustc-fs-badge-scale, 0.68))
  );
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.1;
  padding: 0.14em 0.48em;
  border: 1px solid transparent; /* keep all variants the same height */
  border-radius: 0.4em;
  white-space: nowrap;
  transform: translateY(-0.12em);
  text-decoration: none; /* badge-as-link should not be underlined */
}

/* Icons (Iconify SVG) track the text size, slightly larger for visual balance.
   display:block drops the inline-SVG baseline gap so flex centering aligns the
   icon to the text instead of leaving it sitting high. */
.ustc-badge :deep(svg) {
  width: 1.08em;
  height: 1.08em;
  display: block;
  flex-shrink: 0;
}

/* Link affordance: subtle darken on hover, no layout shift. */
a.ustc-badge {
  cursor: pointer;
  transition: filter 0.12s ease;
}

a.ustc-badge:hover {
  filter: brightness(0.94);
}

.is-solid {
  background: var(--badge-color);
  color: #fff;
}

.is-soft {
  background: color-mix(in srgb, var(--badge-color) 14%, white);
  color: color-mix(in srgb, var(--badge-color) 72%, black);
}

.is-outline {
  background: transparent;
  color: var(--badge-color);
  border-color: color-mix(in srgb, var(--badge-color) 45%, white);
}
</style>
