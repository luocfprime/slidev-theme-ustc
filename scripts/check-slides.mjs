import { chromium } from '@playwright/test'

const BASE = 'http://localhost:3030'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const errors = []
  const warnings = []

  page.on('console', (msg) => {
    const text = msg.text()
    if (msg.type() === 'error') errors.push(text)
    else if (msg.type() === 'warning' && text.includes('[Vue warn]')) warnings.push(text)
  })

  page.on('pageerror', (err) => errors.push(`PAGE ERROR: ${err.message}`))

  // Load first slide
  await page.goto(`${BASE}/1`, { waitUntil: 'networkidle', timeout: 15000 })
  await page.waitForTimeout(1000)

  // Find total slides
  await page.evaluate(() => {
    const el = document.querySelector('meta[property="slidev:slides"]')
    return el?.content ?? null
  })

  // Navigate by reading the URL after clicking next
  let slideNum = 1
  const results = []

  while (true) {
    if (slideNum > 40) break // safety limit

    const slideErrors = []
    const slideWarnings = []

    page.removeAllListeners('console')
    page.removeAllListeners('pageerror')

    page.on('console', (msg) => {
      const text = msg.text()
      if (msg.type() === 'error') slideErrors.push(text)
      else if (msg.type() === 'warning' && (text.includes('[Vue warn]') || text.includes('Error')))
        slideWarnings.push(text)
    })
    page.on('pageerror', (err) => slideErrors.push(`PAGE ERROR: ${err.message}`))

    const res = await page
      .goto(`${BASE}/${slideNum}`, { waitUntil: 'networkidle', timeout: 10000 })
      .catch(() => null)
    if (!res || res.status() === 404) break
    // Slidev redirects out-of-range slide numbers back to /1
    if (slideNum > 1 && (page.url() === `${BASE}/1` || page.url().endsWith('/1'))) break

    await page.waitForTimeout(800)

    const hasLayout = await page.evaluate(() => document.querySelector('.slidev-layout') !== null)

    results.push({
      slide: slideNum,
      loaded: hasLayout,
      errors: slideErrors,
      warnings: slideWarnings,
    })

    console.log(
      `Slide ${slideNum}: ${hasLayout ? 'OK' : 'FAILED'}${slideErrors.length ? ` | ${slideErrors.length} error(s)` : ''}${slideWarnings.length ? ` | ${slideWarnings.length} warning(s)` : ''}`,
    )
    if (slideErrors.length) slideErrors.forEach((e) => console.log(`  ERROR: ${e.slice(0, 200)}`))
    if (slideWarnings.length)
      slideWarnings.forEach((w) => console.log(`  WARN: ${w.slice(0, 200)}`))

    slideNum++
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Total slides checked: ${slideNum - 1}`)
  const failed = results.filter((r) => !r.loaded || r.errors.length > 0)
  if (failed.length === 0) {
    console.log('All slides loaded OK with no errors.')
  } else {
    console.log(`${failed.length} slide(s) with issues:`)
    for (const r of failed) {
      console.log(`  Slide ${r.slide}: loaded=${r.loaded} errors=${r.errors.length}`)
    }
  }

  const withWarnings = results.filter((r) => r.warnings.length > 0)
  if (withWarnings.length) {
    console.log(`\n${withWarnings.length} slide(s) with Vue warnings:`)
    for (const r of withWarnings) {
      console.log(`  Slide ${r.slide}:`)
      r.warnings.forEach((w) => console.log(`    ${w.slice(0, 300)}`))
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
