// Playwright config for the five examples/ decks.
// Runs JS error scanning (slides.spec.mjs) and visual regression (visual.spec.mjs).
// Use: pnpm exec playwright test --config playwright.examples.config.mjs
//      pnpm test:visual          (visual regression only)
//      pnpm test:visual:update   (regenerate baselines)
const isCI = !!process.env.CI

export default {
  testDir: './tests',
  snapshotDir: './tests/snapshots',
  timeout: 300_000,
  snapshotPathTemplate: '{snapshotDir}/{projectName}/{arg}-{platform}{ext}',

  webServer: [
    {
      command: 'pnpm exec slidev examples/full-deck.md --port 13033',
      port: 13033,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev examples/components.md --port 13034',
      port: 13034,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev examples/layouts.md --port 13035',
      port: 13035,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev examples/math.md --port 13036',
      port: 13036,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev examples/tweaks.md --port 13037',
      port: 13037,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],

  projects: [
    {
      name: 'full-deck',
      use: { baseURL: 'http://localhost:13033' },
      testMatch: ['slides.spec.mjs', 'visual.spec.mjs'],
    },
    {
      name: 'components',
      use: { baseURL: 'http://localhost:13034' },
      testMatch: ['slides.spec.mjs', 'visual.spec.mjs'],
    },
    {
      name: 'layouts',
      use: { baseURL: 'http://localhost:13035' },
      testMatch: ['slides.spec.mjs', 'visual.spec.mjs'],
    },
    {
      name: 'math',
      use: { baseURL: 'http://localhost:13036' },
      testMatch: ['slides.spec.mjs', 'visual.spec.mjs'],
    },
    {
      name: 'tweaks',
      use: { baseURL: 'http://localhost:13037' },
      testMatch: ['slides.spec.mjs', 'visual.spec.mjs'],
    },
  ],

  reporter: [['list']],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
}
