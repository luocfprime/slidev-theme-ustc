import { test, expect } from '@playwright/test'

// Navigate to slide N and wait for the layout to mount.
async function gotoSlide(page, n) {
  await page.goto(`/${n}`, { waitUntil: 'networkidle' })
  // Slidev keeps all slides in DOM simultaneously; wait for the visible one.
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 10_000 })
}

// Scope queries to the currently visible layout so sibling slides in DOM don't
// contaminate results.
const slide = (page) => page.locator('.slidev-layout:visible').first()

// ──────────────────────────────────────────────────────────────────────────────
// Fixture deck layout (sectionBar: true, sectionBarMode: full globally)
//
//  1  cover                          no section bar (structural layout)
//  2  section  sectionLabel="Alpha"  section divider
//  3  content                        body A1
//  4  content  wip: true             body A2 — WIP
//  5  section  h1="Beta"             section divider
//  6  content                        body B1
//  7  content                        body B2
//  8  content  sectionBar: false     body B3 — bar hidden per-slide
//  9  content  sectionBarMode: minimal  body B4 — dots-only mode
// 10  toc      highlight: 1          structural (no section bar)
// 11  backup                         appendix boundary; stops section model scan
// 12  section  h1="After-Backup"     post-backup section
// 13  content                        post-backup body — bar renders, no active section
//
// buildSectionGroups (stopAtBackup=true) → Alpha[3,4], Beta[6,7,8,9]
// buildSectionGroups (stopAtBackup=false) → Alpha[3,4], Beta[6,7,8,9], After-Backup[13]
//   (used by toc layout)
// ──────────────────────────────────────────────────────────────────────────────

test.describe('section bar — structure and labels', () => {
  test('shows correct section count and labels on a body slide', async ({ page }) => {
    await gotoSlide(page, 3)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const items = slide(page).locator('.ustc-section-item')
    await expect(items).toHaveCount(2)
    await expect(items.nth(0).locator('.ustc-section-label')).toHaveText('Alpha')
    await expect(items.nth(1).locator('.ustc-section-label')).toHaveText('Beta')
  })

  test('correct dot count per section', async ({ page }) => {
    await gotoSlide(page, 3)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const alpha = slide(page).locator('.ustc-section-item').nth(0)
    const beta = slide(page).locator('.ustc-section-item').nth(1)
    // Alpha: body slides 3, 4
    await expect(alpha.locator('.ustc-dot')).toHaveCount(2)
    // Beta: body slides 6, 7, 8, 9 — sectionBar:false and sectionBarMode:minimal
    // are display overrides only; they do not remove slides from the section model
    await expect(beta.locator('.ustc-dot')).toHaveCount(4)
  })
})

test.describe('section bar — active section and dot states', () => {
  test('first section is active on slide 3 (Alpha body)', async ({ page }) => {
    await gotoSlide(page, 3)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const items = slide(page).locator('.ustc-section-item')
    await expect(items.nth(0)).toHaveClass(/is-active/)
    await expect(items.nth(1)).not.toHaveClass(/is-active/)
  })

  test('second section is active on slide 6 (Beta body)', async ({ page }) => {
    await gotoSlide(page, 6)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const items = slide(page).locator('.ustc-section-item')
    await expect(items.nth(0)).not.toHaveClass(/is-active/)
    await expect(items.nth(1)).toHaveClass(/is-active/)
  })

  test('current dot marks the slide being viewed', async ({ page }) => {
    await gotoSlide(page, 3)
    await slide(page).locator('.ustc-section-bar').waitFor()
    const alphaDots = slide(page).locator('.ustc-section-item').nth(0).locator('.ustc-dot')
    await expect(alphaDots.nth(0)).toHaveClass(/is-current/)
    await expect(alphaDots.nth(1)).not.toHaveClass(/is-current/)
  })

  test('past dots mark slides before the current page', async ({ page }) => {
    await gotoSlide(page, 6)
    await slide(page).locator('.ustc-section-bar').waitFor()
    // Alpha slides (3, 4) are both before slide 6
    const alphaDots = slide(page).locator('.ustc-section-item').nth(0).locator('.ustc-dot')
    await expect(alphaDots.nth(0)).toHaveClass(/is-past/)
    await expect(alphaDots.nth(1)).toHaveClass(/is-past/)
    // Beta first dot (slide 6) is current
    const betaDots = slide(page).locator('.ustc-section-item').nth(1).locator('.ustc-dot')
    await expect(betaDots.nth(0)).toHaveClass(/is-current/)
    await expect(betaDots.nth(1)).not.toHaveClass(/is-current/)
  })

  test('wip dot: slide with wip:true gets is-wip class on its dot', async ({ page }) => {
    await gotoSlide(page, 4)
    await slide(page).locator('.ustc-section-bar').waitFor()
    // Slide 4 is Alpha's second body slide and is marked wip:true
    const alphaDots = slide(page).locator('.ustc-section-item').nth(0).locator('.ustc-dot')
    await expect(alphaDots.nth(1)).toHaveClass(/is-wip/)
    await expect(alphaDots.nth(1)).toHaveClass(/is-current/)
    // Slide 3's dot is not wip
    await expect(alphaDots.nth(0)).not.toHaveClass(/is-wip/)
  })
})

test.describe('section bar — per-slide overrides', () => {
  test('sectionBar:false removes bar from DOM and adds no-section-bar class', async ({ page }) => {
    await gotoSlide(page, 8)
    await expect(slide(page).locator('.ustc-section-bar')).toHaveCount(0)
    // The layout element itself carries the no-section-bar class
    await expect(slide(page)).toHaveClass(/no-section-bar/)
  })

  test('sectionBarMode:minimal shows dots but hides labels', async ({ page }) => {
    await gotoSlide(page, 9)
    await slide(page).locator('.ustc-section-bar').waitFor()
    await expect(slide(page).locator('.ustc-section-bar')).toHaveClass(/is-minimal/)
    await expect(slide(page).locator('.ustc-section-label')).toHaveCount(0)
    // Dots still exist
    await expect(slide(page).locator('.ustc-dot').first()).toBeVisible()
  })
})


test.describe('section bar — post-backup behavior', () => {
  test('bar still renders on a content slide after backup', async ({ page }) => {
    await gotoSlide(page, 13)
    await slide(page).locator('.ustc-section-bar').waitFor()
    // Pre-backup sections (Alpha, Beta) are still shown
    await expect(slide(page).locator('.ustc-section-item')).toHaveCount(2)
  })

  test('no section is active on a post-backup body slide', async ({ page }) => {
    await gotoSlide(page, 13)
    await slide(page).locator('.ustc-section-bar').waitFor()
    // Slide 13 is not in any section group (model stops at backup)
    const items = slide(page).locator('.ustc-section-item')
    await expect(items.nth(0)).not.toHaveClass(/is-active/)
    await expect(items.nth(1)).not.toHaveClass(/is-active/)
  })
})

test.describe('toc layout', () => {
  test('lists all sections in order (stopAtBackup=false includes After-Backup)', async ({ page }) => {
    await gotoSlide(page, 10)
    const items = slide(page).locator('.toc-item')
    await expect(items).toHaveCount(3)
    await expect(items.nth(0).locator('.toc-label')).toContainText('Alpha')
    await expect(items.nth(1).locator('.toc-label')).toContainText('Beta')
    await expect(items.nth(2).locator('.toc-label')).toContainText('After-Backup')
  })

  test('highlight:1 marks first section highlighted, rest dimmed', async ({ page }) => {
    await gotoSlide(page, 10)
    const items = slide(page).locator('.toc-item')
    await expect(items.nth(0)).toHaveClass(/is-highlighted/)
    await expect(items.nth(1)).toHaveClass(/is-dimmed/)
    await expect(items.nth(2)).toHaveClass(/is-dimmed/)
  })
})
