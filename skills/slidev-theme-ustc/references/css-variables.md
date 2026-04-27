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
| `--ustc-blue-light` | `#2d5fa8` | hover |
| `--ustc-blue-pale` | `rgba(30,76,144,0.07)` | light backgrounds |
| `--ustc-blue-border` | `rgba(30,76,144,0.18)` | dividers |
| `--ustc-text` | `#111827` | body text |
| `--ustc-text-muted` | `#6b7280` | secondary text |
| `--ustc-text-light` | `#9ca3af` | tertiary text |

---

## Typography Scale

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-fs-body` | `1.4rem` | p, li (normal density) |
| `--ustc-fs-body-dense` | `1.05rem` | p, li (dense density) |
| `--ustc-fs-h1` | `2.75rem` | h1 in content/split/toc |
| `--ustc-fs-h2` | `1.55rem` | h2 |
| `--ustc-fs-h3` | `1.3rem` | h3 (also h2 in dense mode) |
| `--ustc-fs-table-cell` | `1.1rem` | td, th |
| `--ustc-fs-caption` | `1.1rem` | figure/table captions |
| `--ustc-fs-callout` | `1.15rem` | Callout body (normal) |
| `--ustc-fs-callout-dense` | `0.95rem` | Callout body (dense) |
| `--ustc-fs-blockquote` | `1.2rem` | blockquote |
| `--ustc-fs-footnote` | `0.67rem` | footnote items |
| `--ustc-lh` | `1.47` | default line-height (unitless) |
| `--ustc-fw-semibold` | `650` | semibold weight (variable font) |

---

## Spacing

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-px` | `2.8rem` | horizontal padding |
| `--ustc-py` | `1.75rem` | top padding |
| `--ustc-pl` | `2.8rem` | left padding (footnote anchor) |
| `--ustc-pb` | computed | bottom padding (footer-aware) |

### Margin presets

Set via `margin:` frontmatter prop — these map to the spacing variables:

| `margin` | `--ustc-px` | `--ustc-py` |
|----------|-------------|-------------|
| `normal` (default) | 2.8rem | 1.75rem |
| `tight` | 2.0rem | 1.25rem |
| `tighter` | 1.2rem | 0.8rem |
| `none` | 0rem | 0rem |

---

## Footer Bar

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-footer-h` | `1.75rem` | footer height |
| `--ustc-footer-bg` | `#1E4C90` | footer background |
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
