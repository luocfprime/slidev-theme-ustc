// Vendored from https://github.com/shigma/slidev-addon-typst (MIT License)
// Copyright (c) Shigma <shigma10826@gmail.com>
// Modifications: wrap bare <tr> in <tbody> to satisfy HTML spec and avoid Vue hydration warnings.

import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'
import { injectBlockNumbers, type NumberCounters } from '../utils/blockNumberTransform.ts'
import type { MarkdownTransformContext } from '@slidev/types'

const compiler = NodeCompiler.create()

interface TypstOptions {
  prelude?: string
  inputs?: Record<string, string>
}

const DEFAULT_PRELUDE = `
#show math.equation: it => context {
  // only wrap in frame on html export
  if target() == "html" {
    // wrap frames of inline equations in a box
    // so they don't interrupt the paragraph
    show: if it.block { it => it } else { box }
    html.frame(it)
  } else {
    it
  }
}`

const MAGIC_HUE = '-45.841deg'

interface TypstFence {
  info: string
  code: string
  start: number
  end: number
}

function findTagOpenEnd(src: string, start: number): number {
  let i = start
  while (i < src.length) {
    const ch = src[i]
    if (ch === '"' || ch === "'") {
      const close = src.indexOf(ch, i + 1)
      if (close === -1) return src.length
      i = close + 1
    } else if (ch === '>') {
      return i
    } else {
      i++
    }
  }
  return src.length
}

export function extractTypstFences(src: string): TypstFence[] {
  const fences: TypstFence[] = []
  let i = 0

  while (i < src.length) {
    const lineStart = i
    let lineEnd = src.indexOf('\n', i)
    if (lineEnd === -1) lineEnd = src.length
    const line = src.slice(lineStart, lineEnd)
    const opener = /^([ \t]{0,3})(`{3,}|~{3,})([^\n]*)$/.exec(line)

    if (!opener) {
      i = lineEnd + 1
      continue
    }

    const fence = opener[2]
    const info = opener[3].trim()
    const infoMatch = /^typst(?:\s+(\{[^\n]*\}))?\s*$/.exec(info)
    if (!infoMatch) {
      i = lineEnd + 1
      continue
    }

    const fenceChar = fence[0]
    const fenceLen = fence.length
    const bodyStart = lineEnd < src.length ? lineEnd + 1 : lineEnd
    let scan = bodyStart
    let closeStart = src.length
    let closeEnd = src.length

    while (scan < src.length) {
      const closeLineStart = scan
      let closeLineEnd = src.indexOf('\n', scan)
      if (closeLineEnd === -1) closeLineEnd = src.length
      const closeLine = src.slice(closeLineStart, closeLineEnd)
      const close = /^[ \t]{0,3}(`{3,}|~{3,})[ \t]*$/.exec(closeLine)
      if (close && close[1][0] === fenceChar && close[1].length >= fenceLen) {
        closeStart = closeLineStart
        closeEnd = closeLineEnd < src.length ? closeLineEnd + 1 : closeLineEnd
        break
      }
      scan = closeLineEnd + 1
    }

    const codeEnd =
      closeStart > bodyStart && src[closeStart - 1] === '\n' ? closeStart - 1 : closeStart
    fences.push({
      info: infoMatch[1] ?? '',
      code: src.slice(bodyStart, codeEnd),
      start: lineStart,
      end: closeEnd,
    })
    i = closeEnd
  }

  return fences
}

export function patchTypstTableHtml(html: string): string {
  let out = ''
  let pos = 0

  while (pos < html.length) {
    const tableStart = html.indexOf('<table', pos)
    if (tableStart === -1) {
      out += html.slice(pos)
      break
    }

    out += html.slice(pos, tableStart)
    const openEnd = findTagOpenEnd(html, tableStart)
    if (openEnd >= html.length) {
      out += html.slice(tableStart)
      break
    }

    const closeStart = html.indexOf('</table>', openEnd + 1)
    if (closeStart === -1) {
      out += html.slice(tableStart)
      break
    }

    const closeEnd = closeStart + '</table>'.length
    const openTag = html.slice(tableStart, openEnd + 1)
    const inner = html.slice(openEnd + 1, closeStart)

    if (inner.includes('<tbody') || inner.includes('<thead') || inner.includes('<tfoot')) {
      out += html.slice(tableStart, closeEnd)
    } else {
      out += `${openTag}<tbody>${inner}</tbody></table>`
    }
    pos = closeEnd
  }

  return out
}

export function renderTypst(code: string, options: TypstOptions) {
  const colorNames: string[] = []
  code = code.replace(/var\(([\w-]+)\)/g, ($0, name: string) => {
    colorNames.push(name)
    return `color.hsl(${MAGIC_HUE}, 0%, ${colorNames.length}%)`
  })
  code = DEFAULT_PRELUDE + '\n' + (options.prelude ?? '') + '\n' + code
  const result = compiler.tryHtml({
    mainFileContent: code,
    inputs: options.inputs,
  })
  if (!result.result) {
    result.printErrors()
    result.printDiagnostics()
    return ''
  }
  const html = result.result
    .body()
    .replace(/"hsl\(-45\.841deg ([\d.]+)% ([\d.]+)%\)"/g, ($0, $1, num: string) => {
      return `"var(--${colorNames[+num - 1]})"`
    })
  // Typst HTML output emits <tr> as direct children of <table>, which is
  // invalid HTML and triggers Vue hydration warnings. Wrap bare rows in <tbody>.
  return patchTypstTableHtml(html)
}

async function typstTransformer(ctx: any) {
  const snippets = extractTypstFences(ctx.s.original)
  const typst = (ctx.options.data.headmatter.typst ??= {}) as TypstOptions
  const svgs = await Promise.all(
    snippets.map(async ({ code }) => {
      return renderTypst(code, typst)
    }),
  )
  for (let i = snippets.length - 1; i >= 0; i--) {
    ctx.s.overwrite(snippets[i].start, snippets[i].end, svgs[i])
  }
}

// Compile-time auto-numbering for <FigureBlock> / <TableBlock>. Runs in `pre`
// so subsequent transformers (typst, markdown→Vue compile) see the injected
// :number="N" props as if the user had typed them. Source of truth lives in
// utils/blockNumberTransform.ts.
//
// Counter scope: global across the deck. To compute the starting counter for
// the current slide we replay the transform on every prior slide's source
// (O(N²); negligible for typical decks of <100 slides). This avoids any
// closure-level state that would drift under HMR or out-of-order transformer
// invocations.
// Appendix convention: any slide with `layout: backup`, AND every slide
// after it, get their own counter starting from 1, with labels formatted as
// "A.N" instead of bare "N". This matches academic-talk style where appendix
// figures are numbered A.1, A.2, ... separately from body figures 1, 2, 3.
const APPENDIX_PREFIX = 'A.'

function isBackupSlide(slide: any): boolean {
  return slide?.source?.frontmatter?.layout === 'backup'
}

function numberingTransformer(ctx: MarkdownTransformContext) {
  const slides = ctx.options.data.slides
  const myIndex = ctx.slide.index

  let counters: NumberCounters = { figure: 1, table: 1 }
  let inAppendix = false

  // Replay all prior slides to reach the correct starting counters AND
  // appendix mode for the current slide.
  for (let i = 0; i < myIndex; i++) {
    if (isBackupSlide(slides[i])) {
      counters = { figure: 1, table: 1 }
      inAppendix = true
    }
    const opts = inAppendix
      ? { prefixes: { figure: APPENDIX_PREFIX, table: APPENDIX_PREFIX } }
      : undefined
    counters = injectBlockNumbers(slides[i].source.content, counters, opts).counters
  }

  // The current slide may itself be the appendix-boundary slide.
  if (isBackupSlide(slides[myIndex])) {
    counters = { figure: 1, table: 1 }
    inAppendix = true
  }
  const opts = inAppendix
    ? { prefixes: { figure: APPENDIX_PREFIX, table: APPENDIX_PREFIX } }
    : undefined

  const original = ctx.s.original
  const { out } = injectBlockNumbers(original, counters, opts)
  if (out !== original) ctx.s.overwrite(0, original.length, out)
}

export default () => ({
  pre: [numberingTransformer],
  preCodeblock: [typstTransformer],
  postCodeblock: [],
  post: [],
})
