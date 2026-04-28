import { defineVitePluginsSetup } from '@slidev/types'

function countComponents(content: string, pascal: string, kebab: string): number {
  const stripped = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
  return (stripped.match(new RegExp(`<(?:${pascal}|${kebab})\\b`, 'g')) ?? []).length
}

// Injects _figureStart/_tableStart into each slide's frontmatter before the
// ?frontmatter virtual modules are compiled so the numbers survive build-mode
// content stripping.
export default defineVitePluginsSetup((options) => ({
  name: 'ustc-numbering-inject',
  buildStart() {
    const slides = options.data.slides
    let figureCount = 1
    let tableCount = 1

    for (const slide of slides) {
      const content = slide.source.content
      const figs = countComponents(content, 'FigureBlock', 'figure-block')
      const tabs = countComponents(content, 'TableBlock', 'table-block')

      if (figs > 0) slide.frontmatter._figureStart = figureCount
      if (tabs > 0) slide.frontmatter._tableStart = tableCount

      figureCount += figs
      tableCount += tabs
    }
  },
}))
