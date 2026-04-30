// Vite plugin for the theme. Handles HMR invalidation of Slidev virtual slide
// modules when .md files change. The entities sourcemap warning is filtered in
// vite.config.ts via customLogger (this file's configResolved hook is removed
// because vite.config.ts patches the logger first, making it a no-op here).

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
  handleHotUpdate(ctx: any) {
    if (!/\.(?:md|mdx)$/.test(ctx.file)) return

    const slideModules = collectSlideHmrModules(ctx.server?.moduleGraph)
    for (const mod of slideModules) ctx.server.moduleGraph.invalidateModule(mod)

    return [...new Set([...(ctx.modules ?? []), ...slideModules])]
  },
})
