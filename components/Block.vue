<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="prim-block">
    <p v-if="title" class="prim-block-title">{{ title }}</p>
    <div class="prim-block-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.prim-block {
  border: 1px solid var(--ustc-blue-border);
  border-top: 2px solid var(--ustc-blue);
  border-radius: 0 0 4px 4px;
  padding: 0 0.85rem 0.55rem;
  margin: 0.5rem 0;
}

/* !important overrides the global `p { font-size: 1.4rem; margin: ... }` rule
   so the title strip stays compact regardless of layout density. */
.prim-block-title {
  font-weight: 650;
  color: var(--ustc-blue-dark);
  font-size: 1.05rem !important;
  margin: 0 -0.85rem 0.4rem !important;
  padding: 0.3rem 0.85rem;
  border-bottom: 1px solid var(--ustc-blue-border);
  line-height: 1.3;
}

.prim-block-body :deep(p):first-child {
  margin-top: 0.4rem;
}

.prim-block-body :deep(p):last-child {
  margin-bottom: 0;
}
</style>
