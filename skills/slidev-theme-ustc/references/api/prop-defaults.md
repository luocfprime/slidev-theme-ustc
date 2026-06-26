# Prop Defaults Reference

All default prop values come from `utils/defaults.ts`. When a prop is omitted, this is what the component or layout uses.

---

## Layout defaults (`bodyDefaults`)

Applies to `content` and `default` layouts. `split` extends this via `splitDefaults`.

| Prop         | Default     | Valid values                                                                                                              |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `density`    | `'normal'`  | `'normal'` · `'compact'` · `'dense'`                                                                                      |
| `margin`     | `'normal'`  | `'normal'` · `'tight'` · `'tighter'` · `'none'`                                                                           |
| `footnote`   | `'overlay'` | `'overlay'` · `'flow'`                                                                                                    |
| `sectionBar` | `true`      | boolean                                                                                                                   |
| `align`      | `'left'`    | `'left'` · `'center'` · `'right'`                                                                                         |
| `footer`     | `true`      | boolean                                                                                                                   |
| `footerMode` | `'full'`    | `'full'` · `'minimal'`                                                                                                    |
| `wip`        | `false`     | boolean — when `true` on slide frontmatter/layout props, renders a diagonal "WIP" stamp and tints the section-bar dot red |

`lineHeight` has no layout default. If omitted on a body slide, the layout uses
global first-slide `lineHeight` when present; otherwise the current density's
body line-height token applies. Values are unitless CSS line-height multipliers.

`flowGap` has no layout default. If omitted on a body slide, the layout uses
global first-slide `flowGap` when present; otherwise the current density's
`--ustc-component-gap` token applies. It controls vertical spacing between
adjacent top-level content blocks in `default` / `content` / `split` body slides,
including markdown tables, theme components, media components, Plotly blocks,
code fences, Mermaid diagrams, Typst output, and split-column top-level blocks.
Valid values: `'none'` (`0`), `'tight'` (`0.45rem`), `'normal'` (`0.75rem`),
`'loose'` (`1rem`), or a CSS length string such as `'0.6rem'`, `'8px'`, `'1em'`,
or `'5%'`.

`background` (CSS color or image path) is accepted by **every layout** — `cover`, `default` / `content`, `split`, `section`, `toc`, `end`, `backup`, `blank`. It has no default; omitted means no background. Only `cover` adds a built-in white gradient overlay for text readability; other layouts render the image raw. See SKILL.md → "Background images on any layout" for the manual overlay recipe.

`subtitle` (also accepted by `split`) has no default — omit to render no subtitle.

---

## Split layout defaults (`splitDefaults`)

Extends `bodyDefaults`. Additional props:

| Prop    | Default | Valid values                                      |
| ------- | ------- | ------------------------------------------------- |
| `ratio` | `'2:1'` | any `'N:M'` string                                |
| `gap`   | `'md'`  | `'sm'` (0.8rem) · `'md'` (1.4rem) · `'lg'` (2rem) |

---

## TOC layout defaults (`tocDefaults`)

Extends `footerDefaults`. Additional props:

| Prop        | Effective default | Valid values                              |
| ----------- | ----------------- | ----------------------------------------- |
| `variant`   | `'arrow'`         | `'arrow'` · `'classic'`                   |
| `highlight` | `0`               | 1-based section index; `0` = no highlight |
| `columns`   | unset             | `1` · `2`; only used by `variant: classic` |

Compatibility: when `variant` is omitted but `columns` is set, the layout uses
`variant: classic` so older decks keep their previous single/two-column TOC
appearance. When both are omitted, the layout uses the default `arrow` variant.

---

## Cover layout defaults (`coverDefaults`)

Extends `logoDefaults`.

| Prop         | Default                |
| ------------ | ---------------------- |
| `showLogo`   | `true`                 |
| `talkTitle`  | `'Presentation Title'` |
| `subtitle`   | `''`                   |
| `authors`    | `[]`                   |
| `conference` | `''`                   |
| `date`       | `''`                   |
| `background` | `''`                   |
| `wip`        | `false`                |

`presenterName` (default `undefined`, falls back to first author name) and `authorMarks` (default `{}`) are defined via `withDefaults` in `cover.vue` rather than in the `coverDefaults` object, but behave the same way.

---

## End layout defaults (`endDefaults`)

Extends `logoDefaults` + `footerDefaults`.

| Prop       | Default |
| ---------- | ------- |
| `showLogo` | `false` |

---

## Logo defaults (`logoDefaults`)

Used by `cover` and `end` layouts.

| Prop      | Default            |
| --------- | ------------------ |
| `logoSrc` | `'/ustc/logo.svg'` |
| `logoAlt` | `'USTC logo'`      |

---

## `<Grid>` defaults (`gridDefaults`)

| Prop     | Default | Valid values                                      |
| -------- | ------- | ------------------------------------------------- |
| `cols`   | `'2'`   | see Grid docs                                     |
| `gap`    | `'md'`  | `'sm'` (0.8rem) · `'md'` (1.4rem) · `'lg'` (2rem) |
| `alignY` | `'top'` | `'top'` · `'center'` · `'bottom'`                 |

---

## `<Callout>` defaults (`calloutDefaults`)

| Prop    | Default                  |
| ------- | ------------------------ |
| `type`  | `'note'`                 |
| `title` | `''` (no title rendered) |

---

## `<FigureBlock>` defaults (`figureDefaults`)

| Prop                | Default                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `alt`               | `''`                                                                                                    |
| `caption`           | `''` (no caption rendered)                                                                              |
| `width`             | `'100%'`                                                                                                |
| `imageWidth`        | `'100%'`                                                                                                |
| `captionAlign`      | `'center'`                                                                                              |
| `captionInsetLeft`  | `0`                                                                                                     |
| `captionInsetRight` | `0`                                                                                                     |
| `prefix`            | `''` (falls back to global `figurePrefix`)                                                              |
| `numberSuffix`      | `undefined` prop default; effective suffix is first-slide frontmatter `figureNumberSuffix`, then `'. '` |
| `wip`               | `false` — when `true`, renders a red WIP badge over the figure and `src` becomes optional               |

---

## `<TableBlock>` defaults (`tableDefaults`)

| Prop           | Default                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `caption`      | `''` (no caption rendered)                                                                             |
| `captionAlign` | `'center'`                                                                                             |
| `width`        | `'100%'`                                                                                               |
| `prefix`       | `''` (falls back to global `tablePrefix`)                                                              |
| `numberSuffix` | `undefined` prop default; effective suffix is first-slide frontmatter `tableNumberSuffix`, then `'. '` |
| `wip`          | `false` — when `true`, renders a red WIP badge inline with the caption                                 |

---

## `<VideoBlock>` defaults (`videoDefaults`)

| Prop                | Default                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `caption`           | `''` (no caption rendered)                                                               |
| `width`             | `'100%'`                                                                                 |
| `videoWidth`        | `'100%'`                                                                                 |
| `captionAlign`      | `'center'` (`'left'` · `'center'`)                                                       |
| `captionInsetLeft`  | `0`                                                                                      |
| `captionInsetRight` | `0`                                                                                      |
| `controls`          | `true`                                                                                   |
| `autoplay`          | `false` (forces `muted` when true)                                                       |
| `loop`              | `false`                                                                                  |
| `muted`             | `false`                                                                                  |
| `wip`               | `false` — when `true`, renders a red WIP badge over the video and `src` becomes optional |

---

## `<QRCode>` defaults (`qrcodeDefaults`)

| Prop         | Default                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `size`       | `160`                                                                                                                      |
| `color`      | `'#000000'`                                                                                                                |
| `background` | `'#ffffff'`                                                                                                                |
| `caption`    | `''`                                                                                                                       |
| `wip`        | `false` — when `true`, renders a hatched placeholder square + WIP badge instead of generating a QR; `url` becomes optional |
