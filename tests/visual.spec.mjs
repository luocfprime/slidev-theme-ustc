import { test, expect } from '@playwright/test'

test('visual snapshots', async ({ page }) => {
  test.setTimeout(600_000)

  await page.emulateMedia({ reducedMotion: 'reduce' })

  const waitForRenderedSlide = async () => {
    await page.locator('.slidev-layout:visible').first().waitFor({
      state: 'visible',
      timeout: 60_000,
    })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => !document.body.innerText.includes('Loading slide...'), {
      timeout: 60_000,
    })
  }

  await page.goto('/1', { waitUntil: 'domcontentloaded' })
  await waitForRenderedSlide()

  let total = null
  for (let attempt = 0; attempt < 15 && !total; attempt++) {
    total = await page.evaluate(() => window.__slidev__?.nav?.total ?? null)
    if (!total) await page.waitForTimeout(1000)
  }
  if (!total)
    throw new Error('Could not read window.__slidev__.nav.total — is the Slidev server running?')

  for (let n = 1; n <= total; n++) {
    await test.step(`slide ${n}`, async () => {
      if (n > 1) {
        await page.goto(`/${n}`, { waitUntil: 'domcontentloaded' })
        await waitForRenderedSlide()
      }

      // Wait for lazy-loaded components (e.g. PlotlyGraph) to finish mounting.
      // Slidev shows a "Loading slide..." spinner while async components resolve.
      await waitForRenderedSlide()

      await expect.soft(page).toHaveScreenshot(`slide-${n}.png`, {
        maxDiffPixelRatio: 0.04,
        animations: 'disabled',
        caret: 'hide',
      })
    })
  }
})
