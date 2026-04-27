import type { AppContext } from '@slidev/types'
import { nextTick } from 'vue'
import 'katex/dist/katex.min.css'

export default async function setup({ router }: AppContext) {
  const applyTooltips = () => {
    const normalizeText = (el: HTMLElement) => {
      const clone = el.cloneNode(true) as HTMLElement
      clone.querySelectorAll('.footnote-backref').forEach(n => n.remove())
      return clone.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    }

    const scopeRoot = (el: HTMLElement) =>
      el.closest<HTMLElement>('.slidev-page') ?? el.closest<HTMLElement>('.slidev-layout')

    document.querySelectorAll<HTMLElement>('.footnote-ref').forEach((ref) => {
      const anchor = ref.querySelector<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return

      const href = anchor.getAttribute('href') ?? ''
      const root = scopeRoot(ref)
      const target = root?.querySelector<HTMLElement>(`.footnotes li${href}`)
      const text = target ? normalizeText(target) : ''
      if (!text) return

      ref.setAttribute('title', text)
      ref.setAttribute('aria-label', text)
      anchor.setAttribute('title', text)
    })
  }

  let rafHandle = 0
  const schedule = () => {
    cancelAnimationFrame(rafHandle)
    rafHandle = requestAnimationFrame(applyTooltips)
  }
  schedule()
  // Guard against HMR cold-start where router may not be ready yet
  router?.afterEach(() => nextTick(schedule))
}
