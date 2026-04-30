// Run: pnpm exec tsx --test tests/slideWip.test.mjs

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isSlideWip } from '../utils/slideWip.ts'

test('frontmatter wip true marks a slide as WIP', () => {
  assert.equal(isSlideWip({ frontmatter: { wip: true } }), true)
  assert.equal(isSlideWip({ meta: { slide: { frontmatter: { wip: true } } } }), true)
  assert.equal(isSlideWip({ meta: { frontmatter: { wip: true } } }), true)
})

test('component wip source does not mark the slide as WIP', () => {
  const slide = {
    frontmatter: {},
    meta: {
      slide: {
        content: '<FigureBlock wip src="/draft.png" />\n<TableBlock :wip="true" />',
      },
    },
  }

  assert.equal(isSlideWip(slide), false)
})

test('frontmatter values other than literal true do not mark a slide as WIP', () => {
  assert.equal(isSlideWip({ frontmatter: { wip: false } }), false)
  assert.equal(isSlideWip({ frontmatter: { wip: 'true' } }), false)
})
