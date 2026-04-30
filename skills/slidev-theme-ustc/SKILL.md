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
presenter: "Alice Chen"     # name of the presenter (underlined on cover)
authors:
  - name: "Alice Chen"
    affiliations: ["University of Science and Technology of China"]
  - name: "Bob Smith"
    affiliations: ["MIT", "USTC"]
    marks: ["†"]
  - name: "Carol Lee"
    affiliations: ["Peking University"]
authorMarks:
  "†": "Equal contribution"

sectionBar: true            # show section progress bar (default: true)
sectionBarMode: full        # 'full' (labels+dots) | 'minimal' (dots only)
figurePrefix: Figure        # auto-numbering prefix for FigureBlock
tablePrefix: Table          # auto-numbering prefix for TableBlock
---
```

**Authors format:** array of `{ name, affiliations, marks? }` objects. `presenter` sets who is underlined (defaults to first author). Institutions get sequential superscript numbers in order of first appearance. `marks` are per-author symbols (e.g. `†`, `*`) displayed as superscripts after the institute number; `authorMarks` maps each symbol to its legend text (rendered below the affiliations line).

**Backward-compatible format** (still accepted): `{ "Name": ["Inst1", "Inst2"] }` dict objects — but the new format supports `marks` and `authorMarks`.

---

## Layouts

### `cover`

Title slide with author/affiliation display.

```yaml
---
layout: cover
talkTitle: "..."           # overrides global
subtitle: "..."
presenter: "Alice Chen"    # who to underline (default: first author)
authors: [...]             # overrides global; see structured format above
authorMarks:               # symbol → legend text
  "†": "Equal contribution"
  "*": "Corresponding author"
conference: "..."
date: "..."
showLogo: true             # default: true
logoSrc: /ustc/logo.svg    # default
logoAlt: USTC logo         # default
background: "#1a2a4a"      # CSS color or image path
---
```

### `default` / `content`

Standard body slide. `default` is the fallback when no `layout:` is specified; `content` is an identical alias commonly used to signal a body slide explicitly. Both accept the same props.

```yaml
---
layout: default            # or 'content'
density: normal            # 'normal' (default) | 'dense'
margin: normal             # 'normal' | 'tight' | 'tighter' | 'none'
lineHeight: 1.8            # optional override; matches default body line-height
align: left                # 'left' | 'center' | 'right'
footnote: overlay          # 'overlay' (default) | 'flow'
footer: true
footerMode: full           # 'full' (default) | 'minimal'
sectionBar: true
sectionBarMode: full
subtitle: "..."            # optional, renders below h1 (supports markdown)
background: "#f5f5f5"      # CSS color or image path
---
```

### `split`

Two-column layout.

```yaml
---
layout: split
ratio: "2:1"               # column width ratio (default: "2:1")
gap: md                    # 'sm' (0.8rem) | 'md' (1.4rem, default) | 'lg' (2rem)
subtitle: "..."            # optional, renders below h1 — same as content layout
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

`Grid`, `Block`, `Abs` — layout helpers. `Callout`, `FigureBlock`, `TableBlock`, `ResultBox`, `Takeaway` — content blocks. `VideoBlock`, `PlotlyGraph`, `QRCode` — media.

All are auto-imported by Slidev. For full prop tables see [references/api/components.md](references/api/components.md).

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
<Grid cols="2" gap="md" alignY="top">...</Grid>
<Block title="Definition">...</Block>
<Callout type="tip" title="Insight">...</Callout>    <!-- types: note tip warning important example -->
<Takeaway>Key point.</Takeaway>
<ResultBox title="Result">...</ResultBox>
<FigureBlock src="/img.png" caption="Caption" width="80%" />
<FigureBlock src="/img.png" caption="Scheme" prefix="Scheme" />  <!-- shows "Scheme 2" if global counter is at 2 — prefix changes the label text, the global number stays -->
<FigureBlock wip src="https://placehold.co/800x600" caption="Not ready yet" />  <!-- red WIP badge; use placehold.co to hold the correct aspect ratio -->
<TableBlock caption="Table title">| col | ... |</TableBlock>
<TableBlock wip caption="Table title">| col | ... |</TableBlock>  <!-- red WIP badge inline after caption -->
<Abs x="200" y="100" w="300" :z="10">...</Abs>  <!-- x/y/w are the prop names, NOT top/left/width -->
<VideoBlock src="/videos/demo.mp4" caption="Demo" width="80%" :controls="true" />
<PlotlyGraph filePath="/chart.json" :graphWidth="600" :graphHeight="400" />
<QRCode url="https://example.com" :size="160" caption="Scan" />
```

---

## Design Principles

The theme exposes many features (subtitle, dense mode, section bar, footnotes, Callout types, etc.) so a deck *can* match a specific need — not so every deck *must* use all of them. Plain markdown on a `default` layout is often the strongest slide.

- **Subtitle is optional.** Add `subtitle:` only when the title is genuinely ambiguous. (`default`/`content` are aliases — both accept `subtitle:`; pick whichever name reads better in your frontmatter.)
- **Don't stack components.** One `<Block>` *or* one `<Callout>` *or* one `<Takeaway>` reads better than all three. Reach for a component only when its semantic role fits — wrapping every paragraph in something is a smell.
- **Dense mode is for content pressure, not aesthetics.** If the slide already fits in `density: normal`, don't switch to `dense`. If the problem is page padding rather than text size, try `margin: tight` first.
- **Toggle, don't litter.** Disable `sectionBar`/`footer` per-slide for cover, end, blank, and full-bleed visuals — not casually elsewhere.
- **Climb the precedence ladder for one-off styling**: frontmatter prop → CSS variable override in a slide `<style>` block → wrap the component in a plain `<div style="…">`. Two scoping levels for CSS variable overrides: (a) `.my-scope { --var }` on a wrapper `<div>` — only that subtree changes; (b) `.slidev-layout { --var }` — the entire slide including h1, footer, and section bar. For deck-wide overrides, put `:root { --var }` in `styles/index.css`. If none of these fit, **propose a feature request or PR against the theme repo** — **never edit the installed theme files** (e.g. `node_modules/@luocfprime/slidev-theme-ustc/…`). Those files are outside project scope: they get wiped on every reinstall, the change does not version-control with your deck, and the deck silently forks from upstream.

See [references/design-guide.md](references/design-guide.md) for fine-tuning recipes (width limits, gutter columns, scoped overrides) and a "when NOT to use" table per feature.

---

## CSS Variables

Full variable reference: [references/api/theme-tokens.md](references/api/theme-tokens.md).

Key overridable variables:

| Variable | Default | Role |
|----------|---------|------|
| `--ustc-blue` | `#1E4C90` | primary brand color |
| `--ustc-fs-body` | `1.4rem` | body text (normal density) |
| `--ustc-fs-body-dense` | `1.05rem` | body text (dense density) |
| `--ustc-fs-callout` / `--ustc-fs-callout-title` | `1.15rem` / `1.15rem` | Callout body/title |
| `--ustc-fs-result-title` / `--ustc-fs-result-body` | `1.15rem` / `1.15rem` | ResultBox title/body |
| `--ustc-fs-block-title` / `--ustc-fs-block-body` | `1.15rem` / `1.15rem` | Block title/body |
| `--ustc-fs-takeaway` | `1.4rem` | Takeaway text |
| `--ustc-lh` | `1.8` | body text line-height |
| `--ustc-title-gap` | `1.5rem` | h1 to first body element gap |
| `--ustc-px` / `--ustc-py` | `2.8rem` / `1.75rem` | slide padding |
| `--ustc-max-w-cover-h1` / `--ustc-max-w-cover-sub` | `48rem` / `58rem` | cover title/subtitle width |
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

`density: dense` is a coordinated scale-down — it simultaneously shrinks body text (`1.4rem` → `1.05rem`), Callout body/title (`1.15rem` → `0.95rem`), ResultBox and Block text (`1.15rem` → `0.96rem`), table cells (`1.1rem` → `0.96rem`), h2 (drops to h3 size `1.3rem`), Takeaway text (`1.4rem` → `1.05rem`), and tightens line-height (`1.8` → `1.5`) plus list spacing. Use it instead of overriding font sizes in `<style>` because a `<style>` override changes one element in isolation and breaks the theme's internal proportions. Dense mode keeps the whole slide visually coherent at a smaller scale. Combine with `margin: tight` or `margin: tighter` to reclaim additional page padding.

### Limit a component's width

Wrap the component in a plain `<div style="…">` — inline `style` on a raw `<div>` is bulletproof. Don't try to pass `style` or `class` directly to a theme component in markdown: Slidev's `<style>` blocks are auto-scoped (so `.my-class` on the component root often doesn't match), and attribute passthrough on theme components in markdown is unreliable.

```vue
<Grid cols="2" gap="lg">
  <Block title="A">…</Block>
  <div style="justify-self: center; max-width: 26rem;">
    <Block title="B">…</Block>
  </div>
</Grid>
```

For consistent inset width across slides, prefer gutter columns: `<Grid cols="1 8 8 1">` with empty `<div>`s on the edges.

For equal-height items, replace the theme `<Grid>` with raw native CSS Grid — `<Grid>` defaults to `align-items: start`, native Grid defaults to `stretch`:

```vue
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem;">
  <Block>…</Block>
  <Callout type="tip">…</Callout>
  <ResultBox>…</ResultBox>
</div>
```

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
<Grid cols="1 1" gap="md" alignY="center">

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

The section bar shows the presentation structure at the top of body slides. Only `content` / `default` / `split` slides render the bar; `cover`, `end`, `toc`, `section`, `blank`, and `backup` slides never show it (so `sectionBar: false` only matters on body layouts).

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
| Smaller body text globally | `:root { --ustc-fs-body: 1.2rem }` in `styles/index.css`, or `.slidev-layout { --ustc-fs-body: 1.2rem }` per slide |
| Dense text on one slide | `density: dense` in frontmatter |
| Change brand colour per slide | `.slidev-layout { --ustc-blue-dark: #... }` in slide `<style>` — reaches h1, footer, and section bar |
| Hide section bar on one slide | `sectionBar: false` in frontmatter |
| Dots-only section bar | `sectionBarMode: minimal` |
| Custom figure/table prefix | `figurePrefix: "Fig."` / `tablePrefix: "Tab."` in global frontmatter |
| Layer Abs elements | `:z="20"` on top, `:z="10"` behind |
| Wider left column in split | `ratio: "3:1"` |
| Inline footnotes | `footnote: flow` |
| One-off width / spacing tweak | Wrap the component in `<div style="…">`; don't passthrough to the theme component |
| Equal-height items | Use raw native CSS Grid instead of `<Grid>` — see [design-guide.md](references/design-guide.md#force-equal-height-in-a-grid) |
| Absolute positioning | Prefer `<v-drag>`, use `<Abs>` for `%` coords |
| All valid prop values | See [references/api/components.md](references/api/components.md) |
| All CSS variables | See [references/api/theme-tokens.md](references/api/theme-tokens.md) |

---

## Additional Resources

- [references/api/components.md](references/api/components.md) — full prop tables for all components
- [references/api/prop-defaults.md](references/api/prop-defaults.md) — all prop default values (source: `utils/defaults.ts`)
- [references/api/theme-tokens.md](references/api/theme-tokens.md) — complete CSS variable reference
- [references/examples/full-deck.md](references/examples/full-deck.md) — canonical demo deck showing all layouts and components in use
- [references/design-guide.md](references/design-guide.md) — design principles, layout fine-tuning recipes, "when NOT to use" table per feature

Runnable demo decks under `references/examples/` (each runs with `slidev examples/<name>.md`):

- [references/examples/layouts.md](references/examples/layouts.md) — every layout's full frontmatter options
- [references/examples/components.md](references/examples/components.md) — every component's prop demos
- [references/examples/math.md](references/examples/math.md) — math rendering across positions and components
- [references/examples/tweaks.md](references/examples/tweaks.md) — fine-tuning recipes (before/after pages, companion to `design-guide.md`)
