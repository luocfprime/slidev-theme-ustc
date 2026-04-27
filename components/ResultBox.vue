<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="result-box">
    <p v-if="title" class="result-box-title">{{ title }}</p>
    <div class="result-box-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.result-box {
  border: 2px solid var(--ustc-blue);
  border-radius: 6px;
  background: var(--ustc-blue-pale);
  padding: 0.7rem 1rem;
  margin: 0.7rem 0;
}

.result-box-title {
  font-weight: 650;
  color: var(--ustc-blue-dark);
  font-size: 1.05rem;
  margin: 0 0 0.4rem;
}

.result-box-body :deep(p) {
  margin: 0.15rem 0;
  font-size: 1.15rem;
  line-height: 1.5;
}

.result-box-body :deep(li) {
  font-size: 1.15rem;
}
</style>
