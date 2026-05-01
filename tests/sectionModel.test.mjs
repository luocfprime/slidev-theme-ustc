// Run: node --experimental-strip-types --test tests/sectionModel.test.mjs

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildSectionGroups } from '../utils/sectionModel.ts'

test('buildSectionGroups groups body slides under preceding section', () => {
  const slides = [
    { no: 1, frontmatter: { layout: 'cover' } },
    { no: 2, frontmatter: { layout: 'section', sectionLabel: 'Motivation' } },
    { no: 3, frontmatter: { layout: 'content' } },
    { no: 4, frontmatter: { layout: 'split', wip: true } },
    { no: 5, frontmatter: { layout: 'toc' } },
    { no: 6, frontmatter: { layout: 'section' }, title: 'Method' },
    { no: 7, frontmatter: {} },
  ]

  assert.deepEqual(buildSectionGroups(slides), [
    {
      title: 'Motivation',
      sectionNo: 2,
      slides: [
        { no: 3, wip: false },
        { no: 4, wip: true },
      ],
    },
    {
      title: 'Method',
      sectionNo: 6,
      slides: [{ no: 7, wip: false }],
    },
  ])
})

test('buildSectionGroups stops at backup by default', () => {
  const slides = [
    { no: 1, frontmatter: { layout: 'section' }, title: 'Body' },
    { no: 2, frontmatter: { layout: 'content' } },
    { no: 3, frontmatter: { layout: 'backup' } },
    { no: 4, frontmatter: { layout: 'section' }, title: 'Appendix' },
    { no: 5, frontmatter: { layout: 'content' } },
  ]

  assert.deepEqual(buildSectionGroups(slides), [
    {
      title: 'Body',
      sectionNo: 1,
      slides: [{ no: 2, wip: false }],
    },
  ])
})

test('buildSectionGroups can include sections after backup for toc compatibility', () => {
  const slides = [
    { no: 1, frontmatter: { layout: 'section' }, title: 'Body' },
    { no: 2, frontmatter: { layout: 'backup' } },
    { no: 3, frontmatter: { layout: 'section' }, title: 'Appendix' },
  ]

  assert.deepEqual(
    buildSectionGroups(slides, { stopAtBackup: false }).map((s) => s.title),
    ['Body', 'Appendix'],
  )
})
