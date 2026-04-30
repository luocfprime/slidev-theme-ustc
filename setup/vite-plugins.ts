// Light-touch Vite plugin for the theme. Currently only exists to silence one
// known noisy sourcemap warning from the `entities` dep. Auto-numbering used
// to live here too; it has moved into the Slidev markdown transformer
// (setup/transformers.ts) so dev/build/export all share one code path.

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

export function isSlidevVirtualSlideModuleId(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return /__slidev_\d+\.(?:md|frontmatter)(?:\?|$)/.test(value)
    || /(?:^|\/)@slidev\/slides(?:\/|$|\?)/.test(value)
}

export function collectSlideHmrModules(moduleGraph: any): any[] {
  const result: any[] = []
  const seen = new Set<any>()

  const visit = (mod: any) => {
    if (!mod || seen.has(mod)) return
    if (!isSlidevVirtualSlideModuleId(mod.url) && !isSlidevVirtualSlideModuleId(mod.id)) return
    seen.add(mod)
    result.push(mod)
  }

  for (const mod of moduleGraph?.urlToModuleMap?.values?.() ?? []) visit(mod)
  for (const mod of moduleGraph?.idToModuleMap?.values?.() ?? []) visit(mod)

  return result
}

export default () => ({
  name: 'ustc-vite-tweaks',
  configResolved(config: any) {
    patchEntitiesSourcemapLogger(config.logger)
  },
  handleHotUpdate(ctx: any) {
    if (!/\.(?:md|mdx)$/.test(ctx.file)) return

    const slideModules = collectSlideHmrModules(ctx.server?.moduleGraph)
    for (const mod of slideModules) ctx.server.moduleGraph.invalidateModule(mod)

    return [...new Set([...(ctx.modules ?? []), ...slideModules])]
  },
})
