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
      testMatch: ['section-bar*.spec.mjs', 'slides.spec.mjs'],
    },
    {
      name: 'footnote',
      use: { baseURL: 'http://localhost:13033' },
      testMatch: ['footnote.spec.mjs'],
    },
  ],

  reporter: [['list']],
  use: { headless: true },
}
