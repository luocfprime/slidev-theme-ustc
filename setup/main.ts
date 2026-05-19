import type { AppContext } from '@slidev/types'
import { nextTick } from 'vue'
import 'katex/dist/katex.min.css'

export default async function setup({ router }: AppContext) {
  // markdown-it-footnote v4 renders repeated references to the same footnote
  // as [1:1], [1:2], etc. Slidev v52 has no theme-level markdown-it hook, so
  // we normalize at runtime in the DOM.
  const normalizeFootnoteRefCaption = (anchor: HTMLAnchorElement) => {
    const current = anchor.textContent ?? ''
    const next = current.replace(/^\[(\d+):\d+\]$/, '[$1]')
    if (next !== current) anchor.textContent = next
  }

  // Idempotent setAttribute: setting the same value still fires attribute
  // mutation records, and even when those aren't observed, avoiding redundant
  // writes is cheaper.
  const setAttrIfChanged = (el: Element, name: string, value: string) => {
    if (el.getAttribute(name) !== value) el.setAttribute(name, value)
  }

  const applyFootnoteEnhancements = () => {
    const normalizeText = (el: HTMLElement) => {
      const clone = el.cloneNode(true) as HTMLElement
      clone.querySelectorAll('.footnote-backref').forEach((n) => n.remove())
      return clone.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    }

    const scopeRoot = (el: HTMLElement) =>
      el.closest<HTMLElement>('.slidev-page') ?? el.closest<HTMLElement>('.slidev-layout')

    document.querySelectorAll<HTMLElement>('.footnote-ref').forEach((ref) => {
      const anchor = ref.querySelector<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return

      normalizeFootnoteRefCaption(anchor)

      const href = anchor.getAttribute('href') ?? ''
      const root = scopeRoot(ref)
      const target = root?.querySelector<HTMLElement>(`.footnotes li${href}`)
      const text = target ? normalizeText(target) : ''
      if (!text) return

      setAttrIfChanged(ref, 'title', text)
      setAttrIfChanged(ref, 'aria-label', text)
      setAttrIfChanged(anchor, 'title', text)
    })
  }

  let rafHandle = 0
  const schedule = () => {
    cancelAnimationFrame(rafHandle)
    rafHandle = requestAnimationFrame(applyFootnoteEnhancements)
  }

  // Observer is global to catch async-mounted slot content (e.g. <FigureBlock>
  // captions). Filter to addedNodes that contain a .footnote-ref so we don't
  // re-walk the DOM on every unrelated mutation (KaTeX, slide transitions,
  // Vue text-node patches). Text-node additions from our own writes are
  // nodeType 3 and skipped here, which is what breaks the self-feeding loop.
  const hasRelevantAddition = (records: MutationRecord[]) => {
    for (const r of records) {
      for (const n of r.addedNodes) {
        if (n.nodeType !== 1) continue
        const el = n as Element
        if (el.matches?.('.footnote-ref') || el.querySelector?.('.footnote-ref')) return true
      }
    }
    return false
  }

  nextTick(schedule)
  const observer = new MutationObserver((records) => {
    if (hasRelevantAddition(records)) schedule()
  })
  observer.observe(document.body, { childList: true, subtree: true })
  // Guard against HMR cold-start where router may not be ready yet
  router?.afterEach(() => nextTick(schedule))
}
