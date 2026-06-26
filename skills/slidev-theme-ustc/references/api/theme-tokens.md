# CSS Variables Reference

For deck-wide overrides, put variables in a global stylesheet such as the deck's `styles/index.css`:

```css
:root {
  --ustc-blue: #1e4c90;
}
```

For per-slide overrides, set variables on a wrapper element so they cascade into that slide's content:

```vue
<div class="tight-slide">

Slide content...

</div>

<style>
.tight-slide {
  --ustc-lh: 1.65;
}
</style>
```

---

## Override safety — what's safe, what isn't

Most tokens are plain knobs you can set anywhere (`:root`, `.slidev-layout`, or a wrapper `<div class="…">`). A few have non-obvious behavior. Read this once before overriding.

### Don't override — internal or derived math

These are managed by theme code or computed from other tokens. A direct override breaks an invariant.

| Token          | Why                                                                                                                                                         | Override what instead                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `--ustc-nav-h` | Written by `global-top.vue` as `var(--ustc-nav-h-full)` or `var(--ustc-nav-h-minimal)` (or `0px`). Manual values get clobbered on every render.             | Override `--ustc-nav-h-full` / `--ustc-nav-h-minimal` instead.       |
| `--ustc-pb`    | `calc(var(--ustc-footer-h) + 0.9rem)` — bottom padding tracks footer height. A direct override drops the footer-clearance and lets content overlap the bar. | Change `--ustc-footer-h`, or re-derive with the same `calc(…)` form. |

### Override the dense variant, not the base

In dense mode the `.dense` class **reassigns** the base tokens below to their `*-dense` counterparts. So `density: dense` slides ignore your override of the base value. To affect both modes, override the `*-dense` variant _instead of_ (or _in addition to_) the base.

| Base token (re-pointed by `.dense`)                                                 | The `*-dense` token to override for dense mode                 |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `--ustc-fs-body`                                                                    | `--ustc-fs-body-dense`                                         |
| `--ustc-fs-h2` (becomes `--ustc-fs-h3` in dense — there is no `--ustc-fs-h2-dense`) | (override `--ustc-fs-h3`, or accept the auto-collapse)         |
| `--ustc-fs-table-cell`                                                              | `--ustc-fs-table-cell-dense`                                   |
| `--ustc-fs-blockquote`                                                              | `--ustc-fs-blockquote-dense`                                   |
| `--ustc-fs-caption`                                                                 | `--ustc-fs-caption-dense`                                      |
| `--ustc-fs-subtitle`                                                                | `--ustc-fs-subtitle-dense`                                     |
| `--ustc-fs-callout` / `--ustc-fs-callout-title`                                     | `--ustc-fs-callout-dense` / `--ustc-fs-callout-title-dense`    |
| `--ustc-fs-result-title` / `--ustc-fs-result-body`                                  | `--ustc-fs-result-title-dense` / `--ustc-fs-result-body-dense` |
| `--ustc-fs-block-title` / `--ustc-fs-block-body`                                    | `--ustc-fs-block-title-dense` / `--ustc-fs-block-body-dense`   |
| `--ustc-fs-takeaway`                                                                | `--ustc-fs-takeaway-dense`                                     |
| `--ustc-lh`                                                                         | `--ustc-lh-dense`                                              |
| `--ustc-component-gap`                                                              | `--ustc-component-gap-dense`                                   |
| `--ustc-title-gap`                                                                  | `--ustc-title-gap-dense`                                       |

### Inheritance shortcuts — override freely

These default to `var(--…)` for cohesion only. They are _not_ derived math; overriding them is intentionally supported.

| Token              | Default                   | Override when                                                              |
| ------------------ | ------------------------- | -------------------------------------------------------------------------- |
| `--ustc-footer-bg` | `var(--ustc-blue)`        | You want the footer to diverge from the brand color (e.g. neutral footer). |
| `--ustc-fs-end-h1` | `var(--ustc-fs-cover-h1)` | You want the closing slide title at a different size from the cover title. |

### Everything else — plain knobs

All tokens not listed above are straightforward overrides. Common targets:

- **Brand recolor** — override `--ustc-blue` and `--ustc-blue-dark` (and optionally `--ustc-blue-pale` / `--ustc-blue-border`) at `:root` in `styles/index.css`.
- **Smaller body text** — override `--ustc-fs-body` (and `--ustc-fs-body-dense` if you want dense slides to follow).
- **Tighter slides** — override `--ustc-py` / `--ustc-px` / `--ustc-pl` (or use the `margin:` frontmatter prop, which sets these for you).
- **Footer height/colors** — override `--ustc-footer-h` (cascades to `--ustc-pb`), `--ustc-footer-text`, `--ustc-footer-fs`.

---

## Brand Colors

| Variable              | Default                | Role                                                                                                  |
| --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `--ustc-blue`         | `#1E4C90`              | primary brand                                                                                         |
| `--ustc-blue-dark`    | `#16396b`              | headings                                                                                              |
| `--ustc-blue-pale`    | `rgba(30,76,144,0.07)` | light backgrounds                                                                                     |
| `--ustc-blue-border`  | `rgba(30,76,144,0.18)` | dividers                                                                                              |
| `--ustc-text`         | `#111827`              | body text                                                                                             |
| `--ustc-text-muted`   | `#6b7280`              | secondary text                                                                                        |
| `--ustc-text-light`   | `#9ca3af`              | tertiary text                                                                                         |
| `--ustc-footnote-ref` | `#7b8494`              | footnote superscript color                                                                            |
| `--ustc-wip`          | `#dc2626`              | WIP/draft markers — component badges plus frontmatter-driven slide watermark and section-bar dot ring |
| `--ustc-zoom-backdrop` | `rgba(0,0,0,0.85)`    | FigureBlock click-to-zoom lightbox overlay backdrop (when `figureZoom`/`zoomable` is on)               |

---

## Typography Scale — Content / Split Slides

| Variable                        | Default   | Role                                             |
| ------------------------------- | --------- | ------------------------------------------------ |
| `--ustc-fs-body`                | `1.4rem`  | p, li (normal density)                           |
| `--ustc-fs-body-dense`          | `1.05rem` | p, li (dense density)                            |
| `--ustc-fs-h1`                  | `2.75rem` | h1 in content/split/toc                          |
| `--ustc-fs-h2`                  | `1.55rem` | h2                                               |
| `--ustc-fs-h3`                  | `1.3rem`  | h3 (also h2 in dense mode)                       |
| `--ustc-fs-table-cell`          | `1.1rem`  | td, th (normal density)                          |
| `--ustc-fs-table-cell-dense`    | `0.96rem` | td, th (dense density)                           |
| `--ustc-fs-blockquote`          | `1.2rem`  | blockquote (normal density)                      |
| `--ustc-fs-blockquote-dense`    | `1rem`    | blockquote (dense density)                       |
| `--ustc-fs-caption`             | `1.1rem`  | figure/table captions (normal density)           |
| `--ustc-fs-caption-dense`       | `0.96rem` | figure/table captions (dense density)            |
| `--ustc-fs-subtitle`            | `1.15rem` | content layout subtitle (normal density)         |
| `--ustc-fs-subtitle-dense`      | `0.97rem` | content layout subtitle (dense density)          |
| `--ustc-fs-callout`             | `1.15rem` | Callout body (normal density)                    |
| `--ustc-fs-callout-dense`       | `0.95rem` | Callout body (dense density)                     |
| `--ustc-fs-callout-title`       | `1.15rem` | Callout title (normal density)                   |
| `--ustc-fs-callout-title-dense` | `0.95rem` | Callout title (dense density)                    |
| `--ustc-fs-result-title`        | `1.15rem` | ResultBox title (normal density)                 |
| `--ustc-fs-result-title-dense`  | `0.96rem` | ResultBox title (dense density)                  |
| `--ustc-fs-result-body`         | `1.15rem` | ResultBox body text (normal density)             |
| `--ustc-fs-result-body-dense`   | `0.96rem` | ResultBox body text (dense density)              |
| `--ustc-fs-block-title`         | `1.15rem` | Block title (normal density)                     |
| `--ustc-fs-block-title-dense`   | `0.96rem` | Block title (dense density)                      |
| `--ustc-fs-block-body`          | `1.15rem` | Block body text (normal density)                 |
| `--ustc-fs-block-body-dense`    | `0.96rem` | Block body text (dense density)                  |
| `--ustc-fs-takeaway`            | `1.4rem`  | Takeaway text (normal density)                   |
| `--ustc-fs-takeaway-dense`      | `1.05rem` | Takeaway text (dense density)                    |
| `--ustc-fs-footnote`            | `0.67rem` | footnote items                                   |
| `--ustc-fs-badge-scale`         | `0.68`   | `<Badge>` text scale relative to current body size |
| `--ustc-fs-badge`               | unset    | fixed `<Badge>` text-size override; bypasses density scaling |
| `--ustc-fs-footnote-ref`        | `0.64em`  | footnote superscript anchor (relative to parent) |

**Compact tier (`density: compact`).** Every `*-dense` token above has a parallel `*-compact` variant holding a value roughly halfway between the base and the dense value. The `.compact` class swaps them in exactly as `.dense` swaps the dense variants. Values: `--ustc-fs-body-compact` `1.22rem`, `--ustc-fs-h2-compact` `1.42rem`, `--ustc-fs-table-cell-compact` `1.03rem`, `--ustc-fs-blockquote-compact` `1.1rem`, `--ustc-fs-caption-compact` `1.03rem`, `--ustc-fs-subtitle-compact` `1.06rem`, `--ustc-fs-callout-compact` / `--ustc-fs-callout-title-compact` `1.05rem`, `--ustc-fs-result-title-compact` / `--ustc-fs-result-body-compact` `1.05rem`, `--ustc-fs-block-title-compact` / `--ustc-fs-block-body-compact` `1.05rem`, `--ustc-fs-takeaway-compact` `1.22rem`, `--ustc-lh-compact` `1.65`, `--ustc-component-gap-compact` `0.65rem`, `--ustc-title-gap-compact` `1.2rem`.

---

## Typography Scale — Structural Layouts

These apply to cover, end, section, and backup layouts (not overridden by dense mode).

| Variable                 | Default                   | Role                               |
| ------------------------ | ------------------------- | ---------------------------------- |
| `--ustc-fs-cover-h1`     | `3.5rem`                  | cover h1                           |
| `--ustc-fs-end-h1`       | `var(--ustc-fs-cover-h1)` | end h1 (inherits cover by default) |
| `--ustc-fs-cover-sub`    | `1.9rem`                  | cover subtitle                     |
| `--ustc-fs-cover-author` | `1.45rem`                 | author attribution line            |
| `--ustc-fs-cover-meta`   | `1.35rem`                 | date & conference/meeting line     |
| `--ustc-fs-cover-slot`   | `1.2rem`                  | cover slot / body text area        |
| `--ustc-fs-cover-aff`    | `1.1rem`                  | affiliations line                  |
| `--ustc-fs-section-h1`   | `3.4rem`                  | section & backup h1                |
| `--ustc-fs-section-sub`  | `1.22rem`                 | section/backup subtitle paragraph  |
| `--ustc-fs-end-contact`  | `1rem`                    | end slide contact info             |

---

## Line Heights

| Variable               | Default | Role                                         |
| ---------------------- | ------- | -------------------------------------------- |
| `--ustc-lh`            | `1.8`   | default line-height for body text (unitless) |
| `--ustc-lh-dense`      | `1.5`   | line-height for body text in dense mode      |
| `--ustc-lh-heading`    | `1.1`   | h1/h2/h3 heading line-height                 |
| `--ustc-lh-caption`    | `1.35`  | figure/table captions                        |
| `--ustc-lh-table`      | `1.38`  | td, th                                       |
| `--ustc-lh-blockquote` | `1.5`   | blockquote                                   |
| `--ustc-lh-footnote`   | `1.28`  | footnote items                               |

---

## Font Weight

| Variable             | Default | Role                                                |
| -------------------- | ------- | --------------------------------------------------- |
| `--ustc-fw-semibold` | `650`   | semibold weight (variable font; falls back to bold) |

---

## Spacing

| Variable                 | Default                               | Role                                                             |
| ------------------------ | ------------------------------------- | ---------------------------------------------------------------- |
| `--ustc-px`              | `2.8rem`                              | right padding (content/split/toc)                                |
| `--ustc-py`              | `1.75rem`                             | top padding                                                      |
| `--ustc-pl`              | `2.8rem`                              | left padding (also anchors footnote overlay)                     |
| `--ustc-pb`              | `calc(var(--ustc-footer-h) + 0.9rem)` | bottom padding (footer-aware — see _Override safety_ above)      |
| `--ustc-section-py`      | `2.5rem`                              | top padding for section/backup layouts                           |
| `--ustc-section-px`      | `3.5rem`                              | right padding for section/backup layouts                         |
| `--ustc-section-pl`      | `4.8rem`                              | left padding for section/backup layouts                          |
| `--ustc-title-gap`       | `1.5rem`                              | gap between h1 and first content element (content/split layouts) |
| `--ustc-title-gap-dense` | `0.9rem`                              | gap between h1 and first content element — dense mode            |
| `--ustc-component-gap`   | `0.75rem`                             | gap between top-level flow blocks in content/split layouts       |
| `--ustc-component-gap-dense` | `0.55rem`                         | top-level flow block gap — dense mode                            |
| `--ustc-fig-caption-gap` | `0.75rem`                             | gap between figure image and its caption (inside FigureBlock)    |
| `--ustc-tab-caption-gap` | `0.3rem`                              | gap between table caption and the table (inside TableBlock)      |

`lineHeight` and `flowGap` frontmatter are the preferred knobs for body rhythm.
Set them in first-slide global frontmatter for deck-wide defaults, then override
per body slide as needed. `flowGap` writes `--ustc-component-gap` on the layout
root, so an explicit frontmatter value wins over density's normal/compact/dense
gap swap for that slide. Covered flow blocks include theme components, media
components, code fences, Mermaid diagrams, Plotly blocks, Typst output, and
split-column top-level blocks.

### Margin presets

Set via `margin:` frontmatter prop — these map to the spacing variables:

| `margin`           | `--ustc-px` | `--ustc-pl` | `--ustc-py` |
| ------------------ | ----------- | ----------- | ----------- |
| `normal` (default) | 2.8rem      | 2.8rem      | 1.75rem     |
| `tight`            | 2.0rem      | 2.0rem      | 1.25rem     |
| `tighter`          | 1.2rem      | 1.2rem      | 0.8rem      |
| `none`             | 0rem        | 0rem        | 0rem        |

---

## Max-Width Constraints

| Variable                  | Default | Role                                                  |
| ------------------------- | ------- | ----------------------------------------------------- |
| `--ustc-max-w-h1`         | `58rem` | h1 readable width (section, backup)                   |
| `--ustc-max-w-sub`        | `48rem` | subtitle / body paragraph max width (section, backup) |
| `--ustc-max-w-cover-h1`   | `48rem` | cover h1 max width (independent token)                |
| `--ustc-max-w-cover-sub`  | `58rem` | cover subtitle max width (independent token)          |
| `--ustc-max-w-cover-slot` | `50rem` | cover slot / body text area max width                 |

---

## Footnotes

| Variable                 | Default | Role                                                 |
| ------------------------ | ------- | ---------------------------------------------------- |
| `--ustc-footnotes-max-h` | `22%`   | footnote overlay max visible height before scrolling |

---

## Footer Bar

| Variable             | Default                  | Role              |
| -------------------- | ------------------------ | ----------------- |
| `--ustc-footer-h`    | `1.75rem`                | footer height     |
| `--ustc-footer-bg`   | `var(--ustc-blue)`       | footer background |
| `--ustc-footer-text` | `rgba(255,255,255,0.88)` | footer text color |
| `--ustc-footer-fs`   | `0.74rem`                | footer font size  |

---

## Section Bar

| Variable               | Default                  | Role                                                                                     |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| `--ustc-nav-h`         | `0px`, set automatically | resolved height — **do not override manually**; override the two variables below instead |
| `--ustc-nav-h-full`    | `2rem`                   | bar height in full mode (labels + dots)                                                  |
| `--ustc-nav-h-minimal` | `1.5rem`                 | bar height in minimal mode (dots only)                                                   |

`--ustc-nav-h` is written by `global-top.vue` as `var(--ustc-nav-h-full)`, `var(--ustc-nav-h-minimal)`, or `0px` depending on `sectionBar` / `sectionBarMode`. To change the bar height, override the appropriate size variable in `:root`:

```css
:root {
  --ustc-nav-h-full: 2.5rem;
}
```

---

## Box

| Variable                  | Default              | Role                                                                                                          |
| ------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--ustc-box-border-color` | `var(--ustc-blue)`   | border color when `border` is `true` — defaults to full USTC blue (`#1e4c90`) for a clean, clearly-visible edge |
| `--ustc-box-border-width` | `3px`                | border width                                                                                                  |
| `--ustc-box-padding`      | `0.55rem 0.9rem`     | inner padding — intentionally tighter than `Block` to read as a divider rather than a card                    |
| `--ustc-box-bg-gray`      | `#f5f5f5`            | soft-gray surface resolved by `<Box bg="gray-soft">`; theme's neutral surface color, not tied to USTC blue    |

Override these in `:root` to retheme `<Box>` globally; component call sites do not need to change.
