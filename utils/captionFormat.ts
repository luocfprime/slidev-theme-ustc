import { DEFAULT_NUMBER_SUFFIX } from './defaults'

export interface NumberedCaptionOptions {
  prefix: string
  number?: number | string | null
  caption?: string
  numbered?: boolean
  numberSuffix?: string
}

export function formatNumberedCaption({
  prefix,
  number,
  caption,
  numbered,
  numberSuffix = DEFAULT_NUMBER_SUFFIX,
}: NumberedCaptionOptions): string {
  const showLabel = numbered !== false && number != null
  if (!showLabel && !caption) return ''
  if (!showLabel) return caption ?? ''

  const label = `${prefix} ${number}`
  return caption ? `${label}${numberSuffix}${caption}` : label
}
