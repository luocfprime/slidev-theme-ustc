import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3030'
const MAX_SLIDES = 40

test('all slides load without errors', async ({ page }) => {
  const allErrors = []

  const slideErrors = []
  const vueWarnings = []

  page.on('pageerror', err => allErrors.push({ slide: 0, msg: `PAGE ERROR: ${err.message}` }))
  page.on('console', msg => {
    const text = msg.text()
    if (msg.type() === 'error') slideErrors.push({ slide: 1, msg: text })
    if (msg.type() === 'warning' && text.includes('[Vue warn]')) vueWarnings.push({ slide: 1, msg: text })
  })

  // Visit slide 1 to find total count
  await page.goto(`${BASE}/1`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  const hasLayout1 = await page.locator('.slidev-layout').count()
  expect(hasLayout1, 'Slide 1 should render a layout').toBeGreaterThan(0)

  // Walk all slides
  for (let n = 2; n <= MAX_SLIDES; n++) {
    page.removeAllListeners('console')
    page.removeAllListeners('pageerror')

    const slideErr = []
    const slideWarn = []
    page.on('console', msg => {
      const text = msg.text()
      if (msg.type() === 'error') slideErr.push(text)
      if (msg.type() === 'warning' && text.includes('[Vue warn]')) slideWarn.push(text)
    })
    page.on('pageerror', err => slideErr.push(`PAGE ERROR: ${err.message}`))

    const res = await page.goto(`${BASE}/${n}`, { waitUntil: 'networkidle', timeout: 8000 }).catch(() => null)
    if (!res) break
    // Slidev redirects out-of-range slides back to slide 1 — detect that
    if (page.url() === `${BASE}/1` || page.url().endsWith('/1')) break

    await page.waitForTimeout(600)

    const layouts = await page.locator('.slidev-layout').count()

    if (slideErr.length) {
      for (const e of slideErr) console.log(`Slide ${n} ERROR: ${e.slice(0, 300)}`)
      allErrors.push(...slideErr.map(e => ({ slide: n, msg: e })))
    }
    if (slideWarn.length) {
      for (const w of slideWarn) console.log(`Slide ${n} WARN: ${w.slice(0, 300)}`)
    }

    expect(layouts, `Slide ${n} should render a layout`).toBeGreaterThan(0)
  }

  if (allErrors.length > 0) {
    const summary = allErrors.map(e => `  Slide ${e.slide}: ${e.msg.slice(0, 200)}`).join('\n')
    throw new Error(`Found ${allErrors.length} JS error(s):\n${summary}`)
  }
})
