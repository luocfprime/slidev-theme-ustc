import { computed, onMounted, onUpdated, ref } from 'vue'
import { getPresenterName, resolveBodyMargin, handleBackground } from './layoutHelper'

export interface BodyLayoutProps {
  density?: 'normal' | 'dense'
  margin?: 'normal' | 'tight' | 'tighter' | 'none'
  footnote?: 'overlay' | 'flow'
  sectionBar?: boolean
  lineHeight?: number
  align?: 'left' | 'center' | 'right'
  background?: string
  wip?: boolean
}

export function useBodyLayout(props: BodyLayoutProps) {
  const presenterName = computed(() =>
    getPresenterName(
      ($slidev.configs.authors as any[]) ?? [],
      $slidev.configs.presenter as string | undefined,
    ),
  )

  const pageClass = computed(() => ({
    dense: props.density === 'dense',
    'footnotes-flow': props.footnote === 'flow',
    'no-section-bar': props.sectionBar === false,
    'is-wip': props.wip === true,
  }))

  const pageStyle = computed(() => {
    const s: Record<string, string> = { ...resolveBodyMargin(props.margin) }
    if (props.lineHeight) s['--ustc-lh'] = String(props.lineHeight)
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
    if (h1.nextElementSibling !== subtitle)
      h1.insertAdjacentElement('afterend', subtitle)
  }

  onMounted(placeSubtitle)
  onUpdated(placeSubtitle)

  return { presenterName, pageClass, pageStyle, layoutEl }
}
