import type { CSSProperties } from 'vue'

export function getLayout(slide: any): string {
  return slide?.frontmatter?.layout ?? slide?.meta?.layout ?? slide?.meta?.frontmatter?.layout ?? ''
}

export function getSectionTitle(slide: any, fallback: string): string {
  return (
    slide.frontmatter?.sectionLabel ??
    slide.meta?.slide?.frontmatter?.sectionLabel ??
    slide.meta?.frontmatter?.sectionLabel ??
    slide.meta?.slide?.title ??
    slide.meta?.title ??
    slide.title ??
    slide.frontmatter?.title ??
    fallback
  )
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

export function getPresenterName(authors: AuthorEntry[] = [], presenter?: string): string {
  if (presenter) return presenter
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
