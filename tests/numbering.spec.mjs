import { test, expect } from '@playwright/test'

// Smoke-level checks against the numbering fixture deck (port 13031).
// Exhaustive counter logic is tested in numbering.fixture.spec.mjs.

test('figure and table numbering renders correctly', async ({ page }) => {
  // Slide 2: first figure and table — basic independent counters
  await page.goto('/2', { waitUntil: 'domcontentloaded' })
  const slide = page.locator('.slidev-layout:visible').first()
  await slide.waitFor({ timeout: 30_000 })
  await expect(slide.locator('.figure-caption-label').first()).toHaveText(/^Fig\s*1/)
  await expect(slide.locator('.table-caption-label').first()).toHaveText(/^Tab\s*1/)

  // Slide 9: appendix counters reset and gain A. prefix
  await page.goto('/9', { waitUntil: 'domcontentloaded' })
  await slide.waitFor({ timeout: 30_000 })
  await expect(slide.locator('.figure-caption-label').first()).toHaveText(/^Fig\s*A\.1/)
  await expect(slide.locator('.table-caption-label').first()).toHaveText(/^Tab\s*A\.1/)
})
