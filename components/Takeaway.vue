<template>
  <div class="takeaway">
    <slot />
  </div>
</template>

<style scoped>
.takeaway {
  border-left: 4px solid var(--ustc-blue);
  background: var(--ustc-blue-pale);
  border-radius: 0 6px 6px 0;
  padding: 0.55rem 1rem;
  margin-bottom: 0.6rem;
}

/* font-size intentionally unset — inherits from layout dense/normal cascade.
   margin: 0 prevents global p margin from adding unwanted spacing inside the box. */
.takeaway :deep(p) {
  font-weight: 600;
  color: var(--ustc-blue-dark);
  margin: 0;
  line-height: 1.45;
}
</style>
