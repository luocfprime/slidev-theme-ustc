import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    fs: {
      // Resolve absolute path so Vite correctly allows the project root and node_modules
      allow: [resolve(dir, '..')],
    },
  },
})
