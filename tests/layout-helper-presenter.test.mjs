import assert from 'node:assert/strict'
import { getPresenterName } from '../utils/layoutHelper.ts'

const authors = [
  {
    name: 'Alex Rivera',
    affiliations: ['Example University'],
  },
  {
    name: 'Taylor Morgan',
    affiliations: ['Fictional Institute of Technology'],
  },
]

assert.equal(
  getPresenterName(authors, undefined, { presenter: 'Taylor Morgan' }),
  'Taylor Morgan',
  'first-slide headmatter presenter should override the first-author fallback',
)

assert.equal(
  getPresenterName(authors, 'Taylor Morgan'),
  'Taylor Morgan',
  'regular slide presenter prop should still work',
)

assert.equal(
  getPresenterName(authors, true),
  'Alex Rivera',
  'Slidev built-in boolean presenter config should not be rendered as a name',
)
