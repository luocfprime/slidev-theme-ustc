// Run: node --experimental-strip-types --test tests/blockNumberTransform.test.mjs

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { injectBlockNumbers } from '../utils/blockNumberTransform.ts'

const start = () => ({ figure: 1, table: 1 })

// ─── Basic ────────────────────────────────────────────────────────────────

test('empty source returns empty + counters preserved', () => {
  const r = injectBlockNumbers('', start())
  assert.equal(r.out, '')
  assert.deepEqual(r.counters, { figure: 1, table: 1 })
})

test('source with no recognized tags is unchanged', () => {
  const src = '# Title\n\nNormal paragraph with <Block title="x" />.\n'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, src)
  assert.deepEqual(r.counters, { figure: 1, table: 1 })
})

test('single self-closing FigureBlock gets :number="1"', () => {
  const src = '<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock :number="1" />')
  assert.deepEqual(r.counters, { figure: 2, table: 1 })
})

test('FigureBlock with attrs preserves attrs', () => {
  const src = '<FigureBlock src="/a.png" caption="x" />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock :number="1" src="/a.png" caption="x" />')
})

test('paired tag injects on opener only', () => {
  const src = '<TableBlock caption="t">body</TableBlock>'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<TableBlock :number="1" caption="t">body</TableBlock>')
  assert.deepEqual(r.counters, { figure: 1, table: 2 })
})

test('kebab-case tag is recognized', () => {
  const src = '<figure-block src="/a.png" />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<figure-block :number="1" src="/a.png" />')
})

// ─── Multi-line tags ──────────────────────────────────────────────────────

test('multi-line FigureBlock preserves whitespace exactly', () => {
  const src = '<FigureBlock\n  src="/a.png"\n  caption="x"\n/>'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock :number="1"\n  src="/a.png"\n  caption="x"\n/>')
})

// ─── Multiple tags ────────────────────────────────────────────────────────

test('figures and tables interleaved use independent counters', () => {
  const src = '<FigureBlock /> <TableBlock /> <FigureBlock /> <TableBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(
    r.out,
    '<FigureBlock :number="1" /> <TableBlock :number="1" /> <FigureBlock :number="2" /> <TableBlock :number="2" />',
  )
  assert.deepEqual(r.counters, { figure: 3, table: 3 })
})

test('starting counters carry over from previous slide', () => {
  const src = '<FigureBlock /><TableBlock />'
  const r = injectBlockNumbers(src, { figure: 5, table: 8 })
  assert.equal(r.out, '<FigureBlock :number="5" /><TableBlock :number="8" />')
  assert.deepEqual(r.counters, { figure: 6, table: 9 })
})

// ─── Skip regions: HTML comments ──────────────────────────────────────────

test('tag inside single-line HTML comment is skipped', () => {
  const src = '<!-- <FigureBlock /> -->\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<!-- <FigureBlock /> -->\n<FigureBlock :number="1" />')
  assert.deepEqual(r.counters, { figure: 2, table: 1 })
})

test('tag inside multi-line HTML comment is skipped', () => {
  const src = '<!--\n  features: cover\n  <FigureBlock src="x" />\n-->\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(
    r.out,
    '<!--\n  features: cover\n  <FigureBlock src="x" />\n-->\n<FigureBlock :number="1" />',
  )
})

// ─── Skip regions: code fences ────────────────────────────────────────────

test('tag inside ``` fenced code is skipped', () => {
  const src = '```vue\n<FigureBlock />\n```\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '```vue\n<FigureBlock />\n```\n<FigureBlock :number="1" />')
})

test('tag inside ~~~ fenced code is skipped (regression for old regex)', () => {
  const src = '~~~vue\n<FigureBlock />\n~~~\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '~~~vue\n<FigureBlock />\n~~~\n<FigureBlock :number="1" />')
})

test('unclosed fenced code skips everything to EOF', () => {
  const src = '```vue\n<FigureBlock />\n<FigureBlock />\n'
  const r = injectBlockNumbers(src, start())
  // both inside the unclosed fence
  assert.equal(r.out, src)
  assert.deepEqual(r.counters, { figure: 1, table: 1 })
})

test('tag inside inline code span is skipped', () => {
  const src = 'see `<FigureBlock />` for syntax\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, 'see `<FigureBlock />` for syntax\n<FigureBlock :number="1" />')
})

// ─── Manual override: :number ─────────────────────────────────────────────

test(':number="7" is preserved verbatim, counter jumps to 8', () => {
  const src = '<FigureBlock :number="7" />\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock :number="7" />\n<FigureBlock :number="8" />')
  assert.deepEqual(r.counters, { figure: 9, table: 1 })
})

test('number="7" (no colon) also recognized as override', () => {
  const src = '<FigureBlock number="7" caption="x" />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock number="7" caption="x" />')
  assert.deepEqual(r.counters, { figure: 8, table: 1 })
})

test('mixed bare → manual → bare keeps sequence consistent', () => {
  const src = '<FigureBlock />\n<FigureBlock :number="10" />\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(
    r.out,
    '<FigureBlock :number="1" />\n<FigureBlock :number="10" />\n<FigureBlock :number="11" />',
  )
})

test(':number with non-literal expression is preserved, counter unchanged', () => {
  const src = '<FigureBlock :number="someVar + 1" />\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  // Counter unchanged because we cannot evaluate the expression at compile time.
  assert.equal(
    r.out,
    '<FigureBlock :number="someVar + 1" />\n<FigureBlock :number="1" />',
  )
})

// ─── Opt-out: :numbered="false" ───────────────────────────────────────────

test(':numbered="false" skips inject AND counter increment', () => {
  const src = '<FigureBlock />\n<FigureBlock :numbered="false" />\n<FigureBlock />'
  const r = injectBlockNumbers(src, start())
  assert.equal(
    r.out,
    '<FigureBlock :number="1" />\n<FigureBlock :numbered="false" />\n<FigureBlock :number="2" />',
  )
  assert.deepEqual(r.counters, { figure: 3, table: 1 })
})

test('numbered="false" (no colon) also opts out', () => {
  const src = '<FigureBlock numbered="false" caption="hero" />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock numbered="false" caption="hero" />')
  assert.deepEqual(r.counters, { figure: 1, table: 1 })
})

// ─── Idempotency ──────────────────────────────────────────────────────────

test('running twice on the same input is idempotent', () => {
  const src = '<FigureBlock /> <TableBlock />'
  const first = injectBlockNumbers(src, start())
  const second = injectBlockNumbers(first.out, start())
  assert.equal(second.out, first.out)
  // After the second pass, the counters should reflect "user-managed" jumps,
  // not double-injection.
  assert.deepEqual(second.counters, { figure: 2, table: 2 })
})

// ─── Tag-name boundary ────────────────────────────────────────────────────

test('<FigureBlocks> (extra char) is NOT treated as a tag', () => {
  const src = '<FigureBlocks foo="x" />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, src)
})

test('closing tag </FigureBlock> is not double-counted', () => {
  const src = '<FigureBlock>x</FigureBlock>'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock :number="1">x</FigureBlock>')
  assert.deepEqual(r.counters, { figure: 2, table: 1 })
})

// ─── Quote handling in tag ────────────────────────────────────────────────

test('> inside attribute string does not end the tag prematurely', () => {
  const src = '<FigureBlock caption="a > b" src="/x.png" />'
  const r = injectBlockNumbers(src, start())
  assert.equal(r.out, '<FigureBlock :number="1" caption="a > b" src="/x.png" />')
})
