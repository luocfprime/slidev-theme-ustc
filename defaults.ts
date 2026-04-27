// ── Centralised default prop values ──────────────────────────────────────────
// Layouts and components both import from here.

export const footerDefaults = {
  footer: true,
  footerMode: 'full' as 'full' | 'minimal',
}

export const bodyDefaults = {
  ...footerDefaults,
  density: 'normal' as 'normal' | 'dense',
  footnote: 'overlay' as 'overlay' | 'flow',
  sectionBar: true,
}

export const logoDefaults = {
  logoSrc: '/ustc/logo.svg',
  logoAlt: 'USTC logo',
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
