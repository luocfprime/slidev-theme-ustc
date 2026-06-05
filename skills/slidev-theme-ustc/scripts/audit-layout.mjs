#!/usr/bin/env node
// audit-layout.mjs — render-truth layout & aesthetics audit for slidev-theme-ustc decks.
//
// Why this exists: a deck is authored blind. Whether content overflows the fixed
// 980×552 canvas, whether a bullet wraps to an ugly orphan line, whether a figure
// is upscaled to mush or carries baked-in whitespace — none of that is knowable
// from the markdown. It is only knowable after the browser lays the slide out.
// This drives a real (headless) browser, measures each slide, and reports the
// render-only defects an authoring agent is otherwise blind to, with fix hints.
//
// Usage:
//   node <skill>/scripts/audit-layout.mjs [target] [flags]
//     target            a URL (http://localhost:3030) or a .md deck path.
//                       Omitted → reuse a running dev server at :3030, else exit with guidance.
//   --slide N           audit only slide N
//   --all               list every slide, not just flagged ones
//   --shot              screenshot each flagged slide to ./audit-shots/
//   --json              emit raw JSON instead of the human report
//
// Note: layout/wrapping/overflow are computed by the browser engine — Node alone
// cannot. This is the irreducible cost: a headless browser must render the slide.

import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { mkdirSync } from 'node:fs'
import { dirname, resolve, isAbsolute } from 'node:path'

// Chromium comes from whichever Playwright package the deck has. `@playwright/test`
// is present wherever `slidev export` works; fall back to playwright / playwright-core.
let chromium
for (const pkg of ['@playwright/test', 'playwright', 'playwright-core']) {
  try {
    ;({ chromium } = await import(pkg))
    break
  } catch {
    /* try next */
  }
}
if (!chromium) {
  process.stderr.write('audit-layout: needs Playwright (@playwright/test or playwright).\n')
  process.exit(2)
}

// ── arg parsing ──────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const flags = new Set(argv.filter((a) => a.startsWith('--')))
const positional = argv.filter((a) => !a.startsWith('--'))
const slideArg = (() => {
  const i = argv.indexOf('--slide')
  return i >= 0 && argv[i + 1] ? parseInt(argv[i + 1], 10) : null
})()
const wantShot = flags.has('--shot')
const wantJson = flags.has('--json')
const wantAll = flags.has('--all')
const target = positional.find((p) => p !== String(slideArg)) ?? null

// ── thresholds (tuned to the theme's "dense is fine, empty is ugly" stance) ───
const TH = {
  overflowPx: 4, // > this many px past the frame = overflow
  sparseFill: 40, // content fills < this % of usable height = egregiously empty
  // (academic slides at 55–70% are normal breathing room, NOT a defect — only
  //  flag the genuinely near-empty; raise/lower to taste)
  upscale: 1.3, // img rendered / natural width above this = blurry
  imgWhite: 15, // whitespace band on any image edge % = likely needs cropping
  imgTinyArea: 4, // img occupies < this % of the slide = postage stamp
  wideFigAr: 2.5, // figure aspect ratio (w/h) above this = a wide strip
  figVoidPct: 30, // empty space below a figure in its column, % of usable height
  orphanRatio: 0.15, // wrapped last line width / widest line below this = orphan
}

// ── resolve target: existing server URL, or spawn slidev on a deck ────────────
async function reachable(url) {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2500)
    const r = await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    return r.ok || r.status < 500
  } catch {
    return false
  }
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await reachable(url)) return true
    await sleep(700)
  }
  return false
}

async function resolveTarget() {
  // explicit URL
  if (target && /^https?:\/\//.test(target)) return { url: target, child: null }

  // explicit deck file → spawn slidev on it
  if (target && target.endsWith('.md')) return spawnSlidev(target)

  // no target → reuse a running dev server, else bail with guidance
  if (await reachable('http://localhost:3030')) {
    return { url: 'http://localhost:3030', child: null, reused: true }
  }
  process.stderr.write(
    'audit-layout: no target. Pass a deck (slides.md) or a URL (http://localhost:3030),\n' +
      'or start `slidev` so it can reuse the dev server.\n',
  )
  process.exit(2)
}

function spawnSlidev(deck) {
  const port = 13900 + Math.floor((Date.now() / 1000) % 80)
  // resolve the deck relative to where the user runs the tool; spawn in its dir so the
  // deck's theme and public/ assets resolve.
  const deckPath = isAbsolute(deck) ? deck : resolve(process.cwd(), deck)
  process.stderr.write(`· spawning slidev on ${deck} (port ${port})…\n`)
  const child = spawn('pnpm', ['exec', 'slidev', deckPath, '--port', String(port)], {
    cwd: dirname(deckPath),
    stdio: 'ignore',
  })
  return { url: `http://localhost:${port}`, child, deck }
}

// ── per-slide measurement (runs inside the page) ──────────────────────────────
// `layout` is the VISIBLE slide's .slidev-layout element, passed in from a
// Playwright `.slidev-layout:visible` locator. This matters: Slidev renders every
// slide in the DOM at once, so an in-page `querySelector('.slidev-layout')` would
// grab the first (hidden, zero-size) slide and measure garbage.
function measureInPage(layout, thresholds) {
  const TH = thresholds
  if (!layout) return { error: 'no visible .slidev-layout' }

  const lr = layout.getBoundingClientRect()
  const scale = lr.width / layout.clientWidth || 1 // Slidev applies a transform scale
  const clientH = layout.clientHeight
  const clientW = layout.clientWidth
  const un = (px) => px / scale // scaled → layout px

  const footer = layout.querySelector('.page-footer')
  const footerH = footer ? footer.offsetHeight : 0
  const isChrome = (el) => footer && (el === footer || footer.contains(el))

  const out = {
    layoutClass: layout.className.replace('slidev-layout', '').trim(),
    overflowX: Math.round(layout.scrollWidth - clientW),
    footerH,
  }

  // content extent (deepest non-chrome element) → fill / emptiness / overflow
  let maxBottom = 0
  let culprit = null
  for (const el of layout.querySelectorAll('*')) {
    if (isChrome(el)) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) continue
    const bottom = un(r.bottom - lr.top)
    if (bottom > maxBottom) {
      maxBottom = bottom
      culprit = el
    }
  }
  const availBottom = clientH - footerH
  // Overflow = content past the slide frame. Use the deepest element's true
  // layout position (immune to inner overflow:hidden clipping, which defeats
  // scrollHeight) OR scrollHeight — whichever reveals more.
  out.overflowY = Math.round(Math.max(layout.scrollHeight - clientH, maxBottom - clientH))
  out.fillPct = Math.round((maxBottom / availBottom) * 100)
  out.remaining = Math.round(availBottom - maxBottom)
  if (culprit) {
    out.deepest = {
      tag: culprit.tagName.toLowerCase(),
      text: (culprit.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48),
    }
  }

  // images: upscale, area, baked bottom whitespace.
  // Scope to FigureBlock content figures — logos, QR codes, and other chrome
  // imagery are intentionally sized and shouldn't be judged as content.
  out.images = []
  for (const img of layout.querySelectorAll('img.figure-image')) {
    if (isChrome(img)) continue
    const r = img.getBoundingClientRect()
    const renderW = un(r.width)
    const renderH = un(r.height)
    const nw = img.naturalWidth
    const nh = img.naturalHeight
    const srcRaw = img.getAttribute('src') || ''
    const isVector = /\.svg|image\/svg/i.test(srcRaw) // vectors scale losslessly
    const figBottom = un(r.bottom - lr.top)
    const rec = {
      src: srcRaw.startsWith('data:') ? '(inline)' : srcRaw.split('/').pop().slice(0, 36),
      upscale: nw && !isVector ? +(renderW / nw).toFixed(2) : null,
      areaPct: Math.round(((renderW * renderH) / (clientW * clientH)) * 100),
      ar: nw && nh ? +(nw / nh).toFixed(1) : null, // aspect ratio (high = wide strip)
      belowPct: Math.round(((availBottom - figBottom) / availBottom) * 100), // empty space below the figure
      white: null, // baked whitespace bands per edge: { t, b, l, r } as %
    }
    try {
      if (nw && nh) {
        const sw = Math.min(nw, 160)
        const sh = Math.max(1, Math.round((nh * sw) / nw))
        const c = document.createElement('canvas')
        c.width = sw
        c.height = sh
        const ctx = c.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, sw, sh)
        const d = ctx.getImageData(0, 0, sw, sh).data
        const white = (x, y) => {
          const i = (y * sw + x) * 4
          return d[i] >= 245 && d[i + 1] >= 245 && d[i + 2] >= 245 && d[i + 3] >= 200
        }
        const rowWhite = (y) => {
          for (let x = 0; x < sw; x += 3) if (!white(x, y)) return false
          return true
        }
        const colWhite = (x) => {
          for (let y = 0; y < sh; y += 3) if (!white(x, y)) return false
          return true
        }
        let t = 0,
          b = 0,
          l = 0,
          rr = 0
        for (let y = 0; y < sh && rowWhite(y); y++) t++
        for (let y = sh - 1; y >= 0 && rowWhite(y); y--) b++
        for (let x = 0; x < sw && colWhite(x); x++) l++
        for (let x = sw - 1; x >= 0 && colWhite(x); x--) rr++
        rec.white = {
          t: Math.round((t / sh) * 100),
          b: Math.round((b / sh) * 100),
          l: Math.round((l / sw) * 100),
          r: Math.round((rr / sw) * 100),
        }
      }
    } catch {
      // cross-origin image → canvas tainted → skip whitespace probe
    }
    out.images.push(rec)
  }

  // orphan wrap: a heading/bullet whose wrapped last line is a tiny stub.
  // Only on body layouts (content/split) and only headings/bullets — a flowing
  // <p> with a short final line is normal prose, not a defect; and structural
  // layouts (cover/section/end) wrap their titles by design.
  out.orphans = []
  const isBody = /\b(content|split)\b/.test(layout.className)
  for (const el of isBody ? layout.querySelectorAll('h1, h2, li') : []) {
    if (isChrome(el)) continue
    if (el.querySelector('.katex')) continue // math notation wraps by its own rules
    const range = document.createRange()
    range.selectNodeContents(el)
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1)
    if (rects.length < 2) continue
    const lines = []
    for (const r of rects) {
      const line = lines.find((L) => Math.abs(L.top - r.top) < 4)
      if (line) line.width += r.width
      else lines.push({ top: r.top, width: r.width })
    }
    if (lines.length < 2) continue
    const widths = lines.map((L) => L.width)
    const ratio = widths[widths.length - 1] / Math.max(...widths)
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ')
    if (ratio < TH.orphanRatio && text.length > 10) {
      out.orphans.push({
        tag: el.tagName.toLowerCase(),
        lines: lines.length,
        lastRatio: +ratio.toFixed(2),
        text: text.slice(0, 44),
      })
    }
  }

  return out
}

// ── classify a slide's measurement into flagged findings ──────────────────────
function classify(m) {
  const findings = []
  if (m.error) return [{ kind: 'error', msg: m.error }]

  const isBody = /\b(content|split)\b/.test(m.layoutClass || '')
  const overflowing = m.overflowY > TH.overflowPx
  if (overflowing) {
    findings.push({
      kind: 'overflow',
      msg: `OVERFLOW +${m.overflowY}px (fill ${m.fillPct}%)`,
      detail: m.deepest ? `↳ deepest <${m.deepest.tag}> "${m.deepest.text}"` : null,
      fix: 'split slide / density:compact / cut an item / limit width',
    })
  } else if (isBody && m.fillPct < TH.sparseFill) {
    // sparse only matters on body layouts — section/cover/end/toc are meant to
    // be airy; flagging their whitespace is noise.
    findings.push({
      kind: 'sparse',
      msg: `SPARSE (fill ${m.fillPct}%, ${m.remaining}px empty below)`,
      fix: 'add figure / center / merge with neighbour / <br> for rhythm',
    })
  }

  const isSplit = /\bsplit\b/.test(m.layoutClass || '')
  for (const im of m.images || []) {
    // a wide figure stuffed into a split column fills only a thin strip, leaving
    // the rest of that column empty — it should span full width instead.
    if (isSplit && im.ar != null && im.ar >= TH.wideFigAr && im.belowPct >= TH.figVoidPct) {
      findings.push({
        kind: 'image',
        msg: `WIDE FIGURE ${im.src} (AR ${im.ar}) in a split column, ${im.belowPct}% empty below`,
        fix: 'go full-width: content layout, text above, figure below at width~100%',
      })
    }
    if (im.white) {
      const labels = { t: 'top', b: 'bottom', l: 'left', r: 'right' }
      const sides = Object.keys(labels)
        .filter((k) => im.white[k] >= TH.imgWhite)
        .map((k) => `${labels[k]} ${im.white[k]}%`)
      if (sides.length) {
        findings.push({
          kind: 'image',
          msg: `IMAGE ${im.src}: whitespace band ${sides.join(', ')}`,
          fix: 'crop the source image',
        })
      }
    }
    if (im.upscale != null && im.upscale > TH.upscale) {
      findings.push({
        kind: 'image',
        msg: `IMAGE ${im.src}: upscaled ${im.upscale}× (blurry)`,
        fix: 'use a higher-resolution source',
      })
    }
    if (im.areaPct != null && im.areaPct > 0 && im.areaPct < TH.imgTinyArea) {
      findings.push({
        kind: 'image',
        msg: `IMAGE ${im.src}: only ${im.areaPct}% of the slide (too small)`,
        fix: 'enlarge, or place beside text',
      })
    }
  }

  // Orphans are noise on an already-overflowing slide (fix the overflow first).
  // Cap at 2 so a long list doesn't bury the signal.
  if (!overflowing) {
    const orphans = m.orphans || []
    for (const o of orphans.slice(0, 2)) {
      findings.push({
        kind: 'orphan',
        msg: `ORPHAN: <${o.tag}> wraps ${o.lines} lines, last line only ${Math.round(o.lastRatio * 100)}% "${o.text}"`,
        fix: 'rephrase, or adjust the column width, then re-render',
      })
    }
    if (orphans.length > 2) {
      findings.push({ kind: 'orphan', msg: `…and ${orphans.length - 2} more orphans`, fix: null })
    }
  }

  return findings
}

const ICON = { overflow: '⚠', sparse: '⚪', image: '🖼', orphan: '↵', error: '✗' }

// ── main ──────────────────────────────────────────────────────────────────────
let child = null
const browser = await chromium.launch()
try {
  const t = await resolveTarget()
  child = t.child
  const url = t.url
  if (child && !(await waitForServer(url))) throw new Error(`slidev did not come up at ${url}`)
  if (t.reused) process.stderr.write(`· reusing dev server at ${url}\n`)

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${url}/1`, { waitUntil: 'networkidle' })
  await page.locator('.slidev-layout').first().waitFor({ state: 'attached', timeout: 20000 })

  let total = null
  for (let i = 0; i < 15 && !total; i++) {
    total = await page.evaluate(() => window.__slidev__?.nav?.total ?? null)
    if (!total) await sleep(800)
  }
  if (!total) throw new Error('could not read slide total (is this a Slidev deck?)')

  const slides = slideArg ? [slideArg] : Array.from({ length: total }, (_, i) => i + 1)
  if (wantShot) mkdirSync(resolve(process.cwd(), 'audit-shots'), { recursive: true })

  const results = []
  for (const n of slides) {
    await page.goto(`${url}/${n}`, { waitUntil: 'domcontentloaded' })
    await page.locator('.slidev-layout:visible').first().waitFor({ timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    await page
      .locator('text=Loading slide...')
      .waitFor({ state: 'detached', timeout: 8000 })
      .catch(() => {})
    const m = await page.locator('.slidev-layout:visible').first().evaluate(measureInPage, TH)
    const findings = classify(m)
    results.push({ n, m, findings })
    if (wantShot && findings.length) {
      const path = resolve(process.cwd(), 'audit-shots', `slide-${n}.png`)
      await page.locator('.slidev-layout:visible').first().screenshot({ path })
    }
  }

  if (wantJson) {
    console.log(JSON.stringify({ url, total, results }, null, 2))
  } else {
    printReport(url, total, results)
  }
} finally {
  await browser.close()
  if (child) child.kill('SIGTERM')
}

function printReport(url, total, results) {
  const flagged = results.filter((r) => r.findings.length)
  console.log(`\nLayout audit — ${total} slides @ ${url}\n`)
  const shown = wantAll ? results : flagged
  for (const { n, m, findings } of shown) {
    if (!findings.length) {
      console.log(`✓ slide ${n}  fill ${m.fillPct}%  ${m.layoutClass || ''}`)
      continue
    }
    for (const f of findings) {
      console.log(`${ICON[f.kind] || '•'} slide ${n}  ${f.msg}`)
      if (f.detail) console.log(`     ${f.detail}`)
      if (f.fix) console.log(`     fix: ${f.fix}`)
    }
  }
  const okCount = results.length - flagged.length
  const scope =
    results.length === total ? `${total} slides` : `${results.length} of ${total} audited`
  console.log(`\n${okCount}/${results.length} clean · ${flagged.length} flagged  (${scope})`)
  if (wantShot && flagged.length) console.log(`screenshots → audit-shots/`)
}
