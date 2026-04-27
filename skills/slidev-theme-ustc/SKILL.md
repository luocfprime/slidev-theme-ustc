---
name: slidev-theme-ustc
description: Use when creating or editing Slidev presentations with the slidev-theme-ustc theme (USTC academic style). Covers available layouts, components, frontmatter props, CSS variables, and configuration options for this theme.
---

# slidev-theme-ustc

A clean academic Slidev theme for USTC-style presentations.

## Setup

```yaml
# In your slides.md frontmatter (first slide)
theme: ./          # local dev
# or
theme: @luocfprime/slidev-theme-ustc  # published
```

---

## Global Frontmatter

Set in the **first slide** of the deck:

```yaml
---
theme: ./
talkTitle: "Your Presentation Title"
conference: "CVPR 2025"
date: "June 2025"
authors:
  - Alice Chen: [USTC]
  - Bob Smith: [MIT, USTC]
  - Carol Lee: []

sectionBar: true            # show section progress bar (default: true)
sectionBarMode: full        # 'full' (labels+dots) | 'minimal' (dots only)
figurePrefix: Figure        # auto-numbering prefix for FigureBlock
tablePrefix: Table          # auto-numbering prefix for TableBlock
---
```

**Authors format:** array of `{ "Name": ["Inst1", "Inst2"] }` objects. First author = presenter (underlined on cover). Institutions get sequential superscript numbers in order of first appearance.

---

## Layouts

### `cover`

Title slide with author/affiliation display.

```yaml
---
layout: cover
talkTitle: "..."           # overrides global
subtitle: "..."
authors: [...]             # overrides global
conference: "..."
date: "..."
showLogo: true             # default: true
logoSrc: /ustc/logo.svg    # default
logoAlt: USTC logo         # default
background: "#1a2a4a"      # CSS color or image path
---
```

### `default`

Standard content slide (also the fallback when no `layout:` is specified).

```yaml
---
layout: default
density: normal            # 'normal' (default) | 'dense'
margin: normal             # 'normal' | 'tight' | 'tighter' | 'none'
lineHeight: 2.0           # override line-height for this slide
align: left                # 'left' | 'center' | 'right'
footnote: overlay          # 'overlay' (default) | 'flow'
footer: true
footerMode: full           # 'full' (default) | 'minimal'
sectionBar: true
sectionBarMode: full
background: "#f5f5f5"      # CSS color or image path
---
```

### `content`

Same as `default` plus a `subtitle` prop (rendered below h1, supports markdown). Use `content` when you want a subtitle; use `default` otherwise.

### `split`

Two-column layout.

```yaml
---
layout: split
ratio: "2:1"               # column width ratio (default: "2:1")
gap: md                    # 'sm' (0.8rem) | 'md' (1.4rem, default) | 'lg' (2rem) — different pixel values than Grid
# ...all default props also apply
---

# Slide Title

::left::
Left column content

::right::
Right column content
```

### `toc`

Auto-generated table of contents from `section` slides.

```yaml
---
layout: toc
highlight: 2               # 1-indexed section to highlight (0 = no highlight)
columns: 1                 # 1 (default) | 2
footer: true
footerMode: full
---
```

Sections are auto-numbered `§1`, `§2`, … using h1 text from each `section` slide (or `sectionLabel` if set).

### `section`

Section divider slide.

```yaml
---
layout: section
sectionLabel: "Short Label" # overrides h1 for TOC/section bar display
sectionBarMode: minimal     # per-slide bar override
footer: true
footerMode: full
---

# Full Section Title
```

### `end`

Closing/thank-you slide (centered content).

```yaml
---
layout: end
showLogo: false            # default: false
footer: true
footerMode: full
---

Thank you!

::contact::
name@ustc.edu.cn
```

The `::contact::` slot renders below the main content.

### `backup`

Appendix marker. Everything after this slide gets `A.N` page numbering in the footer.

```yaml
---
layout: backup
footer: true
---
```

### `blank`

Full-bleed canvas with no padding or chrome. Use with `<Abs>` for precise positioning.

```yaml
---
layout: blank
---
```

---

## Components

`Grid`, `Block`, `Abs` — layout helpers. `Callout`, `FigureBlock`, `TableBlock`, `ResultBox`, `Takeaway` — content blocks. `PlotlyGraph`, `QRCode` — media.

All are auto-imported by Slidev. For full prop tables see [references/components.md](references/components.md).

### When to use which content component

| Component | Semantic role | Typical use |
|-----------|--------------|-------------|
| `<Block>` | Generic named container | Definitions, lemmas, frameworks — any "labeled box" without emotional valence |
| `<Callout>` | Typed advisory notice with icon | Notes, tips, warnings, important caveats — when the *type* of message matters |
| `<Takeaway>` | The single most important point | One bold conclusion per slide; no props, forces brevity |
| `<ResultBox>` | Quantitative or formal result | Experimental numbers, theorem statements, final answers |

Rules of thumb: use `<Takeaway>` at most once per slide. `<Callout type="warning">` is for the audience, not the presenter. `<Block>` is neutral — reach for it when none of the others fit.

### Quick reference

```vue
<Grid cols="2" gap="md" align="top">...</Grid>
<Block title="Definition">...</Block>
<Callout type="tip" title="Insight">...</Callout>    <!-- types: note tip warning important example -->
<Takeaway>Key point.</Takeaway>
<ResultBox title="Result">...</ResultBox>
<FigureBlock src="/img.png" caption="Caption" width="80%" />
<FigureBlock src="/img.png" caption="Scheme" prefix="Scheme" />  <!-- shows "Scheme 2" if global counter is at 2 — prefix changes the label text, the global number stays -->
<TableBlock caption="Table title">| col | ... |</TableBlock>
<Abs x="200" y="100" w="300" :z="10">...</Abs>  <!-- x/y/w are the prop names, NOT top/left/width -->
<PlotlyGraph filePath="/chart.json" :graphWidth="600" :graphHeight="400" />
<QRCode url="https://example.com" :size="160" caption="Scan" />
```

---

## CSS Variables

Full variable reference: [references/css-variables.md](references/css-variables.md).

Key overridable variables:

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-blue` | `#1E4C90` | primary brand color |
| `--ustc-fs-body` | `1.4rem` | body text (normal density) |
| `--ustc-fs-body-dense` | `1.05rem` | body text (dense density) |
| `--ustc-lh` | `2.0` | line-height |
| `--ustc-px` / `--ustc-py` | `2.8rem` / `1.75rem` | slide padding |
| `--ustc-footer-h` | `1.75rem` | footer bar height |

---

## Common Patterns

### Dense slide (lots of content)

```yaml
---
layout: content
density: dense
margin: tight
---
```

`density: dense` is a coordinated scale-down — it simultaneously shrinks body text (`1.4rem` → `1.05rem`), Callout body (`1.15rem` → `0.95rem`), table cells, h2 (drops to h3 size `1.3rem`), and tightens line-height and list spacing. Use it instead of overriding font sizes in `<style>` because a `<style>` override changes one element in isolation and breaks the theme's internal proportions. Dense mode keeps the whole slide visually coherent at a smaller scale. Combine with `margin: tight` or `margin: tighter` to reclaim additional space.

### Two-column with unequal widths

```yaml
---
layout: split
ratio: "3:2"
gap: lg
---

# Title

::left::
Main content

::right::
Supporting figure or code
```

### TOC with section highlight

```yaml
---
layout: toc
highlight: 2      # highlight section 2
columns: 2
---
```

### Appendix slides

```yaml
---
layout: backup
---

# Backup Slides
```

All slides after this use `A.N` footer numbering.

### Figure + caption side by side

```vue
<Grid cols="1 1" gap="md" align="center">

<FigureBlock src="/img/a.png" caption="Method A" width="100%" />

<FigureBlock src="/img/b.png" caption="Method B" width="100%" />

</Grid>
```

### Footnotes in flow (not overlaid)

```yaml
---
footnote: flow
---

Content with footnote[^1]

[^1]: This appears in document flow, not overlaid at the bottom.
```

### Override section label for TOC

```yaml
---
layout: section
sectionLabel: "Short Name"
---

# Full Long Section Title Shown on Slide
```

The `sectionLabel` value is used in the TOC and section bar; the h1 is shown on the section slide itself.

---

## Footer Modes

**Full mode** (default): `author · title · meeting · date · page/total`

**Minimal mode**: `author · page/total`

Set globally:
```yaml
footerMode: minimal
```

Or per-slide to override:
```yaml
---
footerMode: minimal
---
```

---

## Section Bar

The section bar shows the presentation structure at the top of each slide.

- **Full mode:** section labels + dots per slide
- **Minimal mode:** dots only

Control globally:
```yaml
sectionBarMode: full      # or 'minimal'
sectionBar: false         # disable entirely
```

Hide on specific slides:
```yaml
---
sectionBar: false
---
```

The `--ustc-nav-h` CSS variable is set automatically to account for the bar height. Do not override it manually.

---

## Quick Reference

| Goal | How |
|------|-----|
| Smaller body text globally | `--ustc-fs-body: 1.2rem` in `<style>` |
| Dense text on one slide | `density: dense` in frontmatter |
| Change brand colour | `--ustc-blue` + `--ustc-blue-dark` in `<style>` |
| Hide section bar on one slide | `sectionBar: false` in frontmatter |
| Dots-only section bar | `sectionBarMode: minimal` |
| Custom figure/table prefix | `figurePrefix: "Fig."` / `tablePrefix: "Tab."` in global frontmatter |
| Layer Abs elements | `:z="20"` on top, `:z="10"` behind |
| Wider left column in split | `ratio: "3:1"` |
| Inline footnotes | `footnote: flow` |
| Absolute positioning | Prefer `<v-drag>`, use `<Abs>` for `%` coords |
| All valid prop values | See [references/components.md](references/components.md) |
| All CSS variables | See [references/css-variables.md](references/css-variables.md) |

---

## Additional Resources

- [references/components.md](references/components.md) — full prop tables for all components
- [references/defaults.md](references/defaults.md) — all prop default values (source: `utils/defaults.ts`)
- [references/css-variables.md](references/css-variables.md) — complete CSS variable reference
- [references/example.md](references/example.md) — canonical demo deck showing all layouts and components in use
