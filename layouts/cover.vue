<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground, handleAuthor, getPresenterName } from '../utils/layoutHelper'
import { coverDefaults } from '../utils/defaults'
import { renderInlineMd } from '../utils/markdown'

const props = withDefaults(defineProps<{
  background?: string
  authors?: Record<string, string[]>[]
  conference?: string
  talkTitle?: string
  subtitle?: string
  date?: string
  showLogo?: boolean
  logoSrc?: string
  logoAlt?: string
}>(), {
  ...coverDefaults,
})

const bgStyle = computed(() => handleBackground(props.background, true))
const presenterName = computed(() => getPresenterName(props.authors))
const authorData = computed(() => handleAuthor(props.authors))
const authorsDict = computed(() => authorData.value[0])
const instituteList = computed(() => authorData.value[1])
const authorKeys = computed(() => props.authors.map(a => Object.keys(a)[0]))
</script>

<template>
  <div class="slidev-layout cover" :style="bgStyle">
    <img
      v-if="props.showLogo && props.logoSrc"
      :src="props.logoSrc"
      :alt="props.logoAlt"
      class="cover-logo"
    />

    <h1 v-html="renderInlineMd(props.talkTitle)" />
    <p v-if="props.subtitle" class="cover-subtitle" v-html="renderInlineMd(props.subtitle)" />

    <template v-if="authorKeys.length">
      <p class="cover-author-line">
        <template v-for="(author, idx) in authorKeys" :key="author">
          <span :class="{ presenter: author === presenterName }">{{ author }}</span>
          <sup v-if="authorsDict[author].instituteNum.length">
            <template v-for="(num, ni) in authorsDict[author].instituteNum" :key="ni">
              <span v-if="ni > 0">,</span>{{ num }}
            </template>
          </sup>
          <span v-if="idx < authorKeys.length - 2">, </span>
          <span v-if="idx === authorKeys.length - 2"> and </span>
        </template>
      </p>
    </template>
    <p v-if="props.date" class="cover-date">{{ props.date }}</p>
    <p v-if="props.conference" class="cover-meeting" v-html="renderInlineMd(props.conference)" />

    <div v-if="$slots.default" class="cover-slot">
      <slot />
    </div>

    <div v-if="instituteList.length" class="cover-affiliations">
      <span v-for="item in instituteList" :key="item.number">
        <sup>{{ item.number }}</sup>{{ item.content }}
      </span>
    </div>
  </div>
</template>
