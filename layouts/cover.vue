<script setup lang="ts">
import { computed } from 'vue'
import {
  handleBackground,
  handleAuthor,
  getPresenterName,
  normalizeAuthors,
} from '../utils/layoutHelper'
import type { AuthorEntry } from '../utils/layoutHelper'
import { coverDefaults } from '../utils/defaults'
import { renderInlineMd } from '../utils/markdown'

const props = withDefaults(
  defineProps<{
    background?: string
    authors?: AuthorEntry[]
    presenterName?: string
    authorMarks?: Record<string, string>
    conference?: string
    talkTitle?: string
    subtitle?: string
    date?: string
    showLogo?: boolean
    logoSrc?: string
    logoAlt?: string
    frontmatter?: Record<string, unknown>
    wip?: boolean
  }>(),
  {
    ...coverDefaults,
    authorMarks: () => ({}),
  },
)

const bgStyle = computed(() => handleBackground(props.background, true))
const presenterName = computed(() =>
  getPresenterName(props.authors, props.presenterName, props.frontmatter),
)
const normalizedAuthors = computed(() => normalizeAuthors(props.authors ?? []))
const authorData = computed(() => handleAuthor(props.authors))
const authorsDict = computed(() => authorData.value[0])
const instituteList = computed(() => authorData.value[1])
const marksLegend = computed(() =>
  Object.entries(props.authorMarks ?? {}).map(([mark, label]) => ({ mark, label })),
)
</script>

<template>
  <div class="slidev-layout cover" :class="{ 'is-wip': props.wip }" :style="bgStyle">
    <img
      v-if="props.showLogo && props.logoSrc"
      :src="props.logoSrc"
      :alt="props.logoAlt"
      class="cover-logo"
    />

    <h1 v-html="renderInlineMd(props.talkTitle)" />
    <p v-if="props.subtitle" class="cover-subtitle" v-html="renderInlineMd(props.subtitle)" />

    <template v-if="normalizedAuthors.length">
      <p class="cover-author-line">
        <template v-for="(author, idx) in normalizedAuthors" :key="author.name">
          <span class="author-unit">
            <span
              class="author-name"
              :class="{ 'presenter-wrap': author.name === presenterName }"
              >{{ author.name }}</span
            >
            <sup
              v-if="author.marks.length || authorsDict[author.name]?.instituteNum.length"
              class="author-sup"
            >
              <template v-if="authorsDict[author.name]?.instituteNum.length">
                <template v-for="(num, ni) in authorsDict[author.name].instituteNum" :key="ni">
                  <span v-if="ni > 0">,</span>{{ num }}
                </template>
              </template>
              <span v-if="author.marks.length" class="author-marks">
                <template v-if="authorsDict[author.name]?.instituteNum.length">,</template>
                <template v-for="(mark, mi) in author.marks" :key="mi">
                  <template v-if="mi > 0">,</template>{{ mark }}
                </template>
              </span>
            </sup>
          </span>
          <span v-if="idx < normalizedAuthors.length - 2">, </span>
          <span v-if="idx === normalizedAuthors.length - 2"> and </span>
        </template>
      </p>
    </template>

    <p v-if="props.date" class="cover-date">{{ props.date }}</p>
    <p v-if="props.conference" class="cover-meeting" v-html="renderInlineMd(props.conference)" />

    <div v-if="$slots.default" class="cover-slot">
      <slot />
    </div>

    <div v-if="instituteList.length || marksLegend.length" class="cover-affiliations">
      <span v-for="item in instituteList" :key="item.number">
        <sup>{{ item.number }}</sup
        >{{ item.content }}
      </span>
      <div v-if="marksLegend.length" class="cover-marks-legend">
        <span v-for="(entry, i) in marksLegend" :key="i">{{ entry.mark }} {{ entry.label }}</span>
      </div>
    </div>
  </div>
</template>
