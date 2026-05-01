<script setup lang="ts">
import { computed } from 'vue'
import { getSectionBarMode } from '../utils/layoutHelper'
import { buildSectionGroups } from '../utils/sectionModel'

const props = defineProps<{
  /** Override per-slide sectionBar visibility (false = force-hide) */
  visible?: boolean
}>()

const enabled = $slidev.configs.sectionBar === true

const sections = computed(() => {
  if (!enabled) return []
  return buildSectionGroups($slidev.nav.slides ?? [])
})

const currentPage = computed(() => $slidev.nav.currentPage)

const activeSectionIdx = computed(() =>
  sections.value.findIndex((s) => s.slides.some((slide) => slide.no === currentPage.value)),
)

const barMode = computed(() => {
  const slides = $slidev.nav.slides ?? []
  const idx = (currentPage.value ?? 1) - 1
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = slides[idx] as any
  return getSectionBarMode(s, ($slidev.configs.sectionBarMode as string) ?? 'full')
})

/** Whether the bar should be shown in the current slide. */
const show = computed(() => {
  if (props.visible === false) return false
  return enabled && sections.value.length > 0
})
</script>

<template>
  <div v-if="show" class="ustc-section-bar" :class="{ 'is-minimal': barMode === 'minimal' }">
    <div
      v-for="(section, i) in sections"
      :key="i"
      class="ustc-section-item"
      :class="{ 'is-active': i === activeSectionIdx }"
    >
      <span
        v-if="barMode !== 'minimal'"
        class="ustc-section-label"
        @click="$slidev.nav.go(section.sectionNo)"
        >{{ section.title }}</span
      >
      <div class="ustc-section-dots">
        <span
          v-for="slide in section.slides"
          :key="slide.no"
          class="ustc-dot"
          :class="{
            'is-current': slide.no === currentPage,
            'is-past': slide.no < currentPage,
            'is-wip': slide.wip,
          }"
          @click="$slidev.nav.go(slide.no)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ustc-section-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--ustc-nav-h);
  background: var(--ustc-blue-dark);
  display: flex;
  align-items: stretch;
  z-index: 50;
  padding: 0 1.2rem;
}

.ustc-section-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.18rem;
  padding: 0.1rem 0.5rem;
  opacity: 0.5;
  transition: opacity 0.15s;
  min-width: 0;
}

.ustc-section-item.is-active {
  opacity: 1;
}
.ustc-section-item:not(.is-active):hover {
  opacity: 0.8;
}

.ustc-section-label {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.2;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.ustc-section-dots {
  display: flex;
  gap: 0.22rem;
  flex-wrap: wrap;
  justify-content: center;
}

.ustc-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  background: transparent;
  flex-shrink: 0;
  cursor: pointer;
}

.ustc-dot:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.5);
}
.ustc-dot.is-current {
  background: white;
  border-color: white;
}
.ustc-dot.is-past {
  background: rgba(255, 255, 255, 0.32);
  border-color: rgba(255, 255, 255, 0.55);
}

/* WIP slide marker — frontmatter `wip: true` only. Component-level `wip` props
   are local component badges/placeholders and do not affect section-bar dots. */
.ustc-dot.is-wip {
  border-color: var(--ustc-wip);
  border-width: 2px;
}
.ustc-dot.is-wip:hover {
  background: rgba(220, 38, 38, 0.45);
  border-color: var(--ustc-wip);
}
.ustc-dot.is-wip.is-current {
  background: var(--ustc-wip);
  border-color: var(--ustc-wip);
}
.ustc-dot.is-wip.is-past {
  background: rgba(220, 38, 38, 0.5);
  border-color: var(--ustc-wip);
}
.ustc-dot.is-wip:not(.is-current) {
  animation: ustc-wip-dot-pulse 1.8s ease-in-out infinite;
}
@keyframes ustc-wip-dot-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.55);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0);
  }
}
</style>
