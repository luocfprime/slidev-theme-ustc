import { findSkipRegions, type Range } from './blockNumberTransform'

// Detect whether a slide should be marked WIP — either via explicit
// `wip: true` in slide frontmatter, or by containing a recognized component
// (FigureBlock / TableBlock / VideoBlock / QRCode) flagged with `wip`.
//
// hasWipBlockComponent first masks out CommonMark fenced code blocks, HTML
// comments, and inline code spans (via blockNumberTransform.findSkipRegions),
// so wip-flagged tags inside docs and examples don't false-positive. The
// regex itself walks attributes, skipping over quoted values, so caption
// strings containing the substring "wip" don't match.
//
// At runtime, $slidev.nav.slides[i] is a SlideRoute and the source markdown
// lives at .meta.slide.content. Slidev preserves this in dev mode but strips
// it to "" in build mode for bundle size — so component-level auto-detection
// only works in dev/authoring. In build/preview, only explicit `wip: true` in
// frontmatter triggers the slide-level signals (watermark + section-bar dot).
// Component badges always render regardless of build mode (component-local).
//
// Static syntax only:
//   <FigureBlock wip />              ✓
//   <FigureBlock :wip="true" />      ✓
//   <FigureBlock :wip="someVar" />   ✗ (no var resolution at scan time)
//   <component :is="'FigureBlock'" wip />  ✗ (dynamic component not recognized)
//   <FigureBlock :wip="false" />     ✗ false-positive — drop the attribute
//                                      instead of negating it explicitly.

const WIP_COMPONENT_RE = /<(?:FigureBlock|figure-block|TableBlock|table-block|VideoBlock|video-block|QRCode|qr-code)\b(?:\s+[a-zA-Z0-9:_-]+(?:=(?:"[^"]*"|'[^']*'|[^\s/>]+))?)*\s+:?wip(?:[\s/>]|=)/i

function maskRegions(src: string, regions: Range[]): string {
  if (regions.length === 0) return src
  let out = ''
  let pos = 0
  for (const [start, end] of regions) {
    out += src.slice(pos, start)
    out += ' '.repeat(end - start)
    pos = end
  }
  out += src.slice(pos)
  return out
}

export function hasWipBlockComponent(src: string): boolean {
  if (!src) return false
  const masked = maskRegions(src, findSkipRegions(src))
  return WIP_COMPONENT_RE.test(masked)
}

export function isSlideWip(slide: any): boolean {
  const fm =
    slide?.frontmatter
    ?? slide?.meta?.slide?.frontmatter
    ?? slide?.meta?.frontmatter
  if (fm?.wip === true) return true

  const src = slide?.meta?.slide?.content
  return typeof src === 'string' && hasWipBlockComponent(src)
}
