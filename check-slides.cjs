'use strict'
const { homedir } = require('os')
const path = require('path')
const { readdirSync, existsSync } = require('fs')

function findInNpxCache(pkg) {
  const npxCache = path.join(homedir(), '.npm', '_npx')
  if (!existsSync(npxCache)) return null
  for (const hash of readdirSync(npxCache)) {
    const mod = path.join(npxCache, hash, 'node_modules', pkg)
    if (existsSync(mod)) return mod
  }
  return null
}

const playwrightPath = findInNpxCache('playwright')
if (!playwrightPath) {
  console.error('playwright not found in npx cache. Run: npx playwright install')
  process.exit(1)
}
const { chromium } = require(playwrightPath)

const BASE = 'http://localhost:3030'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const results = []
  let slideNum = 1

  while (slideNum <= 200) {
    const slideErrors = []
    const slideWarnings = []

    page.removeAllListeners('console')
    page.removeAllListeners('pageerror')

    page.on('console', msg => {
      const text = msg.text()
      if (msg.type() === 'error') slideErrors.push(text)
      if (msg.type() === 'warning' && text.includes('[Vue warn]')) slideWarnings.push(text)
    })
    page.on('pageerror', err => {
      const msg = err.message
      if (msg.includes('Wake Lock')) return // browser API denied in headless — harmless
      slideErrors.push(`PAGE ERROR: ${msg}`)
    })

    let res
    try {
      res = await page.goto(`${BASE}/${slideNum}`, { waitUntil: 'networkidle', timeout: 10000 })
    } catch {
      break
    }
    if (!res) break

    // Wait for Vue Router's async redirect to settle, then check URL
    await page.waitForTimeout(700)

    const finalUrl = page.url()
    const match = finalUrl.match(/\/(\d+)\/?$/)
    const landedOn = match ? parseInt(match[1], 10) : slideNum
    if (slideNum > 1 && landedOn !== slideNum) break // router redirected us = past the end

    const hasLayout = await page.evaluate(() => document.querySelector('.slidev-layout') !== null)

    results.push({ slide: slideNum, loaded: hasLayout, errors: slideErrors, warnings: slideWarnings })

    const errTag = slideErrors.length ? ` | ${slideErrors.length} error(s)` : ''
    const warnTag = slideWarnings.length ? ` | ${slideWarnings.length} Vue warn(s)` : ''
    console.log(`Slide ${slideNum}: ${hasLayout ? 'OK' : 'NO LAYOUT'}${errTag}${warnTag}`)
    if (slideErrors.length) slideErrors.forEach(e => console.log(`  ERROR: ${e.slice(0, 250)}`))
    if (slideWarnings.length) slideWarnings.forEach(w => console.log(`  WARN:  ${w.slice(0, 250)}`))

    slideNum++
  }

  const total = slideNum - 1
  const failed = results.filter(r => !r.loaded || r.errors.length > 0)

  console.log(`\n=== SUMMARY (${total} slides) ===`)
  if (failed.length === 0) {
    console.log('All slides loaded OK with no JS errors.')
  } else {
    console.log(`${failed.length} slide(s) with issues:`)
    failed.forEach(r => console.log(`  Slide ${r.slide}: loaded=${r.loaded}, errors=${r.errors.length}`))
  }

  const withWarnings = results.filter(r => r.warnings.length > 0)
  if (withWarnings.length) {
    console.log(`\n${withWarnings.length} slide(s) with Vue warnings (not fatal):`)
    withWarnings.forEach(r => {
      console.log(`  Slide ${r.slide}:`)
      r.warnings.forEach(w => console.log(`    ${w.slice(0, 300)}`))
    })
  }

  await browser.close()
  process.exit(failed.length > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
