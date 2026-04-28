import { createLogger, defineConfig } from 'vite'

// entities 4.x ships sourcemaps with a GitHub raw sourceRoot but relative
// sources — Vite resolves them against the local path and warns. Filter at
// the logger level since sourcemapIgnoreList only controls output sourcemaps.
const logger = createLogger()
const isEntitiesSourcemapNoise = (msg: string) =>
  msg.includes('/entities/') && msg.includes('outside its package')
const originalWarn = logger.warn.bind(logger)
const originalWarnOnce = logger.warnOnce.bind(logger)
logger.warn = (msg, opts) => { if (!isEntitiesSourcemapNoise(msg)) originalWarn(msg, opts) }
logger.warnOnce = (msg, opts) => { if (!isEntitiesSourcemapNoise(msg)) originalWarnOnce(msg, opts) }

export default defineConfig({
  customLogger: logger,
})
