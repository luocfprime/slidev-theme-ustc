---
name: ustc-theme-config
description: Full configuration reference for @luocfprime/slidev-theme-ustc — global frontmatter, per-slide layout props, and CSS variables
---

# USTC Slidev Theme — Configuration Reference

## Global Frontmatter (first slide)

```yaml
theme: ./                    # or 'ustc' when installed from npm
talkTitle: My Talk
conference: ICML 2025
date: June 2025
authors:
  - Alice Chen: [USTC, MIT]  # first = presenter (underlined on cover)
  - Bob Smith: [MIT]
sectionBar: true             # show section progress bar
sectionBarMode: full         # 'full' (dots+labels) | 'minimal' (dots only)
figurePrefix: Figure         # auto-numbering prefix for FigureBlock
tablePrefix: Table           # auto-numbering prefix for TableBlock
```

---

## Per-slide Layout Props

### `content` / `default` / `split` (shared props)

| Prop | Values | Default |
|------|--------|---------|
| `density` | `'normal'` \| `'dense'` | `'normal'` |
| `margin` | `'normal'` \| `'tight'` \| `'tighter'` \| `'none'` | `'normal'` |
| `lineHeight` | number | `1.47` |
| `align` | `'left'` \| `'center'` \| `'right'` \| `'justify'` | `'left'` |
| `footnote` | `'overlay'` \| `'flow'` | `'overlay'` |
| `footer` | boolean | `true` |
| `footerMode` | `'full'` \| `'minimal'` | `'full'` |
| `sectionBar` | boolean | global setting |
| `sectionBarMode` | `'full'` \| `'minimal'` | global setting |
| `background` | CSS colour or image path | — |

`subtitle` (string) is a **`content`-only** prop — not available on `default` or `split`.

### `split` additional props

| Prop | Values | Default |
|------|--------|---------|
| `ratio` | `"2:1"` \| `"1:1"` \| `"1:2"` \| `"3:2"` \| `"2:3"` | `"2:1"` |
| `gap` | `'sm'` \| `'md'` \| `'lg'` | `'md'` |

Use `::left::` and `::right::` named slots.

### `cover`

| Prop | Notes |
|------|-------|
| `talkTitle`, `subtitle`, `authors`, `conference`, `date` | override global values |
| `showLogo` | boolean, default `true` |
| `logoSrc` | path, default `'/ustc/logo.svg'` |
| `background` | CSS colour or image path |

### `toc`

| Prop | Notes |
|------|-------|
| `highlight` | 1-based section index to highlight; `0` = none |
| `columns` | `1` (default) or `2` |

TOC entries are auto-generated from all `section` layout slides.

### `section`

| Prop | Notes |
|------|-------|
| `sectionLabel` | overrides h1 text shown in TOC and section bar |
| `sectionBarMode` | per-slide bar mode override |

### `end`

| Prop | Notes |
|------|-------|
| `showLogo` | boolean, default `false` |
| `logoSrc` / `logoAlt` | logo customisation |

Use `::contact::` slot for contact info below main content.

### `backup`

First `backup` slide marks appendix start. Footer page numbering switches to `A.1`, `A.2`, etc.

### `blank`

No props. Full-bleed canvas, no padding. Use `<v-drag>` or `<Abs>` for placement.

---

## CSS Variables

### Typography

| Variable | Default | Scope |
|----------|---------|-------|
| `--ustc-fs-body` | `1.4rem` | `p`, `li` normal mode |
| `--ustc-fs-body-dense` | `1.05rem` | `p`, `li` dense mode |
| `--ustc-fs-h1` | `2.75rem` | h1 in content/split/toc |
| `--ustc-fs-h2` | `1.55rem` | h2 |
| `--ustc-fs-h3` | `1.3rem` | h3 (h2 in dense) |
| `--ustc-fs-table-cell` | `1.1rem` | td, th |
| `--ustc-fs-caption` | `1.1rem` | FigureBlock / TableBlock captions |
| `--ustc-fs-callout` | `1.15rem` | Callout body |
| `--ustc-fs-footnote` | `0.67rem` | footnote list items |
| `--ustc-lh` | `1.47` | default line-height (also settable via `lineHeight` prop) |

### Brand Colours

| Variable | Default |
|----------|---------|
| `--ustc-blue` | `#1E4C90` |
| `--ustc-blue-dark` | `#16396b` |
| `--ustc-blue-light` | `#2d5fa8` |
| `--ustc-blue-pale` | `rgba(30,76,144,0.07)` |
| `--ustc-blue-border` | `rgba(30,76,144,0.18)` |
| `--ustc-text` | `#111827` |
| `--ustc-text-muted` | `#6b7280` |

### Spacing

| Variable | Default |
|----------|---------|
| `--ustc-px` | `2.8rem` (horizontal padding) |
| `--ustc-py` | `1.75rem` (top padding) |
| `--ustc-pl` | `2.8rem` (left padding / footnote anchor) |
| `--ustc-footer-h` | `1.75rem` |
| `--ustc-footer-bg` | `#1E4C90` |
| `--ustc-nav-h` | auto-set by JS — do not override |

---

## Component Props

See [components.md](components.md) for full component prop tables.

---

## Quick Reference

| Goal | How |
|------|-----|
| Smaller body text globally | `--ustc-fs-body: 1.2rem` in `<style>` |
| Dense text on one slide | `density: dense` in frontmatter |
| Change brand colour | `--ustc-blue` + `--ustc-blue-dark` in `<style>` |
| Hide section bar on one slide | `sectionBar: false` in frontmatter |
| Dots-only section bar | `sectionBarMode: minimal` |
| Custom figure prefix | `figurePrefix: "Fig."` in global frontmatter |
| Layer Abs elements | `:z="20"` on top, `:z="10"` behind |
| Wider left column in split | `ratio: "3:1"` |
| Inline footnotes | `footnote: flow` |
| Absolute positioning | Prefer `<v-drag>`, use `<Abs>` for `%` coords |
