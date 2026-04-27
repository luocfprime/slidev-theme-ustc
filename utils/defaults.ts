// ── Centralised default prop values ──────────────────────────────────────────
// Layouts and components both import from here.

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
  logoSrc: '/ustc/logo.svg',
  logoAlt: 'USTC logo',
}

export const splitDefaults = {
  ...bodyDefaults,
  ratio: '2:1',
  gap: 'md' as 'sm' | 'md' | 'lg',
}

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

export const endDefaults = {
  ...logoDefaults,
  ...footerDefaults,
  showLogo: false,
}

export const gridDefaults = {
  cols: '2',
  gap: 'md' as 'sm' | 'md' | 'lg',
  align: 'top' as 'top' | 'center' | 'bottom',
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

export const qrcodeDefaults = {
  size: 160,
  color: '#000000',
  background: '#ffffff',
  caption: '',
}
