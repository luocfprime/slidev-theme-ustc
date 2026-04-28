import { type ComputedRef, watchEffect } from 'vue'
import { figureMapShared, tableMapShared, figurePrefixShared, tablePrefixShared } from './numbering'

function getContent(slide: any): string {
  return slide?.source?.content ?? slide?.content ?? slide?.meta?.slide?.content ?? ''
}

function stripCodeBlocks(content: string): string {
  return content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
}

function countComponentTags(content: string, pascalName: string, kebabName: string): number {
  const stripped = stripCodeBlocks(content)
  return (stripped.match(new RegExp(`<(?:${pascalName}|${kebabName})\\b`, 'g')) ?? []).length
}

function buildNumberMap(slides: any[], pascal: string, kebab: string, frontmatterKey: string): Map<number, number> {
  const map = new Map<number, number>()

  // In build mode Slidev strips all slide content to "". Fall back to the
  // _figureStart/_tableStart values injected by the numberingInjector transformer.
  const hasContent = slides.some(s => (getContent(s) || '').trim() !== '')

  if (hasContent) {
    let globalNum = 1
    for (const slide of slides) {
      const count = countComponentTags(getContent(slide), pascal, kebab)
      if (count > 0) {
        map.set(slide.no, globalNum)
        globalNum += count
      }
    }
  } else {
    for (const slide of slides) {
      const startNum = slide.meta?.slide?.frontmatter?.[frontmatterKey]
      if (typeof startNum === 'number') map.set(slide.no, startNum)
    }
  }

  return map
}

export function useAutoNumbering(
  slides: ComputedRef<any[]>,
  figurePrefix: ComputedRef<string>,
  tablePrefix: ComputedRef<string>,
): void {
  watchEffect(() => {
    figureMapShared.value = buildNumberMap(slides.value, 'FigureBlock', 'figure-block', '_figureStart')
    tableMapShared.value = buildNumberMap(slides.value, 'TableBlock', 'table-block', '_tableStart')
    figurePrefixShared.value = figurePrefix.value
    tablePrefixShared.value = tablePrefix.value
  })
}
