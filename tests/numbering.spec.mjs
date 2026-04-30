import { test, expect } from '@playwright/test'

// Smoke-level checks against the numbering fixture deck (port 13031).
// Exhaustive counter logic is tested in numbering.fixture.spec.mjs.

test('figure and table numbering renders correctly', async ({ page }) => {
  // Slide 2: first figure and table — basic independent counters
  await page.goto('/2', { waitUntil: 'networkidle' })
  const figLabel = page.locator('.figure-caption-label').first()
  expect(await figLabel.textContent()).toMatch(/^Fig\s*1/)
  const tabLabel = page.locator('.table-caption-label').first()
  expect(await tabLabel.textContent()).toMatch(/^Tab\s*1/)

  // Slide 9: appendix counters reset and gain A. prefix
  await page.goto('/9', { waitUntil: 'networkidle' })
  const figLabelApp = page.locator('.figure-caption-label').first()
  expect(await figLabelApp.textContent()).toMatch(/^Fig\s*A\.1/)
  const tabLabelApp = page.locator('.table-caption-label').first()
  expect(await tabLabelApp.textContent()).toMatch(/^Tab\s*A\.1/)
})
