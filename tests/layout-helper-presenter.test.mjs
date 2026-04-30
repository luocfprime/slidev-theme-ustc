import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getPresenterName } from '../utils/layoutHelper.ts'

const authors = [
  { name: 'Alex Rivera', affiliations: ['Example University'] },
  { name: 'Taylor Morgan', affiliations: ['Fictional Institute of Technology'] },
]

test('frontmatter presenter overrides first-author fallback', () => {
  assert.equal(
    getPresenterName(authors, undefined, { presenter: 'Taylor Morgan' }),
    'Taylor Morgan',
  )
})

test('slide-level presenter prop is used when set', () => {
  assert.equal(getPresenterName(authors, 'Taylor Morgan'), 'Taylor Morgan')
})

test('Slidev boolean presenter config falls back to first author', () => {
  // Slidev sets presenter:true for its built-in presenter mode; must not render as "true"
  assert.equal(getPresenterName(authors, true), 'Alex Rivera')
})
