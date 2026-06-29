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
import { DEFAULT_THRESHOLDS as TH, ICON, classifyMeasurement } from './audit-layout-heuristics.mjs'

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

  const isBody = /\b(content|split)\b/.test(layout.className)
  const visibleBox = (el) => {
    if (isChrome(el)) return null
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return null
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return null
    return {
      left: un(r.left - lr.left),
      top: un(r.top - lr.top),
      right: un(r.right - lr.left),
      bottom: un(r.bottom - lr.top),
      width: un(r.width),
      height: un(r.height),
    }
  }

  const splitCols = [...layout.querySelectorAll('.split-col')]
  out.columns = splitCols.map((col, index) => {
    const box = visibleBox(col)
    if (!box) return { index, name: index === 0 ? 'left' : 'right', fillPct: 0, remaining: 0 }
    let colBottom = box.top
    for (const el of col.querySelectorAll('*')) {
      const b = visibleBox(el)
      if (!b) continue
      colBottom = Math.max(colBottom, b.bottom)
    }
    const usable = Math.max(1, availBottom - box.top)
    return {
      index,
      name: index === 0 ? 'left' : 'right',
      fillPct: Math.max(0, Math.round(((colBottom - box.top) / usable) * 100)),
      remaining: Math.round(availBottom - colBottom),
      width: Math.round(box.width),
    }
  })

  function textLines(el) {
    if (isChrome(el)) return null
    if (el.querySelector('.katex')) return null // math notation wraps by its own rules
    const range = document.createRange()
    range.selectNodeContents(el)
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1)
    if (rects.length < 2) return null
    const lines = []
    for (const r of rects) {
      const line = lines.find((L) => Math.abs(L.top - r.top) < 4)
      if (line) line.width = Math.max(line.width, r.width)
      else lines.push({ top: r.top, width: r.width })
    }
    if (lines.length < 2) return null
    const widths = lines.map((L) => L.width)
    const ratio = widths[widths.length - 1] / Math.max(...widths)
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ')
    return { lines: lines.length, ratio, text }
  }

  // Wrap quality: measure real rendered line boxes, but only for text blocks
  // where a short tail harms scanability. Structured NumberedList items are
  // measured as title/body, not as the whole root <li>; captions are tracked
  // separately because a two-line figure caption is usually fine.
  out.wraps = { wrappedBlocks: 0, shortWraps: [], captionWraps: [] }
  out.orphans = out.wraps.shortWraps // backward-compatible JSON alias
  if (isBody) {
    const candidates = layout.querySelectorAll(
      [
        'h1',
        'h2',
        'h3',
        'p:not(.figure-caption p):not(.table-block-caption p)',
        'li:not(.numbered-list-item)',
        '.numbered-list-title',
        '.numbered-list-body',
        '.block-title',
        '.callout-title',
        '.result-box-title',
      ].join(', '),
    )
    for (const el of candidates) {
      if (el.closest('.figure-caption, .table-block-caption')) continue
      if (el.matches('li') && el.querySelector('.numbered-list-title, .numbered-list-body'))
        continue
      const rec = textLines(el)
      if (!rec || rec.text.length <= 10) continue
      out.wraps.wrappedBlocks++
      const isCjk = /[\u3400-\u9fff]/.test(rec.text)
      const cutoff = isCjk ? Math.min(TH.orphanRatio, 0.12) : TH.orphanRatio
      if (rec.ratio < cutoff && rec.text.length > 14) {
        out.wraps.shortWraps.push({
          tag: el.tagName.toLowerCase(),
          lines: rec.lines,
          lastRatio: +rec.ratio.toFixed(2),
          text: rec.text.slice(0, 44),
        })
      }
    }
    for (const el of layout.querySelectorAll('.figure-caption, .table-block-caption')) {
      const rec = textLines(el)
      if (rec) out.wraps.captionWraps.push({ lines: rec.lines, text: rec.text.slice(0, 44) })
    }
  }

  // Approximate the largest continuous empty body region. This is intentionally
  // coarse: it is a composition signal, not a pixel-perfect packing score.
  out.empty = null
  if (isBody) {
    const header = layout.querySelector('.split-header')
    const h1 = layout.querySelector('h1')
    const bodyTop = Math.max(
      0,
      Math.round(header ? visibleBox(header)?.bottom || 0 : h1 ? visibleBox(h1)?.bottom || 0 : 0),
    )
    const body = { left: 0, top: bodyTop, right: clientW, bottom: availBottom }
    body.width = body.right - body.left
    body.height = Math.max(1, body.bottom - body.top)
    const cols = 32
    const rows = 18
    const grid = Array.from({ length: rows }, () => Array(cols).fill(false))
    const meaningfulSelector = [
      'h1',
      'h2',
      'h3',
      'p',
      'li',
      'img',
      'video',
      'table',
      'pre',
      'blockquote',
      'iframe',
      'svg',
      'canvas',
      'object',
      'embed',
      '.block',
      '.note',
      '.callout',
      '.result-box',
      '.takeaway',
      '.figure-block',
      '.video-block',
      '.table-block',
      '.plotly-graph',
      '.ustc-qrcode-wrap',
      '.lineage-frame',
    ].join(', ')
    const mark = (box) => {
      const left = Math.max(body.left, box.left)
      const right = Math.min(body.right, box.right)
      const top = Math.max(body.top, box.top)
      const bottom = Math.min(body.bottom, box.bottom)
      if (right - left < 3 || bottom - top < 3) return
      const x1 = Math.max(0, Math.floor(((left - body.left) / body.width) * cols))
      const x2 = Math.min(cols - 1, Math.floor(((right - body.left) / body.width) * cols))
      const y1 = Math.max(0, Math.floor(((top - body.top) / body.height) * rows))
      const y2 = Math.min(rows - 1, Math.floor(((bottom - body.top) / body.height) * rows))
      for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) grid[y][x] = true
    }
    for (const el of layout.querySelectorAll(meaningfulSelector)) {
      if (el.closest('.page-footer, .footnotes')) continue
      const b = visibleBox(el)
      if (b) mark(b)
    }
    const seen = Array.from({ length: rows }, () => Array(cols).fill(false))
    let best = null
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] || seen[y][x]) continue
        const q = [[x, y]]
        seen[y][x] = true
        let cells = 0
        let minX = x
        let maxX = x
        let minY = y
        let maxY = y
        for (let i = 0; i < q.length; i++) {
          const [cx, cy] = q[i]
          cells++
          minX = Math.min(minX, cx)
          maxX = Math.max(maxX, cx)
          minY = Math.min(minY, cy)
          maxY = Math.max(maxY, cy)
          for (const [nx, ny] of [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1],
          ]) {
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || seen[ny][nx] || grid[ny][nx]) {
              continue
            }
            seen[ny][nx] = true
            q.push([nx, ny])
          }
        }
        if (!best || cells > best.cells) best = { cells, minX, maxX, minY, maxY }
      }
    }
    if (best) {
      const cx = (best.minX + best.maxX + 1) / 2 / cols
      const cy = (best.minY + best.maxY + 1) / 2 / rows
      const horiz = cx < 0.37 ? 'left' : cx > 0.63 ? 'right' : 'center'
      const vert = cy < 0.37 ? 'top' : cy > 0.63 ? 'bottom' : 'middle'
      out.empty = {
        largestPct: Math.round((best.cells / (cols * rows)) * 100),
        location: `${vert}-${horiz}`,
        grid: `${best.maxX - best.minX + 1}x${best.maxY - best.minY + 1}`,
      }
    }
  }

  return out
}

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
    const findings = classifyMeasurement(m, TH)
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
  const observed = results.filter((r) => r.findings.length)
  console.log(`\nLayout measurements — ${total} slides @ ${url}\n`)
  const shown = wantAll ? results : observed
  for (const { n, m, findings } of shown) {
    const summary = slideSummary(m)
    console.log(`slide ${n}  ${summary}`)
    for (const f of findings) {
      console.log(`  ${ICON[f.kind] || '•'} ${f.msg}`)
      if (f.detail) console.log(`     ${f.detail}`)
      if (f.fix) console.log(`     fix: ${f.fix}`)
    }
  }
  const scope =
    results.length === total ? `${total} slides` : `${results.length} of ${total} audited`
  console.log(`\n${observed.length} slides with observations  (${scope})`)
  if (wantShot && observed.length) console.log(`screenshots → audit-shots/`)
}

function slideSummary(m) {
  const parts = [`fill ${m.fillPct}%`]
  if (m.columns?.length) parts.push(`cols ${m.columns.map((c) => c.fillPct).join('/')}%`)
  if (m.empty) parts.push(`empty ${m.empty.largestPct}% ${m.empty.location}`)
  if (m.wraps?.shortWraps?.length) parts.push(`short-wraps ${m.wraps.shortWraps.length}`)
  if (m.layoutClass) parts.push(m.layoutClass)
  return parts.join('  ')
}
