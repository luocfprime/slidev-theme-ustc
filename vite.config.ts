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
      // Use markdownSetup (not markdownItSetup): Slidev v52 / unplugin-vue-markdown
      // v30 picks markdownSetup over markdownItSetup and ignores the latter when
      // markdownSetup is already set. Slidev chains our markdownSetup after
      // registering its own plugins (including MarkdownItFootnote), so the
      // footnote_caption override runs after the plugin has set its default.
      markdownSetup(md) {
        // markdown-it-footnote v4 renders repeated references to the same
        // footnote as [1:1], [1:2], etc. (subId suffix). Academic slides
        // expect all references to the same footnote to look identical ([1]),
        // so we drop the subId suffix.
        md.renderer.rules.footnote_caption = (tokens, idx) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const n = Number((tokens[idx] as any).meta.id + 1).toString()
          return `[${n}]`
        }
      },
    },
  },
})
