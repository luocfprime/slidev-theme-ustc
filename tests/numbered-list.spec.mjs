import { test, expect } from '@playwright/test'

test.setTimeout(60_000)

// Fixture deck layout (numbered-list.md, port 13039)
//
//  1  cover
//  2  content  default numbered list with bounded dividers
//  3  content  start/color/divider prop controls

async function gotoSlide(page, n) {
  await page.goto('/1', { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 30_000 })
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 30_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()

test.describe('NumberedList', () => {
  test('renders numbered modules with titles, body text, and bounded dividers', async ({
    page,
  }) => {
    await gotoSlide(page, 2)

    const list = slide(page).locator('.numbered-list')
    await expect(list).toHaveCount(1)
    await expect(list.locator('.numbered-list-item')).toHaveCount(3)
    await expect(list.locator('.numbered-list-marker')).toHaveText(['1', '2', '3'])
    await expect(list.locator('.numbered-list-title')).toHaveText([
      'Collect data',
      'Run analysis',
      'Write summary',
    ])
    await expect(list.locator('.numbered-list-body')).toHaveText([
      'gather sources and normalize fields',
      'apply the shared scoring protocol',
      'report findings and remaining caveats',
    ])

    const dividerWidths = await list.evaluate((root) =>
      [...root.querySelectorAll('.numbered-list-content')].map((el) => ({
        width: getComputedStyle(el).borderBottomWidth,
        style: getComputedStyle(el).borderBottomStyle,
      })),
    )

    expect(dividerWidths).toEqual([
      { width: '1px', style: 'solid' },
      { width: '1px', style: 'solid' },
      { width: '0px', style: 'none' },
    ])

    const leftOffset = await list.evaluate((root) => {
      const listRect = root.getBoundingClientRect()
      const markerRect = root.querySelector('.numbered-list-marker').getBoundingClientRect()
      return markerRect.left - listRect.left
    })
    expect(leftOffset).toBeLessThanOrEqual(1)
  })

  test('start, color, and divider props control numbering and presentation', async ({ page }) => {
    await gotoSlide(page, 3)

    const list = slide(page).locator('.numbered-list')
    await expect(list.locator('.numbered-list-marker')).toHaveText(['4', '5'])
    await expect(list.locator('.numbered-list-title').first().locator('strong')).toHaveText(
      'Observation',
    )
    await expect(list.locator('.numbered-list-title').first().locator('.katex')).toHaveCount(1)
    await expect(list.locator('.numbered-list-body').first().locator('strong')).toHaveText('images')
    await expect(list.locator('.numbered-list-body').first().locator('.katex')).toHaveCount(1)

    const marker = list.locator('.numbered-list-marker').first()
    const title = list.locator('.numbered-list-title').first()
    await expect(marker).toHaveCSS('background-color', 'rgb(6, 95, 70)')
    await expect(title).toHaveCSS('color', 'rgb(6, 95, 70)')

    const markerCenterDelta = await marker.evaluate((el) => {
      const markerRect = el.getBoundingClientRect()
      const textRect = el.querySelector('.numbered-list-marker-text').getBoundingClientRect()
      return {
        x: Math.abs(markerRect.left + markerRect.width / 2 - (textRect.left + textRect.width / 2)),
        y: Math.abs(markerRect.top + markerRect.height / 2 - (textRect.top + textRect.height / 2)),
      }
    })
    expect(markerCenterDelta.x).toBeLessThanOrEqual(1)
    expect(markerCenterDelta.y).toBeLessThanOrEqual(1)

    const borderWidths = await list.evaluate((root) =>
      [...root.querySelectorAll('.numbered-list-content')].map(
        (el) => getComputedStyle(el).borderBottomWidth,
      ),
    )
    expect(borderWidths).toEqual(['0px', '0px'])
  })
})
