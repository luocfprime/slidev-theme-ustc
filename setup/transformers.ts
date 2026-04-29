// Vendored from https://github.com/shigma/slidev-addon-typst (MIT License)
// Copyright (c) Shigma <shigma10826@gmail.com>
// Modifications: wrap bare <tr> in <tbody> to satisfy HTML spec and avoid Vue hydration warnings.

import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'


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

export default () => ({
  pre: [],
  preCodeblock: [typstTransformer],
  postCodeblock: [],
  post: [],
})
