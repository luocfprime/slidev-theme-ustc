import { test, expect } from '@playwright/test'

test.setTimeout(60_000)

// Fixture deck layout (note.md, port 13040)
//
//  1  cover
//  2  content  default stacked notes with markdown body
//  3  split    notes in both columns with color/divider controls

async function gotoSlide(page, n) {
  await page.goto('/1', { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 30_000 })
  await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 30_000 })
}

const slide = (page) => page.locator('.slidev-layout:visible').first()

test.describe('Note', () => {
  test('renders lightweight title-body pairs with bounded dividers', async ({ page }) => {
    await gotoSlide(page, 2)

    const notes = slide(page).locator('.note')
    await expect(notes).toHaveCount(2)
    await expect(notes.first().locator('.note-title strong')).toHaveText('Input')
    await expect(notes.first().locator('.note-title .katex')).toHaveCount(1)
    await expect(notes.nth(1).locator('.note-title')).toHaveText('Output')
    await expect(notes.first().locator('.note-body strong')).toHaveText('evaluation metric')
    await expect(notes.nth(1).locator('.note-body .katex')).toHaveCount(1)

    const presentation = await notes.evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el)
        return {
          background: style.backgroundColor,
          borderLeftWidth: style.borderLeftWidth,
          borderTopWidth: style.borderTopWidth,
          borderRightWidth: style.borderRightWidth,
        }
      }),
    )
    expect(presentation).toEqual([
      {
        background: 'rgba(0, 0, 0, 0)',
        borderLeftWidth: '0px',
        borderTopWidth: '0px',
        borderRightWidth: '0px',
      },
      {
        background: 'rgba(0, 0, 0, 0)',
        borderLeftWidth: '0px',
        borderTopWidth: '0px',
        borderRightWidth: '0px',
      },
    ])

    const dividerWidths = await notes
      .locator('.note-title')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).borderBottomWidth))
    expect(dividerWidths).toEqual(['2px', '2px'])

    const fontSizes = await slide(page).evaluate((root) => {
      const noteTitle = root.querySelector('.note-title')
      const noteBody = root.querySelector('.note-body p')
      const regularParagraph = document.createElement('p')
      regularParagraph.textContent = 'probe'
      regularParagraph.style.visibility = 'hidden'
      root.appendChild(regularParagraph)
      const paragraph = getComputedStyle(regularParagraph).fontSize
      regularParagraph.remove()
      return {
        title: getComputedStyle(noteTitle).fontSize,
        body: getComputedStyle(noteBody).fontSize,
        paragraph,
      }
    })
    expect(fontSizes.title).toBe(fontSizes.paragraph)
    expect(fontSizes.body).toBe(fontSizes.paragraph)

    const rhythm = await notes.evaluateAll(([first, second]) => {
      const firstRect = first.getBoundingClientRect()
      const secondRect = second.getBoundingClientRect()
      const title = first.querySelector('.note-title')
      const body = first.querySelector('.note-body p')
      return {
        stackGap: Math.round(secondRect.top - firstRect.bottom),
        titleBodyGap: Math.round(
          body.getBoundingClientRect().top - title.getBoundingClientRect().bottom,
        ),
        titleWeight: getComputedStyle(title).fontWeight,
        bodyLineHeight: getComputedStyle(body).lineHeight,
      }
    })
    expect(rhythm.stackGap).toBeGreaterThanOrEqual(15)
    expect(rhythm.titleBodyGap).toBeLessThanOrEqual(6)
    expect(rhythm.titleWeight).toBe('800')
    expect(Number.parseFloat(rhythm.bodyLineHeight)).toBeGreaterThan(30)
  })

  test('color and divider props control note presentation in split columns', async ({ page }) => {
    await gotoSlide(page, 3)

    const notes = slide(page).locator('.note')
    await expect(notes).toHaveCount(2)
    await expect(notes.locator('.note-title')).toHaveText(['Context', 'No divider'])
    await expect(notes.first().locator('.note-title')).toHaveCSS('color', 'rgb(6, 95, 70)')
    await expect(notes.nth(1).locator('.note-title')).toHaveCSS('color', 'rgb(146, 64, 14)')

    const dividerWidths = await notes
      .locator('.note-title')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).borderBottomWidth))
    expect(dividerWidths).toEqual(['2px', '0px'])

    const columnIndexes = await notes.evaluateAll((els) =>
      els.map((el) => {
        const col = el.closest('.split-col')
        return [...col.parentElement.children].indexOf(col)
      }),
    )
    expect(columnIndexes).toEqual([0, 1])
  })
})
