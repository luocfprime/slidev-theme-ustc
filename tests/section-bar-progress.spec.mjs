import { test, expect } from '@playwright/test'

async function gotoSlide(page, n) {
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 30_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()

// ──────────────────────────────────────────────────────────────────────────────
// Fixture layout (5 sections; section item width is narrow enough that Beta's
// 25 dots overflow one row and auto-switch to a progress bar).
//
//  1   cover
//  2   section Alpha
//  3-4 Alpha body × 2          → dots
//  5   section Beta
//  6-30 Beta body × 25         → progress bar (slide 18 = B13 has wip:true)
// 31   section Gamma
// 32   Gamma body — sectionBarMode: labels
// 33   Gamma body
// 34   section Delta
// 35-36 Delta body × 2
// 37   section Epsilon
// 38-39 Epsilon body × 2
//
// Section model: Alpha[2], Beta[25], Gamma[2], Delta[2], Epsilon[2]
// ──────────────────────────────────────────────────────────────────────────────

test.describe('section bar — short vs long indicator', () => {
  test('short Alpha section shows dots (fits one row)', async ({ page }) => {
    await gotoSlide(page, 3)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const alpha = slide(page).locator('.ustc-section-item').nth(0)
    await expect(alpha.locator('.ustc-dot')).toHaveCount(2)
    await expect(alpha.locator('.ustc-section-progress')).toHaveCount(0)
  })

  test('long Beta section auto-switches to progress bar', async ({ page }) => {
    await gotoSlide(page, 6)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const beta = slide(page).locator('.ustc-section-item').nth(1)
    await expect(beta.locator('.ustc-section-progress')).toBeVisible()
    await expect(beta.locator('.ustc-dot')).toHaveCount(0)
  })
})

test.describe('section bar — progress bar fill', () => {
  test('fill at first Beta slide is 0%', async ({ page }) => {
    await gotoSlide(page, 6) // B1
    await slide(page).locator('.ustc-section-bar').waitFor()
    const fill = slide(page).locator('.ustc-section-item').nth(1).locator('.ustc-progress-fill')
    await expect(fill).toHaveAttribute('style', /width:\s*0%/)
  })

  test('fill at midpoint Beta slide is 50%', async ({ page }) => {
    // B13 is slide 18; index 12 of 25 → 12/24 = 50%
    await gotoSlide(page, 18)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const fill = slide(page).locator('.ustc-section-item').nth(1).locator('.ustc-progress-fill')
    await expect(fill).toHaveAttribute('style', /width:\s*50%/)
  })

  test('fill at last Beta slide is 100%', async ({ page }) => {
    await gotoSlide(page, 30) // B25, index 24/24
    await slide(page).locator('.ustc-section-bar').waitFor()
    const fill = slide(page).locator('.ustc-section-item').nth(1).locator('.ustc-progress-fill')
    await expect(fill).toHaveAttribute('style', /width:\s*100%/)
  })
})

test.describe('section bar — progress bar click-to-jump', () => {
  test('click near right edge jumps to last slide in section', async ({ page }) => {
    await gotoSlide(page, 6)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const progress = slide(page)
      .locator('.ustc-section-item')
      .nth(1)
      .locator('.ustc-section-progress')
    const box = await progress.boundingBox()
    await progress.click({ position: { x: box.width - 2, y: box.height / 2 } })
    await page.waitForURL(/\/30(?:\/|$|\?)/, { timeout: 5000 })
  })

  test('click near left edge jumps to first slide in section', async ({ page }) => {
    await gotoSlide(page, 18) // start mid-section
    await slide(page).locator('.ustc-section-bar').waitFor()
    const progress = slide(page)
      .locator('.ustc-section-item')
      .nth(1)
      .locator('.ustc-section-progress')
    const box = await progress.boundingBox()
    await progress.click({ position: { x: 2, y: box.height / 2 } })
    await page.waitForURL(/\/6(?:\/|$|\?)/, { timeout: 5000 })
  })
})

test.describe('section bar — wip in progress bar mode', () => {
  test('Beta progress bar carries has-wip class because B13 is wip', async ({ page }) => {
    await gotoSlide(page, 6)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const progress = slide(page)
      .locator('.ustc-section-item')
      .nth(1)
      .locator('.ustc-section-progress')
    await expect(progress).toHaveClass(/has-wip/)
  })

  test('Alpha progress bar (if shown) or dots do NOT carry has-wip', async ({ page }) => {
    // Alpha has no wip slides; verify by checking dots have no is-wip
    await gotoSlide(page, 3)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const alphaDots = slide(page).locator('.ustc-section-item').nth(0).locator('.ustc-dot')
    await expect(alphaDots.nth(0)).not.toHaveClass(/is-wip/)
    await expect(alphaDots.nth(1)).not.toHaveClass(/is-wip/)
  })
})

test.describe('section bar — labels mode', () => {
  test('sectionBarMode:labels shows labels but no indicators', async ({ page }) => {
    await gotoSlide(page, 32) // G1, labels mode
    await slide(page).locator('.ustc-section-bar').waitFor()
    await expect(slide(page).locator('.ustc-section-bar')).toHaveClass(/is-labels/)
    // All five section labels render
    await expect(slide(page).locator('.ustc-section-label')).toHaveCount(5)
    // No dots and no progress bars
    await expect(slide(page).locator('.ustc-dot')).toHaveCount(0)
    await expect(slide(page).locator('.ustc-section-progress')).toHaveCount(0)
  })

  test('next slide (no override) returns to default full mode with mixed dots/progress', async ({
    page,
  }) => {
    await gotoSlide(page, 33) // G2, no override
    await slide(page).locator('.ustc-section-bar').waitFor()
    await expect(slide(page).locator('.ustc-section-bar')).not.toHaveClass(/is-labels/)
    // Beta still uses progress bar; Alpha/Gamma/Delta/Epsilon use dots
    await expect(
      slide(page).locator('.ustc-section-item').nth(1).locator('.ustc-section-progress'),
    ).toBeVisible()
    await expect(slide(page).locator('.ustc-section-item').nth(0).locator('.ustc-dot')).toHaveCount(
      2,
    )
  })
})
