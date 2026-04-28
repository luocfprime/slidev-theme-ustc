import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export function useLocalIndex(cssClass: string): { el: Ref<HTMLElement | undefined>; localIdx: Ref<number> } {
  const el = ref<HTMLElement>()
  const localIdx = ref(0)

  watch(el, (newEl) => {
    if (!newEl) return
    const slideEl = newEl.closest('.slidev-page') ?? newEl.closest('.slidev-layout')
    const all = Array.from(slideEl?.querySelectorAll(`.${cssClass}`) ?? [])
    localIdx.value = Math.max(0, all.indexOf(newEl))
  }, { immediate: true })

  return { el, localIdx }
}
