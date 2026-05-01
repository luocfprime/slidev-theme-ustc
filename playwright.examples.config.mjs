// Separate config for scanning all examples/ decks for JS errors.
// Run via: pnpm exec playwright test --config playwright.examples.config.mjs
// In CI this runs after the main playwright.config.mjs suite.

const isCI = !!process.env.CI

export default {
  testDir: './tests',
  timeout: 300_000,

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
      testMatch: ['slides.spec.mjs'],
    },
    {
      name: 'components',
      use: { baseURL: 'http://localhost:13034' },
      testMatch: ['slides.spec.mjs'],
    },
    {
      name: 'layouts',
      use: { baseURL: 'http://localhost:13035' },
      testMatch: ['slides.spec.mjs'],
    },
    {
      name: 'math',
      use: { baseURL: 'http://localhost:13036' },
      testMatch: ['slides.spec.mjs'],
    },
    {
      name: 'tweaks',
      use: { baseURL: 'http://localhost:13037' },
      testMatch: ['slides.spec.mjs'],
    },
  ],

  reporter: [['list']],
  use: { headless: true },
}
