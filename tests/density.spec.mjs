import { test, expect } from '@playwright/test'

// Fixture deck layout (density.md, port 13037)
//
//  1  cover
//  2  content  density: normal   — baseline body font-size
//  3  content  density: compact  — middle tier, .compact class on layout root
//  4  content  density: dense    — tightest, .dense class on layout root
//  5  content  Box/ResultBox custom bg and borderColor props
//
// Verifies the three-tier density scale: the `.compact` class is applied and
// its body font-size sits strictly between normal and dense (monotonic
// normal > compact > dense). This exercises the token-swap wiring for all
// three tiers, not a hardcoded pixel value.

async function gotoSlide(page, n) {
  await page.goto('/1', { waitUntil: 'networkidle' })
  await page.locator('.slidev-layout').first().waitFor({ state: 'attached', timeout: 15_000 })
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 15_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()

const bodyFontPx = async (page) => {
  const px = await slide(page)
    .locator('p')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  return px
}

test.describe('density — three-tier scale', () => {
  test('compact applies .compact class and sits between normal and dense', async ({ page }) => {
    await gotoSlide(page, 2)
    await expect(slide(page)).not.toHaveClass(/\bcompact\b/)
    await expect(slide(page)).not.toHaveClass(/\bdense\b/)
    const normalPx = await bodyFontPx(page)

    await gotoSlide(page, 3)
    await expect(slide(page)).toHaveClass(/\bcompact\b/)
    const compactPx = await bodyFontPx(page)

    await gotoSlide(page, 4)
    await expect(slide(page)).toHaveClass(/\bdense\b/)
    const densePx = await bodyFontPx(page)

    // Monotonic decrease, with compact strictly in the middle.
    expect(normalPx).toBeGreaterThan(compactPx)
    expect(compactPx).toBeGreaterThan(densePx)
  })
})

test.describe('Box and ResultBox — styling props', () => {
  test('Box accepts bg and borderColor props', async ({ page }) => {
    await gotoSlide(page, 5)

    const box = slide(page).locator('.box').first()
    await expect(box).toHaveCSS('background-color', 'rgb(238, 245, 255)')
    await expect(box).toHaveCSS('border-color', 'rgb(147, 51, 234)')
  })

  test('ResultBox accepts bg and borderColor props', async ({ page }) => {
    await gotoSlide(page, 5)

    const custom = slide(page).locator('.result-box').first()
    await expect(custom).toHaveCSS('background-color', 'rgb(236, 253, 245)')
    await expect(custom).toHaveCSS('border-color', 'rgb(22, 163, 74)')

    const tokenResolved = slide(page).locator('.result-box').nth(1)
    await expect(tokenResolved).toHaveCSS('background-color', 'rgb(245, 245, 245)')
    await expect(tokenResolved).toHaveCSS('border-color', 'rgb(217, 119, 6)')
  })
})
