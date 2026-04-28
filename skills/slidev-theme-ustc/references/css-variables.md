# CSS Variables Reference

Override in your slides.md style block or per-slide `<style>` tags:

```vue
<style>
:root {
  --ustc-blue: #1E4C90;
}
</style>
```

---

## Brand Colors

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-blue` | `#1E4C90` | primary brand |
| `--ustc-blue-dark` | `#16396b` | headings |
| `--ustc-blue-pale` | `rgba(30,76,144,0.07)` | light backgrounds |
| `--ustc-blue-border` | `rgba(30,76,144,0.18)` | dividers |
| `--ustc-blue-row` | `rgba(30,76,144,0.09)` | table row separator |
| `--ustc-text` | `#111827` | body text |
| `--ustc-text-muted` | `#6b7280` | secondary text |
| `--ustc-text-light` | `#9ca3af` | tertiary text |
| `--ustc-footnote-ref` | `#7b8494` | footnote superscript color |

---

## Typography Scale — Content / Split Slides

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-fs-body` | `1.4rem` | p, li (normal density) |
| `--ustc-fs-body-dense` | `1.05rem` | p, li (dense density) |
| `--ustc-fs-h1` | `2.75rem` | h1 in content/split/toc |
| `--ustc-fs-h2` | `1.55rem` | h2 |
| `--ustc-fs-h3` | `1.3rem` | h3 (also h2 in dense mode) |
| `--ustc-fs-table-cell` | `1.1rem` | td, th (normal density) |
| `--ustc-fs-table-cell-dense` | `0.96rem` | td, th (dense density) |
| `--ustc-fs-blockquote` | `1.2rem` | blockquote (normal density) |
| `--ustc-fs-blockquote-dense` | `1rem` | blockquote (dense density) |
| `--ustc-fs-caption` | `1.1rem` | figure/table captions (normal density) |
| `--ustc-fs-caption-dense` | `0.96rem` | figure/table captions (dense density) |
| `--ustc-fs-subtitle` | `1.15rem` | content layout subtitle (normal density) |
| `--ustc-fs-subtitle-dense` | `0.97rem` | content layout subtitle (dense density) |
| `--ustc-fs-callout` | `1.15rem` | Callout body (normal density) |
| `--ustc-fs-callout-dense` | `0.95rem` | Callout body (dense density) |
| `--ustc-fs-callout-title` | `1.1rem` | Callout title |
| `--ustc-fs-result-title` | `1.05rem` | ResultBox title |
| `--ustc-fs-result-body` | `1.15rem` | ResultBox body text |
| `--ustc-fs-footnote` | `0.67rem` | footnote items |
| `--ustc-fs-footnote-ref` | `0.64em` | footnote superscript anchor (relative to parent) |

---

## Typography Scale — Structural Layouts

These apply to cover, end, section, and backup layouts (not overridden by dense mode).

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-fs-cover-h1` | `3.5rem` | cover & end h1 |
| `--ustc-fs-cover-sub` | `1.9rem` | cover subtitle |
| `--ustc-fs-cover-author` | `1.45rem` | author attribution line |
| `--ustc-fs-cover-meta` | `1.35rem` | date & conference/meeting line |
| `--ustc-fs-cover-slot` | `1.2rem` | cover slot / body text area |
| `--ustc-fs-cover-aff` | `1.1rem` | affiliations line |
| `--ustc-fs-section-h1` | `3.4rem` | section & backup h1 |
| `--ustc-fs-section-sub` | `1.22rem` | section/backup subtitle paragraph |
| `--ustc-fs-end-contact` | `1rem` | end slide contact info |

---

## Line Heights

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-lh` | `2.0` | default line-height for body text (unitless) |
| `--ustc-lh-heading` | `1.1` | h1 across all layouts |
| `--ustc-lh-caption` | `1.35` | figure/table captions |
| `--ustc-lh-table` | `1.38` | td, th |
| `--ustc-lh-blockquote` | `1.5` | blockquote |
| `--ustc-lh-footnote` | `1.28` | footnote items |

---

## Font Weight

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-fw-semibold` | `650` | semibold weight (variable font; falls back to bold) |

---

## Spacing

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-px` | `2.8rem` | right padding (content/split/toc) |
| `--ustc-py` | `1.75rem` | top padding |
| `--ustc-pl` | `2.8rem` | left padding (also anchors footnote overlay) |
| `--ustc-pb` | computed | bottom padding (footer-aware) |
| `--ustc-title-gap` | `1.2rem` | gap between h1 and first content element (content/split layouts) |
| `--ustc-fig-caption-gap` | `0.75rem` | gap between figure image and its caption (inside FigureBlock) |
| `--ustc-tab-caption-gap` | `0.3rem` | gap between table caption and the table (inside TableBlock) |

### Margin presets

Set via `margin:` frontmatter prop — these map to the spacing variables:

| `margin` | `--ustc-px` | `--ustc-py` |
|----------|-------------|-------------|
| `normal` (default) | 2.8rem | 1.75rem |
| `tight` | 2.0rem | 1.25rem |
| `tighter` | 1.2rem | 0.8rem |
| `none` | 0rem | 0rem |

---

## Max-Width Constraints

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-max-w-h1` | `58rem` | h1 readable width (cover, section, backup) |
| `--ustc-max-w-sub` | `48rem` | subtitle / body paragraph max width |

---

## Footnotes

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-footnotes-max-h` | `22%` | footnote overlay max visible height before scrolling |

---

## Footer Bar

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-footer-h` | `1.75rem` | footer height |
| `--ustc-footer-bg` | `var(--ustc-blue)` | footer background |
| `--ustc-footer-text` | `rgba(255,255,255,0.88)` | footer text color |
| `--ustc-footer-fs` | `0.74rem` | footer font size |

---

## Section Bar

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-nav-h` | set automatically | section bar height — **do not override manually** |

This variable is set by `global-top.vue` based on `sectionBarMode`:
- `'minimal'` → `1.5rem`
- `'full'` → `2rem`
- bar hidden → `0px`
