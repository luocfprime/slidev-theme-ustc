import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3030'

test('figure and table numbering renders correctly', async ({ page }) => {
  // Test first TableBlock on slide 13
  await page.goto(`${BASE}/13`, { waitUntil: 'networkidle' })
  const tableCaption = page.locator('.table-block-caption').first()
  const tableCaptionText = await tableCaption.textContent()
  expect(tableCaptionText).toMatch(/^表\s*1/)

  // Test first FigureBlock on slide 15
  await page.goto(`${BASE}/15`, { waitUntil: 'networkidle' })
  const figureCaption = page.locator('figcaption.figure-caption').first()
  const figureCaptionText = await figureCaption.textContent()
  expect(figureCaptionText).toMatch(/^图\s*1/)

  // Test second TableBlock on slide 35
  await page.goto(`${BASE}/35`, { waitUntil: 'networkidle' })
  const tableCaption2 = page.locator('.table-block-caption').first()
  const tableCaptionText2 = await tableCaption2.textContent()
  expect(tableCaptionText2).toMatch(/^表\s*2/)

  // Test second FigureBlock on slide 37
  await page.goto(`${BASE}/37`, { waitUntil: 'networkidle' })
  const figureCaption2 = page.locator('figcaption.figure-caption').first()
  const figureCaptionText2 = await figureCaption2.textContent()
  expect(figureCaptionText2).toMatch(/^图\s*2/)
})
