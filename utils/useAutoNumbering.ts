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

function buildNumberMap(slides: any[], pascal: string, kebab: string): Map<number, number> {
  const map = new Map<number, number>()
  let globalNum = 1
  for (const slide of slides) {
    const count = countComponentTags(getContent(slide), pascal, kebab)
    if (count > 0) {
      map.set(slide.no, globalNum)
      globalNum += count
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
    figureMapShared.value = buildNumberMap(slides.value, 'FigureBlock', 'figure-block')
    tableMapShared.value = buildNumberMap(slides.value, 'TableBlock', 'table-block')
    figurePrefixShared.value = figurePrefix.value
    tablePrefixShared.value = tablePrefix.value
  })
}
