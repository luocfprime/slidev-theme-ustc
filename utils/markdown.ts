import MarkdownIt from 'markdown-it'
import katex from 'katex'
import type Token from 'markdown-it/lib/token.mjs'

const md = new MarkdownIt({ html: true, linkify: true })

// Inline math: $...$
md.core.ruler.push('inline_math', (state) => {
  for (const blockToken of state.tokens) {
    if (blockToken.type !== 'inline' || !blockToken.children) continue
    const next: Token[] = []
    for (const child of blockToken.children) {
      if (child.type !== 'text') {
        next.push(child)
        continue
      }
      const parts = child.content.split(/(?<!\\)(\$[^$\n]+?\$)/)
      if (parts.length === 1) {
        next.push(child)
        continue
      }
      for (const part of parts) {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const html = katex.renderToString(part.slice(1, -1), {
            throwOnError: false,
            output: 'html',
          })
          const t = new state.Token('html_inline', '', 0)
          t.content = html
          next.push(t)
        } else if (part) {
          const t = new state.Token('text', '', 0)
          t.content = part
          next.push(t)
        }
      }
    }
    blockToken.children = next
  }
})

export function renderInlineMd(text: string): string {
  return md.renderInline(text)
}
