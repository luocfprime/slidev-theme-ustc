import type { CSSProperties } from 'vue'

// Three fallback paths reflect the two contexts where this is called:
//   1. slide.frontmatter          — test stubs and Slidev's transformer context
//                                   (ctx.options.data.slides[i].source is NOT used here;
//                                    that context accesses .source.frontmatter directly)
//   2. slide.meta?.slide?.frontmatter — primary runtime shape of $slidev.nav.slides
//   3. slide.meta?.frontmatter    — fallback for alternative Slidev runtime shapes
// If Slidev restructures its slide object, add the new path here rather than
// scattering defensive access across call sites.
export function getSlideFrontmatter(slide: any): Record<string, any> {
  return (
    slide?.frontmatter
    ?? slide?.meta?.slide?.frontmatter
    ?? slide?.meta?.frontmatter
    ?? {}
  )
}

export function getLayout(slide: any): string {
  return getSlideFrontmatter(slide).layout ?? slide?.meta?.layout ?? ''
}

export function getSectionTitle(slide: any, fallback: string): string {
  const frontmatter = getSlideFrontmatter(slide)
  return (
    frontmatter.sectionLabel ??
    slide.meta?.slide?.title ??
    slide.meta?.title ??
    slide.title ??
    frontmatter.title ??
    fallback
  )
}

/**
 * Read a slide's per-page sectionBarMode frontmatter override, falling back
 * to a default. Each call site still owns its `currentSlide` reactive
 * lookup and `barMode` computed wrapper — this only deduplicates the
 * three-level frontmatter chain.
 */
export function getSectionBarMode(slide: any, fallback: string = 'full'): string {
  const local = getSlideFrontmatter(slide).sectionBarMode
  return (local ?? fallback) as string
}


export function resolveAssetUrl(url: string) {
  if (url.startsWith('/'))
    return import.meta.env.BASE_URL + url.slice(1)
  return url
}

export function handleBackground(background?: string, coverOverlay = false): CSSProperties {
  const isColor = background && (
    ['#', 'rgb', 'hsl', 'oklch', 'lch', 'lab', 'hwb', 'color', 'transparent', 'currentColor', 'inherit'].some(v => background.startsWith(v))
    || /^[a-z]+$/.test(background)
  )

  const style: CSSProperties = {
    background: isColor ? background : undefined,
    backgroundImage: isColor
      ? undefined
      : background
        ? coverOverlay
          ? `linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0.85)),url("${resolveAssetUrl(background)}")`
          : `url("${resolveAssetUrl(background)}")`
        : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }

  if (!style.background) delete style.background
  return style
}

export function resolveBodyMargin(margin?: 'normal' | 'tight' | 'tighter' | 'none'): CSSProperties {
  const marginMap: Record<'normal' | 'tight' | 'tighter' | 'none', { x: string; y: string }> = {
    normal: { x: '2.8rem', y: '1.75rem' },
    tight: { x: '2.0rem', y: '1.25rem' },
    tighter: { x: '1.2rem', y: '0.8rem' },
    none: { x: '0rem', y: '0rem' },
  }

  const value = marginMap[margin ?? 'normal']
  return {
    '--ustc-px': value.x,
    '--ustc-pl': value.x,
    '--ustc-py': value.y,
  }
}

// New structured format
export interface AuthorEntryNew {
  name: string
  affiliations: string[]
  marks?: string[]
}

// Legacy format: { "Name": ["inst1", "inst2"] }
type AuthorEntryOld = Record<string, string[]>

export type AuthorEntry = AuthorEntryNew | AuthorEntryOld

export interface NormalizedAuthor {
  name: string
  affiliations: string[]
  marks: string[]
}

function normalizeAuthor(entry: AuthorEntry): NormalizedAuthor {
  if ('name' in entry && typeof (entry as AuthorEntryNew).name === 'string') {
    const e = entry as AuthorEntryNew
    return { name: e.name, affiliations: e.affiliations ?? [], marks: e.marks ?? [] }
  }
  const name = Object.keys(entry)[0]
  return { name, affiliations: (entry as AuthorEntryOld)[name] ?? [], marks: [] }
}

export function normalizeAuthors(authors: AuthorEntry[]): NormalizedAuthor[] {
  return authors.map(normalizeAuthor)
}

interface InstitutionMap { [key: string]: number }
interface AuthorInstitutions { instituteNum: number[]; instituteName: string[] }
interface AuthorsDict { [key: string]: AuthorInstitutions }

export interface FootnoteEntry { number: number; content: string }

export function getPresenterName(
  authors: AuthorEntry[] = [],
  presenter?: unknown,
  frontmatter?: Record<string, unknown>,
): string {
  if (typeof presenter === 'string' && presenter.trim()) return presenter
  const frontmatterPresenter = frontmatter?.presenter
  if (typeof frontmatterPresenter === 'string' && frontmatterPresenter.trim()) return frontmatterPresenter
  return authors.length ? normalizeAuthor(authors[0]).name : ''
}

export function handleAuthor(authors: AuthorEntry[] = []): [AuthorsDict, FootnoteEntry[]] {
  const normalized = normalizeAuthors(authors)
  const allInstitutions: InstitutionMap = {}
  let institutionIndex = 1

  normalized.forEach(({ affiliations }) => {
    affiliations.forEach((inst) => {
      if (!allInstitutions[inst])
        allInstitutions[inst] = institutionIndex++
    })
  })

  const authorsDict: AuthorsDict = normalized.reduce((acc: AuthorsDict, { name, affiliations }) => {
    acc[name] = {
      instituteNum: affiliations.map(i => allInstitutions[i]),
      instituteName: affiliations,
    }
    return acc
  }, {})

  return [
    authorsDict,
    Object.entries(allInstitutions).map(([content, number]) => ({ number, content })),
  ]
}
