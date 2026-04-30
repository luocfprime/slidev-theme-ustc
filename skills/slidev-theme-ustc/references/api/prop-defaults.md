# Prop Defaults Reference

All default prop values come from `utils/defaults.ts`. When a prop is omitted, this is what the component or layout uses.

---

## Layout defaults (`bodyDefaults`)

Applies to `content` and `default` layouts. `split` extends this via `splitDefaults`.

| Prop | Default | Valid values |
|------|---------|-------------|
| `density` | `'normal'` | `'normal'` · `'dense'` |
| `margin` | `'normal'` | `'normal'` · `'tight'` · `'tighter'` · `'none'` |
| `footnote` | `'overlay'` | `'overlay'` · `'flow'` |
| `sectionBar` | `true` | boolean |
| `align` | `'left'` | `'left'` · `'center'` · `'right'` |
| `footer` | `true` | boolean |
| `footerMode` | `'full'` | `'full'` · `'minimal'` |
| `wip` | `false` | boolean — when `true` on slide frontmatter/layout props, renders a diagonal "WIP" stamp and tints the section-bar dot red |

`lineHeight` and `background` have no default (omitted = unchanged).

`subtitle` (also accepted by `split`) has no default — omit to render no subtitle.

---

## Split layout defaults (`splitDefaults`)

Extends `bodyDefaults`. Additional props:

| Prop | Default | Valid values |
|------|---------|-------------|
| `ratio` | `'2:1'` | any `'N:M'` string |
| `gap` | `'md'` | `'sm'` (0.8rem) · `'md'` (1.4rem) · `'lg'` (2rem) |

---

## TOC layout defaults (`tocDefaults`)

Extends `footerDefaults`. Additional props:

| Prop | Default | Valid values |
|------|---------|-------------|
| `highlight` | `0` | 1-based section index; `0` = no highlight |
| `columns` | `1` | `1` · `2` |

---

## Cover layout defaults (`coverDefaults`)

Extends `logoDefaults`.

| Prop | Default |
|------|---------|
| `showLogo` | `true` |
| `talkTitle` | `'Presentation Title'` |
| `subtitle` | `''` |
| `presenter` | `undefined` (falls back to first author name) |
| `authors` | `[]` |
| `authorMarks` | `{}` |
| `conference` | `''` |
| `date` | `''` |
| `background` | `''` |

---

## End layout defaults (`endDefaults`)

Extends `logoDefaults` + `footerDefaults`.

| Prop | Default |
|------|---------|
| `showLogo` | `false` |

---

## Logo defaults (`logoDefaults`)

Used by `cover` and `end` layouts.

| Prop | Default |
|------|---------|
| `logoSrc` | `'/ustc/logo.svg'` |
| `logoAlt` | `'USTC logo'` |

---

## `<Grid>` defaults (`gridDefaults`)

| Prop | Default | Valid values |
|------|---------|-------------|
| `cols` | `'2'` | see Grid docs |
| `gap` | `'md'` | `'sm'` (0.8rem) · `'md'` (1.4rem) · `'lg'` (2rem) |
| `alignY` | `'top'` | `'top'` · `'center'` · `'bottom'` |

---

## `<Callout>` defaults (`calloutDefaults`)

| Prop | Default |
|------|---------|
| `type` | `'note'` |
| `title` | `''` (no title rendered) |

---

## `<FigureBlock>` defaults (`figureDefaults`)

| Prop | Default |
|------|---------|
| `alt` | `''` |
| `caption` | `''` (no caption rendered) |
| `width` | `'100%'` |
| `imageWidth` | `'100%'` |
| `captionAlign` | `'center'` |
| `captionInsetLeft` | `0` |
| `captionInsetRight` | `0` |
| `prefix` | `''` (falls back to global `figurePrefix`) |
| `numberSuffix` | `undefined` prop default; effective suffix is first-slide frontmatter `figureNumberSuffix`, then `'. '` |
| `wip` | `false` — when `true`, renders a red WIP badge over the figure and `src` becomes optional |

---

## `<TableBlock>` defaults (`tableDefaults`)

| Prop | Default |
|------|---------|
| `caption` | `''` (no caption rendered) |
| `captionAlign` | `'center'` |
| `width` | `'100%'` |
| `prefix` | `''` (falls back to global `tablePrefix`) |
| `numberSuffix` | `undefined` prop default; effective suffix is first-slide frontmatter `tableNumberSuffix`, then `'. '` |
| `wip` | `false` — when `true`, renders a red WIP badge inline with the caption |

---

## `<VideoBlock>` defaults (`videoDefaults`)

| Prop | Default |
|------|---------|
| `caption` | `''` (no caption rendered) |
| `width` | `'100%'` |
| `videoWidth` | `'100%'` |
| `captionAlign` | `'center'` (`'left'` · `'center'`) |
| `captionInsetLeft` | `0` |
| `captionInsetRight` | `0` |
| `controls` | `true` |
| `autoplay` | `false` (forces `muted` when true) |
| `loop` | `false` |
| `muted` | `false` |
| `wip` | `false` — when `true`, renders a red WIP badge over the video and `src` becomes optional |

---

## `<QRCode>` defaults (`qrcodeDefaults`)

| Prop | Default |
|------|---------|
| `size` | `160` |
| `color` | `'#000000'` |
| `background` | `'#ffffff'` |
| `caption` | `''` |
| `wip` | `false` — when `true`, renders a hatched placeholder square + WIP badge instead of generating a QR; `url` becomes optional |
