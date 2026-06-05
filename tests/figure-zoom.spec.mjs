import { test, expect } from '@playwright/test'

// Fixture deck layout (figure-zoom.md, port 13036)
//
//  headmatter: figureZoom: true   (deck-wide zoom default ON)
//
//  1  cover
//  2  content — <FigureBlock> with no zoomable prop → inherits global ON
//  3  content — <FigureBlock :zoomable="false"> → per-figure override OFF
//
// Covers: global figureZoom headmatter wiring, the per-figure override that
// turns zoom off, opening the lightbox on click, and closing via Esc / backdrop.

async function gotoSlide(page, n) {
  await page.goto('/1', { waitUntil: 'networkidle' })
  await page.locator('.slidev-layout').first().waitFor({ state: 'attached', timeout: 15_000 })
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 15_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()
const overlay = (page) => page.locator('.ustc-zoom-overlay')

test.describe('figure zoom — lightbox', () => {
  test('slide 2 — figure inherits global figureZoom and is marked zoomable', async ({ page }) => {
    await gotoSlide(page, 2)
    await expect(slide(page).locator('.figure-image')).toHaveClass(/is-zoomable/)
  })

  test('slide 2 — clicking the figure opens the overlay; Esc closes it', async ({ page }) => {
    await gotoSlide(page, 2)
    await expect(overlay(page)).toHaveCount(0)

    await slide(page).locator('.figure-image').click()
    await expect(overlay(page)).toBeVisible()
    await expect(overlay(page).locator('.ustc-zoom-img')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(overlay(page)).toHaveCount(0)
  })

  test('slide 2 — clicking the backdrop closes the overlay', async ({ page }) => {
    await gotoSlide(page, 2)
    await slide(page).locator('.figure-image').click()
    await expect(overlay(page)).toBeVisible()

    // Click a corner of the backdrop, away from the centered image.
    await overlay(page).click({ position: { x: 5, y: 5 } })
    await expect(overlay(page)).toHaveCount(0)
  })

  test('slide 3 — :zoomable="false" overrides global; figure is not zoomable and never opens', async ({
    page,
  }) => {
    await gotoSlide(page, 3)
    const img = slide(page).locator('.figure-image')
    await expect(img).not.toHaveClass(/is-zoomable/)

    await img.click()
    await expect(overlay(page)).toHaveCount(0)
  })
})
