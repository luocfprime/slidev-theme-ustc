import assert from 'node:assert/strict'
import { test } from 'node:test'

import { classifyMeasurement } from '../skills/slidev-theme-ustc/scripts/audit-layout-heuristics.mjs'

test('classifies a split slide with strongly imbalanced columns', () => {
  const findings = classifyMeasurement({
    layoutClass: 'split',
    overflowY: 0,
    fillPct: 82,
    remaining: 80,
    columns: [
      { name: 'left', fillPct: 88, remaining: 35 },
      { name: 'right', fillPct: 31, remaining: 260 },
    ],
  })

  assert.ok(findings.some((f) => f.kind === 'split'))
})

test('does not classify one short wrapped tail as a layout defect', () => {
  const findings = classifyMeasurement({
    layoutClass: 'content',
    overflowY: 0,
    fillPct: 70,
    remaining: 140,
    wraps: {
      wrappedBlocks: 1,
      shortWraps: [
        {
          tag: 'li',
          lines: 2,
          lastRatio: 0.12,
          text: '训练主要发生在 flow-conditioned generation 或 DMD distillation',
        },
      ],
    },
  })

  assert.equal(
    findings.some((f) => f.kind === 'wrap'),
    false,
  )
})

test('classifies repeated short wrapped tails as a wrap review item', () => {
  const findings = classifyMeasurement({
    layoutClass: 'content',
    overflowY: 0,
    fillPct: 70,
    remaining: 140,
    wraps: {
      wrappedBlocks: 3,
      shortWraps: [
        { tag: 'li', lines: 2, lastRatio: 0.12, text: 'first' },
        { tag: 'li', lines: 2, lastRatio: 0.13, text: 'second' },
        { tag: 'li', lines: 2, lastRatio: 0.11, text: 'third' },
      ],
    },
  })

  assert.ok(findings.some((f) => f.kind === 'wrap'))
})

test('does not flag structural slides for intentional whitespace', () => {
  const findings = classifyMeasurement({
    layoutClass: 'section',
    overflowY: 0,
    fillPct: 22,
    remaining: 420,
    empty: { largestPct: 48, location: 'bottom-right' },
  })

  assert.equal(findings.length, 0)
})

test('still flags body slides with very low vertical fill as sparse', () => {
  const findings = classifyMeasurement({
    layoutClass: 'content',
    overflowY: 0,
    fillPct: 31,
    remaining: 350,
  })

  assert.ok(findings.some((f) => f.kind === 'sparse'))
})
