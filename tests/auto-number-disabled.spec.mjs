import { test, expect } from '@playwright/test'

// Fixture deck: tests/fixtures/auto-number-disabled.md
// Slide 1: cover
// Slide 2: content — one FigureBlock and one TableBlock, autoNumber: false in headmatter

const slide = (page) => page.locator('.slidev-layout:visible').first()

test('autoNumber: false — FigureBlock and TableBlock render without number labels', async ({
  page,
}) => {
  await page.goto('/2', { waitUntil: 'domcontentloaded' })
  await slide(page).waitFor({ timeout: 30_000 })

  await expect(slide(page).locator('.figure-caption-label')).toHaveCount(0)
  await expect(slide(page).locator('.table-caption-label')).toHaveCount(0)
})
