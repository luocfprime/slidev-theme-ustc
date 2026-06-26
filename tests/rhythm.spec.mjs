import { test, expect } from '@playwright/test'

test.setTimeout(60_000)

// Fixture deck layout (rhythm.md, port 13038)
//
//  1  cover    global lineHeight: 1.6, flowGap: tight
//  2  content  inherits global rhythm
//  3  content  overrides lineHeight and flowGap locally
//  4  content  dense slide inheriting explicit global rhythm
//  5  split    overrides lineHeight and flowGap locally
//  6  content  code, Mermaid, and Plotly blocks use flowGap
//  7  split    split-column blocks use flowGap
//  8  content  QRCode, VideoBlock, and Typst output use flowGap
//  9  content  nested generated blocks keep internal spacing

async function gotoSlide(page, n) {
  await page.goto('/1', { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout').first().waitFor({ state: 'attached', timeout: 30_000 })
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 30_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()

const cssVar = async (page, name) =>
  slide(page).evaluate((el, name) => getComputedStyle(el).getPropertyValue(name).trim(), name)

const marginBottom = async (page, selector) =>
  slide(page)
    .locator(selector)
    .first()
    .evaluate((el) => getComputedStyle(el).marginBottom)

const marginTop = async (page, selector) =>
  slide(page)
    .locator(selector)
    .first()
    .evaluate((el) => getComputedStyle(el).marginTop)

const directMarginBottom = async (page, selector) =>
  slide(page).evaluate((root, selector) => {
    const el = root.querySelector(selector)
    if (!el) throw new Error(`Missing rhythm fixture selector: ${selector}`)
    return getComputedStyle(el).marginBottom
  }, selector)

test.describe('body rhythm frontmatter', () => {
  test('global lineHeight and flowGap apply to body layouts', async ({ page }) => {
    await gotoSlide(page, 2)

    await expect(slide(page).locator('p').first()).toHaveCSS('line-height', '35.84px')
    expect(await cssVar(page, '--ustc-lh')).toBe('1.6')
    expect(await cssVar(page, '--ustc-component-gap')).toBe('0.45rem')
  })

  test('slide lineHeight and flowGap override global defaults', async ({ page }) => {
    await gotoSlide(page, 3)

    await expect(slide(page).locator('p').first()).toHaveCSS('line-height', '30.24px')
    expect(await cssVar(page, '--ustc-lh')).toBe('1.35')
    expect(await cssVar(page, '--ustc-component-gap')).toBe('1.25rem')
    expect(await marginBottom(page, '.figure-block')).toBe('20px')
    expect(await marginBottom(page, '.table-block')).toBe('20px')
  })

  test('explicit global rhythm is preserved on dense slides', async ({ page }) => {
    await gotoSlide(page, 4)

    await expect(slide(page)).toHaveClass(/\bdense\b/)
    expect(await cssVar(page, '--ustc-lh')).toBe('1.6')
    expect(await cssVar(page, '--ustc-component-gap')).toBe('0.45rem')
  })

  test('split layout accepts local lineHeight and flowGap overrides', async ({ page }) => {
    await gotoSlide(page, 5)

    await expect(slide(page)).toHaveClass(/\bsplit\b/)
    await expect(slide(page).locator('p').first()).toHaveCSS('line-height', '31.36px')
    expect(await cssVar(page, '--ustc-lh')).toBe('1.4')
    expect(await cssVar(page, '--ustc-component-gap')).toBe('2ch')
  })

  test('Slidev-rendered flow blocks use flowGap', async ({ page }) => {
    await gotoSlide(page, 6)

    expect(await cssVar(page, '--ustc-component-gap')).toBe('1.25rem')
    expect(
      await directMarginBottom(
        page,
        ':scope > .slidev-code-wrapper, :scope > pre.slidev-code, :scope > pre.shiki',
      ),
    ).toBe('20px')
    expect(await marginBottom(page, '.mermaid')).toBe('20px')
    expect(await marginBottom(page, '.plotly-wrap')).toBe('20px')
  })

  test('split column flow blocks use flowGap', async ({ page }) => {
    await gotoSlide(page, 7)

    expect(await cssVar(page, '--ustc-component-gap')).toBe('1rem')
    expect(await marginBottom(page, '.split-col .block')).toBe('16px')
    expect(await marginBottom(page, '.split-col .plotly-wrap')).toBe('16px')
  })

  test('media and transformed flow blocks use flowGap', async ({ page }) => {
    await gotoSlide(page, 8)

    expect(await cssVar(page, '--ustc-component-gap')).toBe('1.25rem')
    expect(await marginBottom(page, '.ustc-qrcode-wrap')).toBe('20px')
    expect(await marginBottom(page, '.video-block')).toBe('20px')
    expect(await marginBottom(page, '.typst-doc')).toBe('20px')
  })

  test('nested generated blocks are not treated as top-level flow blocks', async ({ page }) => {
    await gotoSlide(page, 9)

    expect(await cssVar(page, '--ustc-component-gap')).toBe('1.25rem')
    expect(await marginTop(page, '.block .slidev-code-wrapper')).toBe('4px')
    expect(await marginBottom(page, '.block .slidev-code-wrapper')).toBe('4px')
  })
})
