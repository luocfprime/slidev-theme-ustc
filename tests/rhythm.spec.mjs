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
// 10  content  Markdown flow before components uses flowGap
// 11  content  Block floating label style and color prop
// 12  content  dense Block floating label spacing stays compact
// 13  split    code block before titled Block leaves floating-label space

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

const borderBoxGap = async (page, fromSelector, toSelector) =>
  slide(page).evaluate(
    (root, [fromSelector, toSelector]) => {
      const from = root.querySelector(fromSelector)
      const to = root.querySelector(toSelector)
      if (!from || !to) {
        throw new Error(`Missing rhythm fixture selector pair: ${fromSelector} -> ${toSelector}`)
      }
      const fromRect = from.getBoundingClientRect()
      const toRect = to.getBoundingClientRect()
      return Math.round((toRect.top - fromRect.bottom) * 100) / 100
    },
    [fromSelector, toSelector],
  )

test.describe('body rhythm frontmatter', () => {
  test('Block title renders as an outlined floating label with selectable color', async ({
    page,
  }) => {
    await gotoSlide(page, 11)

    const defaultBlock = slide(page).locator('.block').filter({ hasText: 'Default block' })
    const defaultTitle = defaultBlock.locator('.block-title')
    const customBlock = slide(page).locator('.block').filter({ hasText: 'Green block' })
    const customTitle = customBlock.locator('.block-title')

    await expect(defaultBlock).toHaveCSS('position', 'relative')
    await expect(defaultBlock).toHaveCSS('border-top-width', '2px')
    await expect(defaultTitle).toHaveCSS('position', 'relative')
    await expect(defaultTitle).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(defaultTitle).toHaveCSS('color', 'rgb(22, 57, 107)')

    await expect(customTitle).toHaveCSS('color', 'rgb(6, 95, 70)')
    await expect(customBlock).not.toHaveCSS(
      'border-color',
      await defaultBlock.evaluate((el) => getComputedStyle(el).borderColor),
    )
  })

  test('adjacent titled Blocks leave visible space for floating labels', async ({ page }) => {
    await gotoSlide(page, 11)

    const gap = await slide(page).evaluate((root) => {
      const blocks = [...root.querySelectorAll('.block')]
      if (blocks.length < 2) throw new Error('Expected at least two Block components')
      const firstRect = blocks[0].getBoundingClientRect()
      const secondTitle = blocks[1].querySelector('.block-title')
      if (!secondTitle) throw new Error('Expected second Block title')
      const titleRect = secondTitle.getBoundingClientRect()
      return Math.round((titleRect.top - firstRect.bottom) * 100) / 100
    })

    expect(gap).toBeGreaterThanOrEqual(10)
  })

  test('wrapped Block titles reserve body space', async ({ page }) => {
    await gotoSlide(page, 11)

    const gap = await slide(page).evaluate((root) => {
      const block = [...root.querySelectorAll('.block')].find((el) =>
        el.textContent?.includes('deliberately long theorem label'),
      )
      const title = block?.querySelector('.block-title')
      const bodyFirst = block?.querySelector('.block-body > :first-child')
      if (!block || !title || !bodyFirst) {
        throw new Error('Expected wrapped title Block with body content')
      }
      const titleRect = title.getBoundingClientRect()
      const bodyRect = bodyFirst.getBoundingClientRect()
      return Math.round((bodyRect.top - titleRect.bottom) * 100) / 100
    })

    expect(gap).toBeGreaterThanOrEqual(4)
  })

  test('dense adjacent titled Blocks keep compact floating-label spacing', async ({ page }) => {
    await gotoSlide(page, 12)

    const gap = await slide(page).evaluate((root) => {
      const blocks = [...root.querySelectorAll('.block')]
      if (blocks.length < 2) throw new Error('Expected at least two Block components')
      const firstRect = blocks[0].getBoundingClientRect()
      const secondTitle = blocks[1].querySelector('.block-title')
      if (!secondTitle) throw new Error('Expected second Block title')
      const titleRect = secondTitle.getBoundingClientRect()
      return Math.round((titleRect.top - firstRect.bottom) * 100) / 100
    })

    expect(gap).toBeGreaterThanOrEqual(6)
    expect(gap).toBeLessThanOrEqual(10)
  })

  test('split code blocks leave visible space before floating Block labels', async ({ page }) => {
    await gotoSlide(page, 13)

    const gap = await slide(page).evaluate((root) => {
      const block = root.querySelector('.split-col .block')
      const title = block?.querySelector('.block-title')
      const previous = block?.previousElementSibling
      if (!block || !title || !previous) {
        throw new Error('Expected split-column code block followed by titled Block')
      }
      const previousRect = previous.getBoundingClientRect()
      const titleRect = title.getBoundingClientRect()
      return Math.round((titleRect.top - previousRect.bottom) * 100) / 100
    })

    expect(gap).toBeGreaterThanOrEqual(10)
  })

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
    expect(parseFloat(await marginBottom(page, '.split-col .plotly-wrap'))).toBeGreaterThanOrEqual(
      30,
    )
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

  test('Markdown paragraphs and lists use flowGap before components', async ({ page }) => {
    await gotoSlide(page, 10)

    expect(await cssVar(page, '--ustc-component-gap')).toBe('1.25rem')
    expect(await borderBoxGap(page, 'h1 + p', '.block-title')).toBeGreaterThanOrEqual(20)
    expect(await borderBoxGap(page, 'ul', '.callout')).toBe(20)
  })
})
