export const DEFAULT_THRESHOLDS = {
  overflowPx: 4, // > this many px past the frame = overflow
  sparseFill: 40, // content fills < this % of usable height = egregiously empty
  // (academic slides at 55-70% are normal breathing room, NOT a defect - only
  //  flag the genuinely near-empty; raise/lower to taste)
  upscale: 1.3, // img rendered / natural width above this = blurry
  imgWhite: 15, // whitespace band on any image edge % = likely needs cropping
  imgTinyArea: 4, // img occupies < this % of the slide = postage stamp
  wideFigAr: 2.5, // figure aspect ratio (w/h) above this = a wide strip
  figVoidPct: 30, // empty space below a figure in its column, % of usable height
  orphanRatio: 0.15, // wrapped last line width / widest line below this = orphan-like
  wrapReviewCount: 3, // repeated short wrapped tails are worth review
  manyWraps: 5, // many multi-line headings/list items suggest cramped columns
  largeEmptyPct: 36, // largest continuous empty body region as % of usable body
  emptySparseFill: 65, // only review large empty regions when the slide is not well filled
  splitHighFill: 78, // one split column is meaningfully occupied
  splitLowFill: 40, // the other split column is meaningfully sparse
  splitFillDiff: 36, // column fill percentage gap that merits review
}

export const ICON = {
  overflow: '⚠',
  sparse: '⚪',
  empty: '◇',
  split: '⇔',
  image: '🖼',
  wrap: '↵',
  error: '✗',
}

export function classifyMeasurement(m, thresholds = DEFAULT_THRESHOLDS) {
  const findings = []
  if (m.error) return [{ kind: 'error', msg: m.error }]

  const TH = thresholds
  const isBody = /\b(content|split)\b/.test(m.layoutClass || '')
  const isSplit = /\bsplit\b/.test(m.layoutClass || '')
  const overflowing = m.overflowY > TH.overflowPx

  if (overflowing) {
    findings.push({
      kind: 'overflow',
      msg: `OVERFLOW +${m.overflowY}px (fill ${m.fillPct}%)`,
      detail: m.deepest ? `↳ deepest <${m.deepest.tag}> "${m.deepest.text}"` : null,
      fix: 'split slide / density:compact / cut an item / limit width',
    })
  } else if (isBody && m.fillPct < TH.sparseFill) {
    findings.push({
      kind: 'sparse',
      msg: `SPARSE (fill ${m.fillPct}%, ${m.remaining}px empty below)`,
      fix: 'add figure / center / merge with neighbour / <br> for rhythm',
    })
  }

  if (isSplit && !overflowing) {
    const cols = (m.columns || []).filter((c) => Number.isFinite(c.fillPct))
    if (cols.length >= 2) {
      const fills = cols.map((c) => c.fillPct)
      const high = Math.max(...fills)
      const low = Math.min(...fills)
      if (high >= TH.splitHighFill && low <= TH.splitLowFill && high - low >= TH.splitFillDiff) {
        findings.push({
          kind: 'split',
          msg: `SPLIT IMBALANCE (columns ${fills.map((v) => `${v}%`).join(' / ')})`,
          fix: 'move one visual/text block across columns, rebalance ratio, or use content layout',
        })
      }
    }
  }

  if (
    isBody &&
    !overflowing &&
    m.empty?.largestPct >= TH.largeEmptyPct &&
    m.fillPct < TH.emptySparseFill
  ) {
    findings.push({
      kind: 'empty',
      msg: `LARGE EMPTY REGION (${m.empty.largestPct}% of body, ${m.empty.location})`,
      fix: 'review composition: enlarge the main visual, rebalance columns, or center sparse content',
    })
  }

  for (const im of m.images || []) {
    if (
      isSplit &&
      im.ar != null &&
      im.ar >= TH.wideFigAr &&
      im.belowPct >= TH.figVoidPct &&
      m.fillPct < TH.emptySparseFill
    ) {
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

  if (!overflowing) {
    const wraps = m.wraps || {}
    const shortWraps = wraps.shortWraps || m.orphans || []
    if (shortWraps.length >= TH.wrapReviewCount) {
      const examples = shortWraps
        .slice(0, 2)
        .map(
          (w) => `<${w.tag}> ${w.lines} lines, tail ${Math.round(w.lastRatio * 100)}% "${w.text}"`,
        )
        .join('; ')
      findings.push({
        kind: 'wrap',
        msg: `WRAP REVIEW: ${shortWraps.length} short tail lines (${examples})`,
        fix: 'rephrase short-tail bullets, widen the column, or split the list',
      })
    } else if ((wraps.wrappedBlocks || 0) >= TH.manyWraps) {
      findings.push({
        kind: 'wrap',
        msg: `WRAP REVIEW: ${wraps.wrappedBlocks} headings/list items wrap across lines`,
        fix: 'check text density; repeated wraps often mean a column is too narrow',
      })
    }
  }

  return findings
}
