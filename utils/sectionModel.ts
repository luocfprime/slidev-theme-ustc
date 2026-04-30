import { getLayout, getSectionTitle } from './layoutHelper.ts'
import { isSlideWip } from './slideWip.ts'

export interface SectionSlide {
  no: number
  wip: boolean
}

export interface SectionGroup {
  title: string
  sectionNo: number
  slides: SectionSlide[]
}

export interface SectionModelOptions {
  stopAtBackup?: boolean
}

const BODY_EXCLUDED_LAYOUTS = new Set(['cover', 'end', 'toc', 'blank'])

export function isSectionBodySlide(slide: any): boolean {
  const layout = getLayout(slide)
  return layout !== 'section' && layout !== 'backup' && !BODY_EXCLUDED_LAYOUTS.has(layout)
}

export function buildSectionGroups(
  slides: any[] = [],
  options: SectionModelOptions = {},
): SectionGroup[] {
  const stopAtBackup = options.stopAtBackup ?? true
  const result: SectionGroup[] = []
  let cur: SectionGroup | null = null

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const layout = getLayout(slide)
    const no = slide?.no ?? (i + 1)

    if (layout === 'backup' && stopAtBackup) break

    if (layout === 'section') {
      const title = getSectionTitle(slide, `§${result.length + 1}`)
      cur = { title, sectionNo: no, slides: [] }
      result.push(cur)
    } else if (cur && isSectionBodySlide(slide)) {
      cur.slides.push({ no, wip: isSlideWip(slide) })
    }
  }

  return result
}
