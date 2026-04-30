// Auto-numbering for <FigureBlock> / <TableBlock> at compile time.
//
// Single source of truth: this pure function takes a slide's markdown source
// plus running counters, and returns the same markdown with `:number="N"`
// injected onto every recognized tag, plus the advanced counters.
//
// Why "compile time" and not "runtime DOM order":
//   - Numbers are a structural property of the document (source order).
//   - v-if / v-show should hide rendering but NOT free a number, otherwise
//     numbering shifts whenever a slide's reactive state changes.
//   - dev / build / export all run this same function — no fallback paths.
//
// Recognition rules
//   - Tags: <FigureBlock> / <figure-block> / <TableBlock> / <table-block>,
//     PascalCase or kebab-case. The name must be followed by whitespace,
//     `/`, or `>` — `<FigureBlocks>` (extra char) is NOT recognized.
//   - Tags inside HTML comments (`<!-- ... -->`, multi-line OK), fenced code
//     (``` or ~~~), and inline code spans (`...`) are SKIPPED.
//   - Self-closing, paired, single-line, and multi-line tag forms all work.
//
// Override / opt-out semantics
//   - `:numbered="false"` (or `numbered="false"`): no injection, no counter
//     increment. Use for cover banners, decorative figures.
//   - `:number="N"` already specified (literal int): no injection; counter
//     advances to `max(counter, N+1)` so subsequent auto-numbers don't collide.
//   - `:number="<non-literal-expression>"`: no injection; counter unchanged
//     (user is fully managing the number, we don't know what it resolves to).
//   - Bare tag: inject ` :number="<counter>"` and increment.
//
// Out of scope (documented false-positives)
//   - `<component :is="'FigureBlock'" />` (dynamic component) is NOT recognized.
//   - Tag-like substrings inside an attribute string value preceded by
//     whitespace (e.g. `title='see number="3"'`) MAY be false-matched by the
//     attribute regex. Vanishingly rare in real decks.

export interface NumberCounters {
  figure: number
  table: number
}

export interface InjectionOptions {
  /**
   * Optional per-kind label prefixes. When set, the injected attribute becomes
   * a string-typed Vue expression (e.g. `:number="'A.1'"`) instead of the
   * default numeric form (`:number="1"`). Used by the appendix-numbering pass
   * in `setup/transformers.ts` to produce labels like "A.1", "A.2".
   * The internal counter still increments as integers; the prefix is purely a
   * display formatter.
   */
  prefixes?: { figure?: string; table?: string }
}

export interface InjectionResult {
  out: string
  counters: NumberCounters
}

type TagKind = 'figure' | 'table'

interface TagDef {
  kind: TagKind
  pascal: string
  kebab: string
}

const TAG_DEFS: TagDef[] = [
  { kind: 'figure', pascal: 'FigureBlock', kebab: 'figure-block' },
  { kind: 'table', pascal: 'TableBlock', kebab: 'table-block' },
]

// ─── Skip-region detection ────────────────────────────────────────────────

export type Range = [number, number]

function findFencedCodeRanges(src: string): Range[] {
  // Fences (``` or ~~~) must be at line start (with up to 3 leading spaces
  // per CommonMark). The closing fence has the same character and length >=
  // the opening fence's length. Unclosed fences extend to EOF.
  const ranges: Range[] = []
  let i = 0
  let inFence = false
  let fenceStart = 0
  let fenceChar = ''
  let fenceLen = 0
  while (i < src.length) {
    const lineStart = i
    let lineEnd = src.indexOf('\n', i)
    if (lineEnd === -1) lineEnd = src.length
    const line = src.slice(lineStart, lineEnd)
    const m = /^[ \t]{0,3}(`{3,}|~{3,})/.exec(line)
    if (!inFence) {
      if (m) {
        inFence = true
        fenceStart = lineStart
        fenceChar = m[1][0]
        fenceLen = m[1].length
      }
    }
    else if (m && m[1][0] === fenceChar && m[1].length >= fenceLen) {
      // closing fence; the line itself is part of the skip region
      ranges.push([fenceStart, lineEnd])
      inFence = false
    }
    i = lineEnd + 1
  }
  if (inFence) ranges.push([fenceStart, src.length])
  return ranges
}

function findHtmlCommentRanges(src: string): Range[] {
  const ranges: Range[] = []
  // Multi-line OK because [\s\S] matches newlines.
  const re = /<!--[\s\S]*?-->/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    ranges.push([m.index, m.index + m[0].length])
  }
  return ranges
}

function findInlineCodeRanges(src: string, masked: Range[]): Range[] {
  // Single-backtick spans, no embedded newline or backtick. Avoid matching
  // inside already-masked regions (notably fenced code that itself starts
  // with backticks at line start).
  const ranges: Range[] = []
  const re = /`[^`\n]+`/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    if (!isInsideAnyRange(m.index, masked)) {
      ranges.push([m.index, m.index + m[0].length])
    }
  }
  return ranges
}

function isInsideAnyRange(pos: number, ranges: Range[]): boolean {
  for (const [s, e] of ranges) {
    if (pos >= s && pos < e) return true
  }
  return false
}

function mergeRanges(ranges: Range[]): Range[] {
  if (ranges.length === 0) return ranges
  const sorted = [...ranges].sort((a, b) => a[0] - b[0])
  const merged: Range[] = [[sorted[0][0], sorted[0][1]]]
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1]
    const cur = sorted[i]
    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1])
    else merged.push([cur[0], cur[1]])
  }
  return merged
}

export function findSkipRegions(src: string): Range[] {
  const fences = findFencedCodeRanges(src)
  const comments = findHtmlCommentRanges(src)
  // Inline-code detection avoids overlap with fences (which start with `).
  const inline = findInlineCodeRanges(src, [...fences, ...comments])
  return mergeRanges([...fences, ...comments, ...inline])
}

// ─── Tag detection ────────────────────────────────────────────────────────

interface TagMatch {
  kind: TagKind
  nameEnd: number  // index of first char AFTER the tag name
}

function matchTagOpener(src: string, pos: number): TagMatch | null {
  if (src[pos] !== '<') return null
  for (const def of TAG_DEFS) {
    for (const name of [def.pascal, def.kebab]) {
      const fullPrefix = '<' + name
      if (!src.startsWith(fullPrefix, pos)) continue
      const after = src[pos + fullPrefix.length]
      // Tag name must be followed by whitespace, `/`, or `>`.
      // Anything else (e.g. `<FigureBlocks`) means it's a different identifier.
      if (after === undefined) continue
      if (after === ' ' || after === '\t' || after === '\n' || after === '\r' || after === '/' || after === '>') {
        return { kind: def.kind, nameEnd: pos + fullPrefix.length }
      }
    }
  }
  return null
}

function findOpenTagEnd(src: string, start: number): number {
  // Returns the index of the closing `>` of the open tag, or src.length if
  // unterminated. Quote handling: inside "..." or '...' a `>` does not close.
  let i = start
  while (i < src.length) {
    const ch = src[i]
    if (ch === '"' || ch === '\'') {
      const close = src.indexOf(ch, i + 1)
      if (close === -1) return src.length
      i = close + 1
    }
    else if (ch === '>') {
      return i
    }
    else {
      i++
    }
  }
  return src.length
}

// ─── Attribute inspection ─────────────────────────────────────────────────

interface AttrInspection {
  numberedFalse: boolean       // explicit opt-out: no inject, no increment
  hasNumberAttr: boolean       // user already set :number=... in any form
  literalNumberValue: number | null  // :number="<int literal>" → use to advance counter
}

function inspectAttrs(attrSpan: string): AttrInspection {
  // attrSpan starts immediately after the tag name and ends just before `>`.
  // Quote-aware match would be more robust, but the leading-whitespace anchor
  // (?:^|\s) already protects against substrings inside attribute values
  // for the common case (double-quoted attrs).
  const numberedFalse = /(?:^|\s):?numbered\s*=\s*["']false["']/.test(attrSpan)

  // Match any :number=/number= (literal int or expression).
  const numberAnyMatch = /(?:^|\s):?number\s*=\s*["']([^"']*)["']/.exec(attrSpan)
  const hasNumberAttr = numberAnyMatch !== null

  let literalNumberValue: number | null = null
  if (numberAnyMatch) {
    const value = numberAnyMatch[1].trim()
    if (/^\d+$/.test(value)) literalNumberValue = parseInt(value, 10)
  }

  return { numberedFalse, hasNumberAttr, literalNumberValue }
}

// ─── Main entry ───────────────────────────────────────────────────────────

export function injectBlockNumbers(
  src: string,
  start: NumberCounters,
  options?: InjectionOptions,
): InjectionResult {
  const regions = findSkipRegions(src)
  const counters: NumberCounters = { figure: start.figure, table: start.table }
  const figurePrefix = options?.prefixes?.figure ?? ''
  const tablePrefix = options?.prefixes?.table ?? ''
  const out: string[] = []
  let i = 0
  let regionIdx = 0

  const advance = (kind: TagKind) => {
    if (kind === 'figure') counters.figure++
    else counters.table++
  }
  const setIfHigher = (kind: TagKind, value: number) => {
    if (kind === 'figure') counters.figure = Math.max(counters.figure, value)
    else counters.table = Math.max(counters.table, value)
  }
  const buildInjection = (kind: TagKind, num: number) => {
    const prefix = kind === 'figure' ? figurePrefix : tablePrefix
    if (prefix) return ` :number="'${prefix}${num}'"`  // Vue expr → string literal
    return ` :number="${num}"`                          // Vue expr → numeric literal
  }

  while (i < src.length) {
    // Walk past any region we've moved into or beyond.
    while (regionIdx < regions.length && i >= regions[regionIdx][1]) regionIdx++
    if (regionIdx < regions.length && i >= regions[regionIdx][0]) {
      const end = regions[regionIdx][1]
      out.push(src.slice(i, end))
      i = end
      continue
    }

    // Try matching a recognized tag at i.
    if (src[i] === '<') {
      const m = matchTagOpener(src, i)
      if (m) {
        const closingPos = findOpenTagEnd(src, m.nameEnd)
        const tagEndExclusive = closingPos < src.length ? closingPos + 1 : closingPos
        const attrSpan = src.slice(m.nameEnd, closingPos)
        const inspection = inspectAttrs(attrSpan)

        if (inspection.numberedFalse) {
          // No injection, no counter change.
          out.push(src.slice(i, tagEndExclusive))
        }
        else if (inspection.hasNumberAttr) {
          // User-managed; skip injection, advance counter only if literal int.
          out.push(src.slice(i, tagEndExclusive))
          if (inspection.literalNumberValue !== null) {
            setIfHigher(m.kind, inspection.literalNumberValue + 1)
          }
        }
        else {
          // Auto-inject :number="N" (or `'<prefix>N'`) right after the tag
          // name, then keep the rest of the open tag (including its leading
          // whitespace) verbatim.
          const num = m.kind === 'figure' ? counters.figure : counters.table
          out.push(src.slice(i, m.nameEnd))
          out.push(buildInjection(m.kind, num))
          out.push(src.slice(m.nameEnd, tagEndExclusive))
          advance(m.kind)
        }

        i = tagEndExclusive
        continue
      }
    }

    // Default: copy this character.
    out.push(src[i])
    i++
  }

  return { out: out.join(''), counters }
}
