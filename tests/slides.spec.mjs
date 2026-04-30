import { test, expect } from '@playwright/test'

const MAX_SLIDES = 40

test('all slides load without errors', async ({ page }) => {
  test.setTimeout(90_000)
  const allErrors = []

  // Wake Lock is requested by Slidev for presentation mode; headless Chromium always
  // denies it — filter it out so it doesn't register as a real JS error.
  const ignore = (msg) => msg.includes('Wake Lock')
  page.on('pageerror', err => {
    if (ignore(err.message)) return
    allErrors.push({ slide: 0, msg: `PAGE ERROR: ${err.message}` })
  })
  page.on('console', msg => {
    const text = msg.text()
    if (msg.type() === 'error') allErrors.push({ slide: 1, msg: text })
  })

  await page.goto('/1', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  const hasLayout1 = await page.locator('.slidev-layout').count()
  expect(hasLayout1, 'Slide 1 should render a layout').toBeGreaterThan(0)

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
    page.on('pageerror', err => {
      if (ignore(err.message)) return
      slideErr.push(`PAGE ERROR: ${err.message}`)
    })

    const res = await page.goto(`/${n}`, { waitUntil: 'networkidle', timeout: 8000 }).catch(() => null)
    if (!res) break
    if (page.url().endsWith('/1')) break

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
