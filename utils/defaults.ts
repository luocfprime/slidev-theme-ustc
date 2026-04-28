import logoSvgUrl from '../assets/ustc/logo.svg?url'

// ── Centralised default prop values ──────────────────────────────────────────
// Two categories of layout:
//
//   Structural layouts (cover, end, section, toc, backup): display-only frames.
//   They extend footerDefaults or logoDefaults but NOT bodyDefaults — they don't
//   expose density, margin, align, or footnote controls.
//
//   Content layouts (content, split, default): editable body slides.
//   They extend bodyDefaults (which already includes footerDefaults).
//
// Component defaults (grid, callout, figure, table, qrcode) are independent.

export const footerDefaults = {
  footer: true,
  footerMode: 'full' as 'full' | 'minimal',
}

export const bodyDefaults = {
  ...footerDefaults,
  density: 'normal' as 'normal' | 'dense',
  margin: 'normal' as 'normal' | 'tight' | 'tighter' | 'none',
  footnote: 'overlay' as 'overlay' | 'flow',
  sectionBar: true,
  align: 'left' as 'left' | 'center' | 'right',
}

export const logoDefaults = {
  logoSrc: logoSvgUrl,
  logoAlt: 'USTC logo',
}

export const splitDefaults = {
  ...bodyDefaults,
  ratio: '2:1',
  gap: 'md' as 'sm' | 'md' | 'lg',
}

// toc is structural: no density/margin/align — only footer + highlight index
export const tocDefaults = {
  ...footerDefaults,
  highlight: 0,
  columns: 1 as 1 | 2,
}

export const coverDefaults = {
  ...logoDefaults,
  background: '',
  authors: (): Record<string, string[]>[] => [],
  conference: '',
  talkTitle: 'Presentation Title',
  subtitle: '',
  date: '',
  showLogo: true,
}

// end is structural: no density/margin — only logo + footer
export const endDefaults = {
  ...logoDefaults,
  ...footerDefaults,
  showLogo: false,
}

export const gridDefaults = {
  cols: '2',
  gap: 'md' as 'sm' | 'md' | 'lg',
  alignY: 'top' as 'top' | 'center' | 'bottom',
}

export const calloutDefaults = {
  type: 'note' as 'note' | 'tip' | 'warning' | 'important' | 'example',
  title: '',
}

export const figureDefaults = {
  alt: '',
  caption: '',
  width: '100%',
  imageWidth: '100%' as string | number,
  captionAlign: 'center' as 'left' | 'center',
  captionInsetLeft: 0 as string | number,
  captionInsetRight: 0 as string | number,
  prefix: '',
}

export const tableDefaults = {
  caption: '',
  captionAlign: 'center' as 'left' | 'center',
  width: '100%',
  prefix: '',
}

export const videoDefaults = {
  caption: '',
  width: '100%',
  videoWidth: '100%' as string | number,
  captionAlign: 'center' as 'left' | 'center',
  captionInsetLeft: 0 as string | number,
  captionInsetRight: 0 as string | number,
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
}

export const qrcodeDefaults = {
  size: 160,
  color: '#000000',
  background: '#ffffff',
  caption: '',
}
