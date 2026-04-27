<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground, handleAuthor, getPresenterName } from './layoutHelper'

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
  background: '',
  authors: () => [],
  conference: '',
  talkTitle: 'Presentation Title',
  date: '',
  showLogo: true,
  logoSrc: '/ustc/logo.svg',
  logoAlt: 'USTC logo',
})

const bgStyle = computed(() => handleBackground(props.background, true, 1.0))
const presenterName = computed(() => getPresenterName(props.authors))
const [authorsDict, instituteList] = handleAuthor(props.authors)
const authorKeys = props.authors.map(a => Object.keys(a)[0])
</script>

<template>
  <div class="slidev-layout cover" :style="bgStyle">
    <img
      v-if="props.showLogo && props.logoSrc"
      :src="props.logoSrc"
      :alt="props.logoAlt"
      class="cover-logo"
    />

    <h1>{{ props.talkTitle }}</h1>
    <p v-if="props.subtitle" class="cover-subtitle">{{ props.subtitle }}</p>

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
    <p v-if="props.conference" class="cover-meeting">{{ props.conference }}</p>

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
