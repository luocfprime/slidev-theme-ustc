import { test, expect } from '@playwright/test'

test('all slides load without errors', async ({ page }) => {
  test.setTimeout(300_000)
  const allErrors = []

  // Vite transient dep-optimization 504: the client retries automatically; not a real error.
  // The "slide failed to load" entries are downstream consequences of the same 504.
  const ignore = (msg) =>
    msg.includes('Wake Lock') ||
    msg.includes('Outdated Optimize Dep') ||
    (msg.includes('Failed to fetch dynamically imported module') && msg.includes('@slidev/slides/'))

  page.on('pageerror', (err) => {
    if (ignore(err.message)) return
    allErrors.push({ slide: 0, msg: `PAGE ERROR: ${err.message}` })
  })
  page.on('console', (msg) => {
    const text = msg.text()
    if (msg.type() === 'error' && !ignore(text)) allErrors.push({ slide: 1, msg: text })
  })

  // Slide 1: full networkidle to ensure Vite dep-optimization completes before we
  // read $slidev.nav.total and start scanning.
  await page.goto('/1', { waitUntil: 'networkidle' })
  await page.waitForSelector('.slidev-layout', { timeout: 15_000 })

  // Read exact slide count from Slidev's runtime — avoids URL-redirect guessing.
  const total = await page.evaluate(() => {
    const app = document.querySelector('#app')?.__vue_app__
    return app?.config?.globalProperties?.$slidev?.nav?.total ?? null
  })
  if (!total) throw new Error('Could not read $slidev.nav.total — is the Slidev server running?')

  expect(
    await page.locator('.slidev-layout').count(),
    'Slide 1 should render a layout',
  ).toBeGreaterThan(0)

  for (let n = 2; n <= total; n++) {
    page.removeAllListeners('console')
    page.removeAllListeners('pageerror')

    const slideErr = []
    const slideWarn = []
    page.on('console', (msg) => {
      const text = msg.text()
      if (msg.type() === 'error' && !ignore(text)) slideErr.push(text)
      if (msg.type() === 'warning' && text.includes('[Vue warn]')) slideWarn.push(text)
    })
    page.on('pageerror', (err) => {
      if (ignore(err.message)) return
      slideErr.push(`PAGE ERROR: ${err.message}`)
    })

    // domcontentloaded is faster than networkidle for in-SPA navigation —
    // the main bundle is already cached; only the slide's dynamic module needs fetching.
    const res = await page
      .goto(`/${n}`, { waitUntil: 'domcontentloaded', timeout: 12_000 })
      .catch(() => null)
    if (!res) break

    // Wait for Vue to finish mounting all slide layouts (state: 'attached' matches
    // hidden elements too, so this fires as soon as Slidev renders the slide tree).
    await page.locator('.slidev-layout').first().waitFor({ state: 'attached', timeout: 15_000 })

    const layouts = await page.locator('.slidev-layout').count()

    if (slideErr.length) {
      for (const e of slideErr) console.log(`Slide ${n} ERROR: ${e.slice(0, 300)}`)
      allErrors.push(...slideErr.map((e) => ({ slide: n, msg: e })))
    }
    if (slideWarn.length) {
      for (const w of slideWarn) console.log(`Slide ${n} WARN: ${w.slice(0, 300)}`)
    }

    expect(layouts, `Slide ${n} should render a layout`).toBeGreaterThan(0)
  }

  if (allErrors.length > 0) {
    const summary = allErrors.map((e) => `  Slide ${e.slide}: ${e.msg.slice(0, 200)}`).join('\n')
    throw new Error(`Found ${allErrors.length} JS error(s):\n${summary}`)
  }
})
