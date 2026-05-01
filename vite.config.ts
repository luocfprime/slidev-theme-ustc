import { createLogger, defineConfig } from 'vite'

// entities 4.x ships sourcemaps with a GitHub raw sourceRoot but relative
// sources — Vite resolves them against the local path and warns. Filter at
// the logger level since sourcemapIgnoreList only controls output sourcemaps.
const logger = createLogger()
const isEntitiesSourcemapNoise = (msg: string) =>
  msg.includes('/entities/') && msg.includes('outside its package')
const originalWarn = logger.warn.bind(logger)
const originalWarnOnce = logger.warnOnce.bind(logger)
logger.warn = (msg, opts) => {
  if (!isEntitiesSourcemapNoise(msg)) originalWarn(msg, opts)
}
logger.warnOnce = (msg, opts) => {
  if (!isEntitiesSourcemapNoise(msg)) originalWarnOnce(msg, opts)
}

export default defineConfig({
  customLogger: logger,
  slidev: {
    markdown: {
      markdownOptions: {
        // unplugin-vue-markdown defaults typographer to true, enabling (c)→©,
        // (r)→®, --→– etc. Academic decks often need these as literal text,
        // so the theme opts out. Override in your deck's vite.config.js with
        // slidev: { markdown: { markdownOptions: { typographer: true } } }.
        typographer: false,
      },
    },
  },
})
