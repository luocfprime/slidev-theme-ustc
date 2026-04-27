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

export function handleBackground(background?: string, dim = false, opacity = 0.5): CSSProperties {
  const isColor = background && ['#', 'rgb', 'hsl'].some(v => background.indexOf(v) === 0)

  const overlayStart = `rgba(255,255,255,${opacity})`
  const overlayEnd   = `rgba(255,255,255,${opacity * 0.85})`

  const style: CSSProperties = {
    background: isColor ? background : undefined,
    backgroundImage: isColor
      ? undefined
      : background
        ? dim
          ? `linear-gradient(90deg,${overlayStart},${overlayEnd}),url(${resolveAssetUrl(background)})`
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

interface Author { [key: string]: string[] }
interface InstitutionMap { [key: string]: number }
interface AuthorInstitutions { instituteNum: number[]; instituteName: string[] }
interface AuthorsDict { [key: string]: AuthorInstitutions }

export interface FootnoteEntry { number: number; content: string }

export function getPresenterName(authors: Author[] = []): string {
  return authors.length ? (Object.keys(authors[0])[0] ?? '') : ''
}

export function handleAuthor(authors: Author[] = []): [AuthorsDict, FootnoteEntry[]] {
  const allInstitutions: InstitutionMap = {}
  let institutionIndex = 1

  authors.forEach((authorObj) => {
    const institutions = Object.values(authorObj)[0] ?? []
    institutions.forEach((inst) => {
      if (!allInstitutions[inst])
        allInstitutions[inst] = institutionIndex++
    })
  })

  const authorsDict: AuthorsDict = authors.reduce((acc: AuthorsDict, authorObj) => {
    const name = Object.keys(authorObj)[0]
    const institutions = authorObj[name] ?? []
    acc[name] = {
      instituteNum: institutions.map(i => allInstitutions[i]),
      instituteName: institutions,
    }
    return acc
  }, {})

  return [
    authorsDict,
    Object.entries(allInstitutions).map(([content, number]) => ({ number, content })),
  ]
}
