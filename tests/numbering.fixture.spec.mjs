import { test, expect } from '@playwright/test'

async function gotoSlide(page, n) {
  await page.goto(`/${n}`, { waitUntil: 'networkidle' })
  // Slidev keeps all slides in DOM simultaneously; wait for the visible one.
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 10_000 })
}

// Scope queries to the currently visible layout so sibling slides in DOM don't
// contaminate results.
const slide = (page) => page.locator('.slidev-layout:visible').first()

async function figLabel(page, nth = 0) {
  const text = await slide(page).locator('.figure-caption-label').nth(nth).textContent()
  return text.trim()
}

async function tabLabel(page, nth = 0) {
  const text = await slide(page).locator('.table-caption-label').nth(nth).textContent()
  return text.trim()
}

// ──────────────────────────────────────────────────────────────────────────────
// Fixture deck layout (theme: ../../, figurePrefix: "Fig", tablePrefix: "Tab")
//
//  1  cover     (sets global config)
//  2  content   Fig 1,  Tab 1      basic independent counters
//  3  content   Fig 2,  Tab 2      cross-slide continuity
//  4  content   Scheme 3           per-component prefix, counter advances
//  5  content   (none), Fig 4      :numbered=false opt-out
//  6  content   Fig 10, Fig 11     manual :number, counter advances to max+1
//  7  content   Fig 12             no caption → no suffix
//  8  backup                       appendix boundary
//  9  content   Fig A.1, Tab A.1   appendix counters reset + A. prefix
// 10  content   Fig A.2            appendix counter continues
// ──────────────────────────────────────────────────────────────────────────────

test.describe('figure/table auto-numbering', () => {
  test('slide 2 — independent figure and table counters', async ({ page }) => {
    await gotoSlide(page, 2)
    expect(await figLabel(page)).toBe('Fig 1.')
    expect(await tabLabel(page)).toBe('Tab 1.')
  })

  test('slide 3 — counters carry across slides', async ({ page }) => {
    await gotoSlide(page, 3)
    expect(await figLabel(page)).toBe('Fig 2.')
    expect(await tabLabel(page)).toBe('Tab 2.')
  })

  test('slide 4 — per-component prefix overrides global; counter still advances', async ({
    page,
  }) => {
    await gotoSlide(page, 4)
    // prefix="Scheme" replaces the label text; the number is from the global counter (3)
    expect(await figLabel(page)).toBe('Scheme 3.')
  })

  test('slide 5 — :numbered=false produces no label and does not advance counter', async ({
    page,
  }) => {
    await gotoSlide(page, 5)
    // First figure-block has :numbered=false — no figcaption at all
    const firstFig = slide(page).locator('.figure-block').first()
    await expect(firstFig.locator('.figure-caption-label')).toHaveCount(0)
    // Only one label exists on the slide (the second FigureBlock)
    await expect(slide(page).locator('.figure-caption-label')).toHaveCount(1)
    // Counter was NOT incremented by the :numbered=false block, so next is 4
    expect(await figLabel(page)).toBe('Fig 4.')
  })

  test('slide 6 — manual :number jumps counter; next auto-number continues from max+1', async ({
    page,
  }) => {
    await gotoSlide(page, 6)
    expect(await figLabel(page, 0)).toBe('Fig 10.')
    expect(await figLabel(page, 1)).toBe('Fig 11.')
  })

  test('slide 7 — no caption means no suffix in the label', async ({ page }) => {
    await gotoSlide(page, 7)
    // labelText omits the suffix when hasCaptionContent is false
    expect(await figLabel(page)).toBe('Fig 12')
  })

  test('slide 9 — appendix counters reset after backup and use A. prefix', async ({ page }) => {
    await gotoSlide(page, 9)
    expect(await figLabel(page)).toBe('Fig A.1.')
    expect(await tabLabel(page)).toBe('Tab A.1.')
  })

  test('slide 10 — appendix figure counter increments independently', async ({ page }) => {
    await gotoSlide(page, 10)
    expect(await figLabel(page)).toBe('Fig A.2.')
  })
})
