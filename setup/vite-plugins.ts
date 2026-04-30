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

export default () => ({
  name: 'ustc-vite-tweaks',
  configResolved(config: any) {
    patchEntitiesSourcemapLogger(config.logger)
  },
})
