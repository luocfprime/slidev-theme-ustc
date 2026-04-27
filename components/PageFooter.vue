<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { renderInlineMd } from '../utils/markdown'

defineProps<{
  title?: string
  author?: string
  meeting?: string
  date?: string
  mode?: 'full' | 'minimal'
}>()

const { slides, currentPage, total } = useNav()

function getLayout(slide: any): string {
  return slide?.frontmatter?.layout ?? slide?.meta?.layout ?? slide?.meta?.frontmatter?.layout ?? ''
}

const backupStartNo = computed((): number => {
  for (const slide of slides.value ?? []) {
    if (getLayout(slide) === 'backup') return slide.no ?? 0
  }
  return 0
})

const pageLabel = computed(() => {
  const bsn = backupStartNo.value
  const cur = currentPage.value
  if (bsn > 0 && cur >= bsn) {
    return `A.${cur - bsn}`
  }
  const mainTotal = bsn > 0 ? bsn - 1 : total.value
  return `${cur} / ${mainTotal}`
})
</script>

<template>
  <div class="page-footer">
    <span class="footer-left">
      <span v-if="author" class="footer-author" v-html="renderInlineMd(author)" />
    </span>

    <span class="footer-center">
      <span v-if="mode === 'full' && title" v-html="renderInlineMd(title)" />
    </span>

    <span class="footer-right">
      <template v-if="mode === 'full'">
        <span v-if="meeting" class="footer-meta" v-html="renderInlineMd(meeting)" />
        <span v-if="meeting" class="footer-sep" aria-hidden="true">·</span>
        <span v-if="date" class="footer-meta">{{ date }}</span>
        <span v-if="date" class="footer-sep" aria-hidden="true">·</span>
      </template>
      {{ pageLabel }}
    </span>
  </div>
</template>

<style scoped>
.page-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--ustc-footer-h);
  background: var(--ustc-footer-bg);
  color: var(--ustc-footer-text);
  font-size: var(--ustc-footer-fs);
  display: flex;
  align-items: center;
  padding: 0 0.9rem;
  gap: 0;
  letter-spacing: 0.007em;
  text-align: left;
}

.footer-left {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.footer-author {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footer-center {
  flex: 2 1 0;
  min-width: 0;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.footer-right {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  gap: 0;
  font-variant-numeric: tabular-nums;
}

.footer-meta {
  opacity: 0.85;
}

.footer-sep {
  margin: 0 0.4rem;
  opacity: 0.45;
}
</style>
