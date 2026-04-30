// Vendored from https://github.com/shigma/slidev-addon-typst (MIT License)
// Copyright (c) Shigma <shigma10826@gmail.com>
// Modifications: wrap bare <tr> in <tbody> to satisfy HTML spec and avoid Vue hydration warnings.

import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'
import { injectBlockNumbers, type NumberCounters } from '../utils/blockNumberTransform'
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
  const html = result.result.body().replace(/"hsl\(-45\.841deg ([\d.]+)% ([\d.]+)%\)"/g, ($0, $1, num: string) => {
    return `"var(--${colorNames[+num - 1]})"`
  })
  // Typst HTML output emits <tr> as direct children of <table>, which is
  // invalid HTML and triggers Vue hydration warnings. Wrap bare rows in <tbody>.
  return html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/g, (match, attrs, inner) => {
    if (/<tbody|<thead|<tfoot/.test(inner)) return match
    return `<table${attrs}><tbody>${inner}</tbody></table>`
  })
}

async function typstTransformer(ctx: any) {
  const snippets: [info: string, code: string][] = []
  const scanRe = /^```typst *(\{[^\n]*\})?\n([\s\S]+?)\n```/gm
  let m: RegExpExecArray | null
  while ((m = scanRe.exec(ctx.s.original)) !== null)
    snippets.push([m[1] ?? '', m[2] ?? ''])
  const typst = (ctx.options.data.headmatter.typst ??= {}) as TypstOptions
  const svgs = await Promise.all(snippets.map(async ([info, code]) => {
    return renderTypst(code, typst)
  }))
  let count = 0
  ctx.s.replace(
    /^```typst *(\{[^\n]*\})?\n([\s\S]+?)\n```/gm,
    () => svgs[count++],
  )
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
