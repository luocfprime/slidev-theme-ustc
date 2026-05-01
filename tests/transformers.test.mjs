// Run: pnpm exec tsx --test tests/transformers.test.mjs

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractTypstFences, patchTypstTableHtml } from '../setup/transformers.ts'

test('extractTypstFences follows CommonMark fence length and indentation rules', () => {
  const src = [
    '````typst',
    '```',
    'not the close because the opener used four backticks',
    '```',
    '````',
    '',
    '    ```typst',
    '    indented code block, not a typst fence',
    '    ```',
  ].join('\n')

  assert.deepEqual(
    extractTypstFences(src).map((fence) => fence.code),
    ['```\nnot the close because the opener used four backticks\n```'],
  )
})

test('patchTypstTableHtml wraps bare table rows in tbody', () => {
  assert.equal(
    patchTypstTableHtml('<table class="typst"><tr><td>A</td></tr></table>'),
    '<table class="typst"><tbody><tr><td>A</td></tr></tbody></table>',
  )
})

test('patchTypstTableHtml leaves structured tables unchanged', () => {
  const html = '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>B</td></tr></tbody></table>'
  assert.equal(patchTypstTableHtml(html), html)
})
