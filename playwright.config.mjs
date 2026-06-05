const isCI = !!process.env.CI

export default {
  testDir: './tests',
  timeout: 30_000,

  webServer: [
    {
      command: 'pnpm exec slidev tests/fixtures/numbering.md --port 13031',
      port: 13031,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev tests/fixtures/section-bar.md --port 13032',
      port: 13032,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev tests/fixtures/footnote.md --port 13033',
      port: 13033,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev tests/fixtures/auto-number-disabled.md --port 13034',
      port: 13034,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev tests/fixtures/section-bar-progress.md --port 13035',
      port: 13035,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm exec slidev tests/fixtures/figure-zoom.md --port 13036',
      port: 13036,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],

  projects: [
    {
      name: 'numbering',
      use: { baseURL: 'http://localhost:13031' },
      testMatch: ['numbering*.spec.mjs'],
    },
    {
      name: 'section-bar',
      use: { baseURL: 'http://localhost:13032' },
      testMatch: ['section-bar.spec.mjs', 'slides.spec.mjs'],
    },
    {
      name: 'footnote',
      use: { baseURL: 'http://localhost:13033' },
      testMatch: ['footnote.spec.mjs'],
    },
    {
      name: 'auto-number-disabled',
      use: { baseURL: 'http://localhost:13034' },
      testMatch: ['auto-number-disabled.spec.mjs'],
    },
    {
      name: 'section-bar-progress',
      use: { baseURL: 'http://localhost:13035' },
      testMatch: ['section-bar-progress.spec.mjs'],
    },
    {
      name: 'figure-zoom',
      use: { baseURL: 'http://localhost:13036' },
      testMatch: ['figure-zoom.spec.mjs'],
    },
  ],

  reporter: [['list']],
  use: { headless: true },
}
