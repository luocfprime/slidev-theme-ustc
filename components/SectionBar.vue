<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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

// ── Auto-switch dots ↔ progress bar based on whether dots fit one row ───────
// Per-section decision: if N dots would overflow the section item's width,
// that section renders a progress bar instead. Other sections still show dots.

const itemEls = ref<(HTMLElement | null)[]>([])
const dotsFit = ref<boolean[]>([])

function setItemRef(el: unknown, i: number) {
  itemEls.value[i] = (el as HTMLElement | null) ?? null
}

function parseCssLength(raw: string, rootPx: number, fallback: number): number {
  const v = raw.trim()
  if (!v) return fallback
  const m = /^(-?\d*\.?\d+)(rem|px|em)?$/.exec(v)
  if (!m) return fallback
  const num = parseFloat(m[1])
  const unit = m[2] || 'px'
  if (unit === 'rem' || unit === 'em') return num * rootPx
  return num
}

function computeFit(i: number): boolean {
  const el = itemEls.value[i]
  if (!el) return true
  const slidesCount = sections.value[i]?.slides.length ?? 0
  if (slidesCount <= 1) return true
  const cs = getComputedStyle(el)
  const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const dotSize = parseCssLength(cs.getPropertyValue('--ustc-nav-dot-size'), rootPx, 0.42 * rootPx)
  const gap = parseCssLength(cs.getPropertyValue('--ustc-nav-dot-gap'), rootPx, 0.22 * rootPx)
  const required = slidesCount * dotSize + (slidesCount - 1) * gap
  const padL = parseFloat(cs.paddingLeft) || 0
  const padR = parseFloat(cs.paddingRight) || 0
  const available = el.clientWidth - padL - padR
  return required <= available
}

function checkAllFit() {
  const next: boolean[] = []
  for (let i = 0; i < sections.value.length; i++) next.push(computeFit(i))
  dotsFit.value = next
}

let observer: ResizeObserver | null = null

function setupObserver() {
  if (typeof ResizeObserver === 'undefined') return
  observer?.disconnect()
  observer = new ResizeObserver(() => {
    checkAllFit()
  })
  itemEls.value.forEach((el) => {
    if (el) observer!.observe(el)
  })
}

onMounted(() => {
  nextTick(() => {
    checkAllFit()
    setupObserver()
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

// Re-measure and re-observe when section structure changes (HMR, slide edits).
watch(
  () => sections.value.map((s) => s.slides.length).join(','),
  () => {
    nextTick(() => {
      checkAllFit()
      setupObserver()
    })
  },
)

// ── Progress bar helpers ────────────────────────────────────────────────────

function sectionProgress(i: number): number {
  const section = sections.value[i]
  if (!section || section.slides.length === 0) return 0
  const cp = currentPage.value ?? 0
  const slides = section.slides
  if (cp < slides[0].no) return 0
  if (cp > slides[slides.length - 1].no) return 100
  const idx = slides.findIndex((s) => s.no === cp)
  if (idx < 0) return 0
  return slides.length === 1 ? 100 : (idx / (slides.length - 1)) * 100
}

function sectionHasWip(i: number): boolean {
  return sections.value[i]?.slides.some((s) => s.wip) ?? false
}

function onProgressClick(e: MouseEvent, i: number) {
  const wrapper = e.currentTarget as HTMLElement
  const track = wrapper.querySelector('.ustc-progress-track') as HTMLElement | null
  const rect = (track ?? wrapper).getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  const slides = sections.value[i].slides
  if (!slides.length) return
  const targetIdx = Math.round(ratio * (slides.length - 1))
  $slidev.nav.go(slides[targetIdx].no)
}
</script>

<template>
  <div
    v-if="show"
    class="ustc-section-bar"
    :class="{ 'is-minimal': barMode === 'minimal', 'is-labels': barMode === 'labels' }"
  >
    <div
      v-for="(section, i) in sections"
      :key="i"
      :ref="(el) => setItemRef(el, i)"
      class="ustc-section-item"
      :class="{ 'is-active': i === activeSectionIdx }"
    >
      <span
        v-if="barMode !== 'minimal'"
        class="ustc-section-label"
        @click="$slidev.nav.go(section.sectionNo)"
        >{{ section.title }}</span
      >

      <!-- Indicator: dots, progress bar, or nothing (labels mode) -->
      <template v-if="barMode !== 'labels'">
        <div v-if="dotsFit[i] !== false" class="ustc-section-dots">
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
        <div
          v-else
          class="ustc-section-progress"
          :class="{ 'has-wip': sectionHasWip(i) }"
          @click="onProgressClick($event, i)"
        >
          <div class="ustc-progress-track">
            <div class="ustc-progress-fill" :style="{ width: sectionProgress(i) + '%' }" />
          </div>
        </div>
      </template>
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
  background: var(--ustc-blue);
  display: flex;
  align-items: stretch;
  z-index: 50;
  padding: 0 1.2rem;
  --ustc-nav-dot-size: 0.42rem;
  --ustc-nav-dot-gap: 0.22rem;
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
  gap: var(--ustc-nav-dot-gap);
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
}

.ustc-dot {
  width: var(--ustc-nav-dot-size);
  height: var(--ustc-nav-dot-size);
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

/* Progress bar — substituted for dots when dots would overflow one row. */
.ustc-section-progress {
  width: 100%;
  padding: 0.1rem 0;
  cursor: pointer;
}

.ustc-progress-track {
  position: relative;
  height: var(--ustc-nav-dot-size);
  background: rgba(255, 255, 255, 0.22);
  border-radius: calc(var(--ustc-nav-dot-size) / 2);
  overflow: hidden;
}

.ustc-progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: white;
  border-radius: inherit;
  transition: width 0.18s ease-out;
  pointer-events: none;
}

.ustc-section-progress.has-wip .ustc-progress-track {
  background: rgba(220, 38, 38, 0.25);
  animation: ustc-wip-bar-pulse 1.8s ease-in-out infinite;
}
.ustc-section-progress.has-wip .ustc-progress-fill {
  background: var(--ustc-wip);
}
@keyframes ustc-wip-bar-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5);
  }
  50% {
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0);
  }
}
</style>
