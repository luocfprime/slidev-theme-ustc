import type { CSSProperties } from 'vue'

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
    color: background && !isColor ? 'black' : undefined,
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
