function countComponents(content: string, pascal: string, kebab: string): number {
  const stripped = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
  return (stripped.match(new RegExp(`<(?:${pascal}|${kebab})\\b`, 'g')) ?? []).length
}

function isEntitiesSourcemapNoise(msg: unknown): boolean {
  const text = String(msg)
  return text.includes('/entities/') && text.includes('outside its package')
}

function patchEntitiesSourcemapLogger(logger: any) {
  if (!logger || logger.__ustcEntitiesSourcemapPatched) return
  const originalWarn = logger.warn?.bind(logger)
  const originalWarnOnce = logger.warnOnce?.bind(logger)

  if (originalWarn) {
    logger.warn = (msg: unknown, opts?: unknown) => {
      if (!isEntitiesSourcemapNoise(msg)) originalWarn(msg, opts)
    }
  }

  if (originalWarnOnce) {
    logger.warnOnce = (msg: unknown, opts?: unknown) => {
      if (!isEntitiesSourcemapNoise(msg)) originalWarnOnce(msg, opts)
    }
  }

  logger.__ustcEntitiesSourcemapPatched = true
}

// Injects _figureStart/_tableStart into each slide's frontmatter before the
// ?frontmatter virtual modules are compiled so the numbers survive build-mode
// content stripping.
export default (options: any) => ({
  name: 'ustc-numbering-inject',
  configResolved(config: any) {
    patchEntitiesSourcemapLogger(config.logger)
  },
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
})
