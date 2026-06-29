import { test, expect } from '@playwright/test'

test.setTimeout(60_000)

// Fixture deck layout (density.md, port 13037)
//
//  1  cover
//  2  content  density: normal   — baseline body font-size
//  3  content  density: compact  — middle tier, .compact class on layout root
//  4  content  density: dense    — tightest, .dense class on layout root
//  5  content  Box/ResultBox custom bg and borderColor props
//  6  content  top-level component flow spacing
//  7  content  inline Badge visual alignment against CJK body text
//  8  content  component typography alignment and Callout switches
//
// Verifies the three-tier density scale: the `.compact` class is applied and
// its body font-size sits strictly between normal and dense (monotonic
// normal > compact > dense). This exercises the token-swap wiring for all
// three tiers, not a hardcoded pixel value.

async function gotoSlide(page, n) {
  await page.goto('/1', { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout').first().waitFor({ state: 'attached', timeout: 30_000 })
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 30_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()

const bodyFontPx = async (page) => {
  const px = await slide(page)
    .locator('p')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  return px
}

const badgeFontPx = async (page) => {
  const px = await slide(page)
    .locator('.ustc-badge')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  return px
}

test.describe('density — three-tier scale', () => {
  test('compact applies .compact class and sits between normal and dense', async ({ page }) => {
    await gotoSlide(page, 2)
    await expect(slide(page)).not.toHaveClass(/\bcompact\b/)
    await expect(slide(page)).not.toHaveClass(/\bdense\b/)
    const normalPx = await bodyFontPx(page)
    const normalBadgePx = await badgeFontPx(page)

    await gotoSlide(page, 3)
    await expect(slide(page)).toHaveClass(/\bcompact\b/)
    const compactPx = await bodyFontPx(page)
    const compactBadgePx = await badgeFontPx(page)

    await gotoSlide(page, 4)
    await expect(slide(page)).toHaveClass(/\bdense\b/)
    const densePx = await bodyFontPx(page)
    const denseBadgePx = await badgeFontPx(page)

    // Monotonic decrease, with compact strictly in the middle.
    expect(normalPx).toBeGreaterThan(compactPx)
    expect(compactPx).toBeGreaterThan(densePx)
    expect(normalBadgePx).toBeGreaterThan(compactBadgePx)
    expect(compactBadgePx).toBeGreaterThan(denseBadgePx)
  })
})

test.describe('Box and ResultBox — styling props', () => {
  test('Box accepts bg and borderColor props', async ({ page }) => {
    await gotoSlide(page, 5)

    const box = slide(page).locator('.box').first()
    await expect(box).toHaveCSS('background-color', 'rgb(238, 245, 255)')
    await expect(box).toHaveCSS('border-color', 'rgb(147, 51, 234)')
  })

  test('ResultBox accepts bg and borderColor props', async ({ page }) => {
    await gotoSlide(page, 5)

    const custom = slide(page).locator('.result-box').first()
    await expect(custom).toHaveCSS('background-color', 'rgb(236, 253, 245)')
    await expect(custom).toHaveCSS('border-color', 'rgb(22, 163, 74)')

    const tokenResolved = slide(page).locator('.result-box').nth(1)
    await expect(tokenResolved).toHaveCSS('background-color', 'rgb(245, 245, 245)')
    await expect(tokenResolved).toHaveCSS('border-color', 'rgb(217, 119, 6)')
  })
})

test.describe('Callout — visual switches and typography', () => {
  test('Callout defaults to icon-on rail style, with optional fill and icon toggle', async ({
    page,
  }) => {
    await gotoSlide(page, 8)

    const callouts = slide(page).locator('.callout')
    const defaultCallout = callouts.nth(0)
    const noIconCallout = callouts.nth(1)
    const filledCallout = callouts.nth(2)

    await expect(defaultCallout).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await expect(defaultCallout.locator('.callout-icon')).toHaveCount(1)
    await expect(noIconCallout.locator('.callout-icon')).toHaveCount(0)
    await expect(filledCallout.locator('.callout-icon')).toHaveCount(1)
    await expect(filledCallout).toHaveCSS('background-color', 'rgba(217, 119, 6, 0.07)')
  })

  test('ResultBox and Callout typography follows Block typography', async ({ page }) => {
    await gotoSlide(page, 8)

    const sizes = await slide(page).evaluate((root) => {
      const fontSize = (selector) => {
        const el = root.querySelector(selector)
        if (!el) throw new Error(`Missing typography selector: ${selector}`)
        return getComputedStyle(el).fontSize
      }

      return {
        blockTitle: fontSize('.block-title'),
        blockBody: fontSize('.block-body p'),
        resultTitle: fontSize('.result-box-title'),
        resultBody: fontSize('.result-box-body p'),
        calloutTitle: fontSize('.callout-title'),
        calloutBody: fontSize('.callout-body p'),
      }
    })

    expect(sizes.resultTitle).toBe(sizes.blockTitle)
    expect(sizes.resultBody).toBe(sizes.blockBody)
    expect(sizes.calloutTitle).toBe(sizes.blockTitle)
    expect(sizes.calloutBody).toBe(sizes.blockBody)
  })
})

test.describe('component flow spacing', () => {
  const gapBetween = async (page, beforeSelector, afterSelector) => {
    return await slide(page)
      .locator(afterSelector)
      .first()
      .evaluate((after, beforeSelector) => {
        const root = after.closest('.slidev-layout')
        const before = root?.querySelector(beforeSelector)
        if (!before) throw new Error(`Missing spacing fixture selector: ${beforeSelector}`)
        return after.getBoundingClientRect().top - before.getBoundingClientRect().bottom
      }, beforeSelector)
  }

  test('top-level components have breathing room after raw divs and media helpers', async ({
    page,
  }) => {
    await gotoSlide(page, 6)

    expect(await gapBetween(page, '.fixture-raw-grid', 'table')).toBeGreaterThanOrEqual(10)
    expect(await gapBetween(page, 'table', '.takeaway')).toBeGreaterThanOrEqual(10)
    expect(await gapBetween(page, '.grid', '.callout')).toBeGreaterThanOrEqual(10)
    expect(await gapBetween(page, '.figure-block', '.result-box')).toBeGreaterThanOrEqual(10)
  })
})

test.describe('Badge inline alignment', () => {
  test('Badge pills sit on the same visual line as surrounding body text', async ({ page }) => {
    await gotoSlide(page, 7)

    const metrics = await slide(page)
      .locator('p')
      .filter({ hasText: '行内对齐' })
      .first()
      .evaluate((line) => {
        const bodyFontSize = parseFloat(getComputedStyle(line).fontSize)
        const textNode = [...line.childNodes].find(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('行内对齐'),
        )
        if (!textNode) throw new Error('Missing Badge alignment text node')

        const range = document.createRange()
        range.setStart(textNode, 0)
        range.setEnd(textNode, textNode.textContent.length)
        const textRect = range.getBoundingClientRect()
        const textCenter = (textRect.top + textRect.bottom) / 2

        const badges = [...line.querySelectorAll('.ustc-badge')].map((badge) => {
          const rect = badge.getBoundingClientRect()
          return {
            centerDelta: (rect.top + rect.bottom) / 2 - textCenter,
            height: rect.height,
          }
        })

        return { bodyFontSize, badges }
      })

    expect(metrics.badges.length).toBe(2)
    for (const badge of metrics.badges) {
      expect(Math.abs(badge.centerDelta)).toBeLessThanOrEqual(1.5)
      expect(badge.height).toBeLessThanOrEqual(metrics.bodyFontSize * 1.06)
    }
  })

  test('icon and text-only Badge pills align to each other in the same row', async ({ page }) => {
    await gotoSlide(page, 7)

    const row = await slide(page)
      .locator('p')
      .filter({ hasText: '混合对齐' })
      .first()
      .evaluate((line) => {
        const rects = [...line.querySelectorAll('.ustc-badge')].map((badge) => {
          const rect = badge.getBoundingClientRect()
          return { top: rect.top, bottom: rect.bottom }
        })
        return {
          topSpread: Math.max(...rects.map((r) => r.top)) - Math.min(...rects.map((r) => r.top)),
          bottomSpread:
            Math.max(...rects.map((r) => r.bottom)) - Math.min(...rects.map((r) => r.bottom)),
        }
      })

    expect(row.topSpread).toBeLessThanOrEqual(1)
    expect(row.bottomSpread).toBeLessThanOrEqual(1)
  })

  test('Badge size matches surrounding raw div body text', async ({ page }) => {
    await gotoSlide(page, 7)

    const metrics = await slide(page)
      .locator('.badge-list-fixture > div')
      .first()
      .evaluate((line) => {
        const lineFontSize = parseFloat(getComputedStyle(line).fontSize)
        const badges = [...line.querySelectorAll('.ustc-badge')].map((badge) =>
          parseFloat(getComputedStyle(badge).fontSize),
        )
        return { lineFontSize, badges }
      })

    expect(metrics.lineFontSize).toBeGreaterThan(20)
    for (const badgeFontSize of metrics.badges) {
      expect(badgeFontSize).toBeCloseTo(metrics.lineFontSize * 0.68, 1)
    }
  })
})
