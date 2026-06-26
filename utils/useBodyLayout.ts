import { computed, onMounted, onUpdated, ref } from 'vue'
import { configs } from '@slidev/client'
import { getPresenterName, resolveBodyMargin, handleBackground } from './layoutHelper'

export interface BodyLayoutProps {
  density?: 'normal' | 'compact' | 'dense'
  margin?: 'normal' | 'tight' | 'tighter' | 'none'
  footnote?: 'overlay' | 'flow'
  sectionBar?: boolean
  lineHeight?: number
  flowGap?: string | number
  align?: 'left' | 'center' | 'right'
  background?: string
  wip?: boolean
}

const flowGapMap: Record<string, string> = {
  none: '0',
  tight: '0.45rem',
  normal: '0.75rem',
  loose: '1rem',
}

function resolveLineHeight(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return String(value)
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  const n = Number(trimmed)
  return Number.isFinite(n) && n > 0 ? trimmed : undefined
}

function resolveFlowGap(value: unknown): string | undefined {
  if (typeof value === 'number') return value === 0 ? '0' : undefined
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  const mapped = flowGapMap[trimmed.toLowerCase()]
  if (mapped) return mapped
  if (trimmed === '0') return '0'
  const number = String.raw`(?:\d+|\d*\.\d+)`
  const lengthUnit = String.raw`(?:px|rem|em|%|vw|vh|vmin|vmax|svw|svh|lvw|lvh|dvw|dvh|ch|ex|cap|ic|lh|rlh|cm|mm|q|in|pt|pc)`
  if (new RegExp(String.raw`^${number}${lengthUnit}$`, 'i').test(trimmed)) return trimmed
  if (/^(?:var|calc|min|max|clamp)\([^;{}]+\)$/i.test(trimmed)) return trimmed
  return undefined
}

export function useBodyLayout(props: BodyLayoutProps) {
  const presenterName = computed(() =>
    getPresenterName(
      (configs.authors as unknown[]) ?? [],
      (configs as Record<string, unknown>).presenterName as string | undefined,
    ),
  )

  const pageClass = computed(() => ({
    compact: props.density === 'compact',
    dense: props.density === 'dense',
    'footnotes-flow': props.footnote === 'flow',
    'no-section-bar': props.sectionBar === false,
    'is-wip': props.wip === true,
  }))

  const pageStyle = computed(() => {
    const s: Record<string, string> = { ...resolveBodyMargin(props.margin) }
    const config = configs as Record<string, unknown>
    const lineHeight = resolveLineHeight(props.lineHeight) ?? resolveLineHeight(config.lineHeight)
    const flowGap = resolveFlowGap(props.flowGap) ?? resolveFlowGap(config.flowGap)
    if (lineHeight) s['--ustc-lh'] = lineHeight
    if (flowGap) s['--ustc-component-gap'] = flowGap
    if (props.align) s.textAlign = props.align
    if (props.background) Object.assign(s, handleBackground(props.background))
    return s
  })

  const layoutEl = ref<HTMLElement>()

  // Known debt: subtitle uses a small DOM relocation to preserve the natural
  // Slidev authoring API (`subtitle:` frontmatter + markdown `# h1`). Keep this
  // scoped to body layouts; do not extend it into broader slide metadata logic.
  function placeSubtitle() {
    const root = layoutEl.value
    if (!root) return
    const subtitle = root.querySelector(':scope > .content-subtitle')
    const h1 = root.querySelector(':scope > h1')
    if (!subtitle || !h1) return
    if (h1.nextElementSibling !== subtitle) h1.insertAdjacentElement('afterend', subtitle)
  }

  onMounted(placeSubtitle)
  onUpdated(placeSubtitle)

  return { presenterName, pageClass, pageStyle, layoutEl }
}
