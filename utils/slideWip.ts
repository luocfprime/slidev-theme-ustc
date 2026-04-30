import { getSlideFrontmatter } from './layoutHelper.ts'

// Slide-level WIP signals are intentionally frontmatter-only. Component-level
// `wip` props render local badges/placeholders on the component itself, but do
// not affect section-bar dots or slide watermarks.

export function isSlideWip(slide: any): boolean {
  return getSlideFrontmatter(slide).wip === true
}
