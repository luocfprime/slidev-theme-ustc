import { test, expect } from '@playwright/test'

test('visual snapshots', async ({ page }) => {
  test.setTimeout(600_000)

  await page.emulateMedia({ reducedMotion: 'reduce' })

  await page.goto('/1', { waitUntil: 'networkidle' })
  await page.waitForSelector('.slidev-layout', { timeout: 30_000 })
  await page.evaluate(() => document.fonts.ready)

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
        await page.locator('.slidev-layout').first().waitFor({ state: 'attached' })
        await page.evaluate(() => document.fonts.ready)
      }

      await expect.soft(page).toHaveScreenshot(`slide-${n}.png`, {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
        caret: 'hide',
      })
    })
  }
})
