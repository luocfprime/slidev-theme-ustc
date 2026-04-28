<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { getLayout, getSectionTitle } from './utils/layoutHelper'
import { useAutoNumbering } from './utils/useAutoNumbering'

const enabled = $slidev.configs.sectionBar === true

interface SectionGroup {
  title: string
  sectionNo: number
  slideNos: number[]
}

const sections = computed((): SectionGroup[] => {
  if (!enabled) return []
  const slides = $slidev.nav.slides ?? []
  const result: SectionGroup[] = []
  let cur: SectionGroup | null = null

  for (const slide of slides) {
    const layout = getLayout(slide)
    const no = slide.no ?? 0
    if (layout === 'backup') break
    if (layout === 'section') {
      const title = getSectionTitle(slide, `§${result.length + 1}`)
      cur = { title, sectionNo: no, slideNos: [] }
      result.push(cur)
    } else if (layout !== 'cover' && layout !== 'end' && layout !== 'toc' && layout !== 'blank' && cur) {
      cur.slideNos.push(no)
    }
  }
  return result
})

const allSlides = computed(() => $slidev.nav.slides ?? [])
const configFigurePrefix = computed(() => ($slidev.configs.figurePrefix as string) ?? 'Figure')
const configTablePrefix = computed(() => ($slidev.configs.tablePrefix as string) ?? 'Table')
useAutoNumbering(allSlides, configFigurePrefix, configTablePrefix)

const currentPage = computed(() => $slidev.nav.currentPage)

const currentSlide = computed(() => {
  const slides = $slidev.nav.slides ?? []
  const idx = (currentPage.value ?? 1) - 1
  return slides[idx] as any
})

const currentLayout = computed(() => getLayout(currentSlide.value) || 'content')

const visible = computed(() => {
  const s = currentSlide.value
  const barVal =
    s?.frontmatter?.sectionBar ??
    s?.meta?.slide?.frontmatter?.sectionBar ??
    s?.meta?.frontmatter?.sectionBar ??
    s?.meta?.sectionBar
  const locallyDisabled = barVal === false
  return (
    enabled &&
    sections.value.length > 0 &&
    !['cover', 'section', 'toc', 'backup', 'end', 'blank'].includes(currentLayout.value) &&
    !locallyDisabled
  )
})

const activeSectionIdx = computed(() =>
  sections.value.findIndex(s => s.slideNos.includes(currentPage.value))
)

const barMode = computed(() => {
  const s = currentSlide.value
  const local =
    s?.frontmatter?.sectionBarMode ??
    s?.meta?.slide?.frontmatter?.sectionBarMode ??
    s?.meta?.frontmatter?.sectionBarMode
  return (local ?? ($slidev.configs.sectionBarMode as string) ?? 'full') as string
})

watchEffect(() => {
  if (!enabled || sections.value.length === 0) {
    document.documentElement.style.setProperty('--ustc-nav-h', '0px')
  } else if (barMode.value === 'minimal') {
    document.documentElement.style.setProperty('--ustc-nav-h', '1.5rem')
  } else {
    document.documentElement.style.setProperty('--ustc-nav-h', '2rem')
  }
})
</script>

<template>
  <div v-if="visible" class="ustc-section-bar" :class="{ 'is-minimal': barMode === 'minimal' }">
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
      >{{ section.title }}</span>
      <div class="ustc-section-dots">
        <span
          v-for="no in section.slideNos"
          :key="no"
          class="ustc-dot"
          :class="{
            'is-current': no === currentPage,
            'is-past': no < currentPage,
          }"
          @click="$slidev.nav.go(no)"
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

.ustc-section-item.is-active { opacity: 1; }
.ustc-section-item:not(.is-active):hover { opacity: 0.8; }

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

.ustc-dot:hover { border-color: white; background: rgba(255, 255, 255, 0.5); }
.ustc-dot.is-current { background: white; border-color: white; }
.ustc-dot.is-past { background: rgba(255, 255, 255, 0.32); border-color: rgba(255, 255, 255, 0.55); }
</style>
