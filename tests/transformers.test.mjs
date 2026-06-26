// Run: pnpm exec tsx --test tests/transformers.test.mjs

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractTypstFences, patchTypstTableHtml, wrapTypstDocHtml } from '../setup/transformers.ts'

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

test('wrapTypstDocHtml adds typst-doc to compiler root div', () => {
  assert.equal(wrapTypstDocHtml('<div><p>A</p></div>'), '<div class="typst-doc"><p>A</p></div>')
})

test('wrapTypstDocHtml preserves existing root div classes', () => {
  assert.equal(
    wrapTypstDocHtml('<div class="typst other"><p>A</p></div>'),
    '<div class="typst other typst-doc"><p>A</p></div>',
  )
})
