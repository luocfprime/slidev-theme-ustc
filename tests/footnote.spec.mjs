import { test, expect } from '@playwright/test'

// Fixture deck layout (footnote.md, port 13033)
//
//  1  cover
//  2  content  — "First use[^alpha] and second use[^alpha]" (same label twice)
//               [^alpha]: Alpha footnote definition.
//  3  content  — "Single[^beta] reference only."
//               [^beta]: Beta footnote definition.
//
// Bug: markdown-it-footnote v4 renders the second reference to the same label
// as [1:1] instead of [1]. This spec verifies both references show [1].

// Navigate to slide 1 with networkidle first (ensures Vite dep-opt completes
// and the Vue app fully mounts), then jump to the target slide via SPA
// navigation. Mirrors the approach in slides.spec.mjs.
async function gotoSlide(page, n) {
  await page.goto('/1', { waitUntil: 'networkidle' })
  await page.locator('.slidev-layout').first().waitFor({ state: 'attached', timeout: 15_000 })
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 15_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()

test.describe('footnote — repeated reference rendering', () => {
  test('slide 2 — both references to same footnote show [1], not [1:1]', async ({ page }) => {
    await gotoSlide(page, 2)
    const refs = slide(page).locator('.footnote-ref')
    await expect(refs).toHaveCount(2)
    // Both references to [^alpha] must render as "[1]", never "[1:1]"
    await expect(refs.nth(0)).toHaveText('[1]')
    await expect(refs.nth(1)).toHaveText('[1]')
  })

  test('slide 3 — single reference renders [1]', async ({ page }) => {
    await gotoSlide(page, 3)
    const refs = slide(page).locator('.footnote-ref')
    await expect(refs).toHaveCount(1)
    await expect(refs.nth(0)).toHaveText('[1]')
  })
})
