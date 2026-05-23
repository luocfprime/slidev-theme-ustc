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
talkTitle: 'Your Presentation Title'
conference: 'CVPR 2025'
date: 'June 2025'
presenterName: 'Alice Chen' # name of the presenter (underlined on cover); use `presenterName`, not `presenter` — Slidev reserves `presenter` for its built-in presenter-mode option
authors:
  - name: 'Alice Chen'
    affiliations: ['University of Science and Technology of China']
  - name: 'Bob Smith'
    affiliations: ['MIT', 'USTC']
    marks: ['†']
  - name: 'Carol Lee'
    affiliations: ['Peking University']
authorMarks:
  '†': 'Equal contribution'

sectionBar: true # show section progress bar (default: true)
sectionBarMode: full # 'full' (labels + progress indicator) | 'minimal' (indicator only) | 'labels' (labels only)
figurePrefix: Figure # auto-numbering prefix for FigureBlock
tablePrefix: Table # auto-numbering prefix for TableBlock
figureNumberSuffix: ': ' # suffix between FigureBlock number and caption
tableNumberSuffix: ': ' # suffix between TableBlock number and caption
---
```

**Authors format:** array of `{ name, affiliations, marks? }` objects. `presenterName` sets who is underlined (defaults to first author). Institutions get sequential superscript numbers in order of first appearance. `marks` are per-author symbols (e.g. `†`, `*`) displayed as superscripts after the institute number; `authorMarks` maps each symbol to its legend text (rendered below the affiliations line).

---

## Layouts

### `cover`

Title slide with author/affiliation display.

```yaml
---
layout: cover
talkTitle: '...' # overrides global
subtitle: '...'
presenterName: 'Alice Chen' # who to underline (default: first author)
authors: [...] # overrides global; see structured format above
authorMarks: # symbol → legend text
  '†': 'Equal contribution'
  '*': 'Corresponding author'
conference: '...'
date: '...'
showLogo: true # default: true
logoSrc: /ustc/logo.svg # default
logoAlt: USTC logo # default
background: '#1a2a4a' # CSS color or image path
---
```

### `default` / `content`

Standard body slide. `default` is the fallback when no `layout:` is specified; `content` is an identical alias commonly used to signal a body slide explicitly. Both accept the same props.

```yaml
---
layout: default # or 'content'
density: normal # 'normal' (default) | 'dense'
margin: normal # 'normal' | 'tight' | 'tighter' | 'none'
lineHeight: 1.8 # optional override; matches default body line-height
align: left # 'left' | 'center' | 'right'
footnote: overlay # 'overlay' (default) | 'flow'
footer: true
footerMode: full # 'full' (default) | 'minimal'
sectionBar: true
sectionBarMode: full
subtitle: '...' # optional, renders below h1 (supports markdown)
background: '#f5f5f5' # CSS color or image path
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
highlight: 2 # 1-indexed section to highlight (0 = no highlight)
columns: 1 # 1 (default) | 2
footer: true
footerMode: full
background: '#f5f5f5' # optional, CSS color or image path
---

# Contents   # optional — defaults to "Table of Contents" if omitted
```

The `# Title` line is **optional**. If omitted, the layout renders "Table of Contents" as the heading automatically. Write `# 目录` (or any text) to override it.

Sections are auto-numbered `§1`, `§2`, … using h1 text from each `section` slide (or `sectionLabel` if set).

### `section`

Section divider slide.

```yaml
---
layout: section
sectionLabel: 'Short Label' # overrides h1 for TOC/section bar display
sectionBarMode: minimal # per-slide bar override
footer: true
footerMode: full
background: '/bg-section.jpg' # optional, CSS color or image path
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
background: '#1a2a4a'      # optional, CSS color or image path
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
background: '#f5f5f5' # optional, CSS color or image path
---
```

### `blank`

Full-bleed canvas with no padding or chrome. Use with `<Abs>` for precise positioning.

```yaml
---
layout: blank
background: '/bg-fullbleed.jpg' # optional, CSS color or image path
---
```

### Background images on any layout

Every layout (`cover`, `default` / `content`, `split`, `section`, `toc`, `end`, `backup`, `blank`) accepts the same `background:` frontmatter — either a CSS color (`#1a2a4a`, `rgb(...)`, named colors) or an image path (`/bg.jpg`, `https://...`). Images render at `background-size: cover; background-position: center`.

**Readability — overlay behavior differs by layout:**

- `cover` automatically adds a left-to-right white gradient (`rgba(255,255,255,1)` → `rgba(255,255,255,0.85)`) on top of the image so the left-aligned title/authors stay readable.
- All other layouts render the image **raw, with no overlay**. If body text starts becoming hard to read on a busy image, add an overlay manually in the slide's `<style>` block:

```vue
<style>
.slidev-layout {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)),
    url('/bg.jpg');
  background-size: cover;
  background-position: center;
}
</style>
```

This overrides the `background-image` produced by the frontmatter, so you can drop the `background:` prop on the slide if you're styling it manually. The same trick works for tinted color overlays (`linear-gradient(rgba(30,76,144,0.4), rgba(30,76,144,0.4))`) when the image is light and you want a brand-tinted wash.

---

## Components

`Grid`, `Block`, `Abs` — layout helpers. `Callout`, `FigureBlock`, `TableBlock`, `ResultBox`, `Takeaway` — content blocks. `VideoBlock`, `PlotlyGraph`, `QRCode` — media.

All are auto-imported by Slidev. For full prop tables see [references/api/components.md](references/api/components.md).

### When to use which content component

| Component     | Semantic role                   | Typical use                                                                   |
| ------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `<Block>`     | Generic named container         | Definitions, lemmas, frameworks — any "labeled box" without emotional valence |
| `<Callout>`   | Typed advisory notice with icon | Notes, tips, warnings, important caveats — when the _type_ of message matters |
| `<Takeaway>`  | The single most important point | One bold conclusion per slide; no props, forces brevity                       |
| `<ResultBox>` | Quantitative or formal result   | Experimental numbers, theorem statements, final answers                       |

Rules of thumb: use `<Takeaway>` at most once per slide. `<Callout type="warning">` is for the audience, not the presenter. `<Block>` is neutral — reach for it when none of the others fit.

### Quick reference

```vue
<Grid cols="2" gap="md" alignY="top">...</Grid>
<Block title="Definition">...</Block>
<Callout type="tip" title="Insight">...</Callout>
<!-- types: note tip warning important example -->
<Takeaway>Key point.</Takeaway>
<ResultBox title="Result">...</ResultBox>
<FigureBlock src="/img.png" caption="Caption" width="80%" />
<FigureBlock src="/img.png" caption="Scheme" prefix="Scheme" />
<!-- shows "Scheme 2" if global counter is at 2 — prefix changes the label text, the global number stays -->
<FigureBlock wip src="https://placehold.co/800x600" caption="Not ready yet" />
<!-- red WIP badge; use placehold.co to hold the correct aspect ratio -->
<!-- #caption slot for footnote refs / links / Vue components — REQUIRES blank lines around <template> and its content for Slidev to process inside as markdown -->
<FigureBlock src="/img.png" width="60%">

<template #caption>

Caption with [^1] footnote ref

</template>

</FigureBlock>
<TableBlock caption="Table title">| col | ... |</TableBlock>
<TableBlock wip caption="Table title">| col | ... |</TableBlock>
<!-- red WIP badge inline after caption -->
<!-- TableBlock #caption slot — same blank-line requirement; default slot still holds the table markdown -->
<TableBlock width="70%">

<template #caption>

Cite[^1] in caption

</template>

| col | ... |

</TableBlock>
<Abs x="200" y="100" w="300" :z="10">...</Abs>
<!-- x/y/w are the prop names, NOT top/left/width -->
<VideoBlock src="/videos/demo.mp4" caption="Demo" width="80%" :controls="true" />
<PlotlyGraph filePath="/chart.json" :graphWidth="600" :graphHeight="400" />
<QRCode url="https://example.com" :size="160" caption="Scan" />
```

**Vue 组件里的 markdown 内容 — 标签内部前后需要空行。** 任何 Vue 组件（`<Block>`、`<Callout>`、`<ResultBox>`、`<FigureBlock>` 等）的**默认 slot** 和**具名 slot**，只要内容含 markdown 语法（加粗 `**...**`、列表、链接、脚注 `[^x]`、行内/块级公式、内嵌 HTML 等），开/闭标签和内容之间**必须各留一个空行**——否则 Slidev/markdown-it 会把内容当成原始 HTML 直接吐出，`**foo**` 会保留字面星号，`[^1]` 不会变成脚注引用。

正确（多行 + 空行）：

```vue
<Block title="Definition">

A **convex** function satisfies[^1] $f(\lambda x + (1-\lambda) y) \le \lambda f(x) + (1-\lambda) f(y)$.

</Block>
```

错误（一行写完，加粗 / 脚注 / 行内公式都不会被解析）：

```vue
<Block title="Definition">A **convex** function satisfies[^1] $f(...) \le ...$.</Block>
```

纯文字、无任何 markdown 语法的情况可以单行：`<Block title="Note">Plain text only.</Block>` 是 OK 的。判断标准是"这段内容里有没有需要 markdown 解析的符号"，不是"有几行"。

具名 slot 同规则：`<template #caption>` 的标签内部前后也要各留一空行，否则 caption 里的 `[^x]` 脚注引用会原样显示。纯文字 caption 用 `caption` prop 就够了；只有需要脚注引用、链接或 Vue 组件时才开 slot。

---

## Design Principles

The theme exposes many features (subtitle, dense mode, section bar, footnotes, Callout types, etc.) so a deck _can_ match a specific need — not so every deck _must_ use all of them. Plain markdown on a `default` layout is often the strongest slide.

- **Subtitle is optional.** Add `subtitle:` only when the title is genuinely ambiguous. (`default`/`content` are aliases — both accept `subtitle:`; pick whichever name reads better in your frontmatter.)
- **Don't stack components.** One `<Block>` _or_ one `<Callout>` _or_ one `<Takeaway>` reads better than all three. Reach for a component only when its semantic role fits — wrapping every paragraph in something is a smell.
- **Align parallel items horizontally.** When a slide does hold multiple instances of the same component (two `<Block>`s, three `<Box>`es, side-by-side `<Callout>`s), wrap them in `<Grid cols="N">` so they sit in a row, not stacked vertically. Vertical stacking reads as sequence; horizontal layout reads as comparison. For equal-height items, swap `<Grid>` for raw native CSS Grid (`<Grid>` defaults to `align-items: start`; native defaults to `stretch`).
- **Balance vertical rhythm with `<br>`.** When components, sections, or figures pack tight against each other — or when the slide feels top-heavy with a large empty zone below — drop one or two `<br>` between them. The default `margin-bottom` is calibrated for prose; visual blocks (FigureBlock, TableBlock, PlotlyGraph) and dense Callouts often want extra breath. A `<br>` is the cheapest spacing fix and almost always beats reaching for `margin: tight`, `density: dense`, or a layout change.
- **Dense mode is for content pressure, not aesthetics.** If the slide already fits in `density: normal`, don't switch to `dense`. If the problem is page padding rather than text size, try `margin: tight` first.
- **Toggle, don't litter.** Disable `sectionBar`/`footer` per-slide for cover, end, blank, and full-bleed visuals — not casually elsewhere.
- **Climb the precedence ladder for one-off styling**: frontmatter prop → CSS variable override in a slide `<style>` block → wrap the component in a plain `<div style="…">`. Two scoping levels for CSS variable overrides: (a) `.my-scope { --var }` on a wrapper `<div>` — only that subtree changes; (b) `.slidev-layout { --var }` — the entire slide including h1, footer, and section bar. For deck-wide overrides, put `:root { --var }` in `styles/index.css`. If none of these fit, **propose a feature request or PR against the theme repo** — **never edit the installed theme files** (e.g. `node_modules/@luocfprime/slidev-theme-ustc/…`). Those files are outside project scope: they get wiped on every reinstall, the change does not version-control with your deck, and the deck silently forks from upstream.

Implementation boundaries for agents: auto-numbering only recognizes static `FigureBlock`/`TableBlock` tags; dynamic component aliases and `v-bind` object spreads require manual `:number`. `subtitle:` remains a frontmatter prop paired with a markdown `# h1`; the theme uses a small layout-local DOM relocation internally to preserve that authoring API, so do not extend subtitle behavior into cross-slide metadata inference. Typst code fences are bundled as advanced rendering support; keep them optional and do not make core theme behavior depend on Typst output.

See [references/design-guide.md](references/design-guide.md) for fine-tuning recipes (width limits, gutter columns, scoped overrides) and a "when NOT to use" table per feature.

---

## Content Budget

The slide canvas is 980 × 552 px (16:9). After the section bar, h1, title gap, and padding, the **usable body height is ~23.5 rem (≈ 376 px)**. Numbers below assume 1 rem = 16 px.

### Line budget

| Density | Height per line (font × line-height) | Hard max (single-line bullets only) | Practical target |
|---------|--------------------------------------|-------------------------------------|-----------------|
| normal  | 1.4 rem × 1.8 = **2.52 rem / 40 px** | 8 | **5–6** |
| dense   | 1.05 rem × 1.5 = **1.58 rem / 25 px** | 13 | **9–10** |

A "line" is one rendered text line — a sub-bullet, a continuation wrap, or a blank-line separator all count. Use the **practical target** column: real bullets often wrap, and slides usually include a heading, intro sentence, or component alongside the list. Plan for 5–6 at normal density; only approach the hard max if every item is a short single-line phrase with no other elements on the slide.

### Component line cost

Add these to your line count. "Normal" = `density: normal`; "Dense" = `density: dense`.

| Element | Normal (40 px/line) | Dense (25 px/line) |
|---------|--------------------|--------------------|
| `<Callout type="…" title="…">` + 1 body line | 3 | 2.5 |
| `<Block title="…">` + 1 body line | 2.5 | 2 |
| `<ResultBox>` + 1 body line | 2.5 | 2 |
| `<Takeaway>` (1 sentence) | 1.5 | 1.5 |
| Each extra body line inside any component | +1 | +1 |
| `<Grid cols="2">` row | max(left, right) + 0.5 | max(left, right) + 0.5 |
| `$$…$$` simple (single-line, super/subscripts) | **1.5** | **2.5** |
| `$$…$$` complex (fraction, Σ/∫, matrix) | **2–2.5** | **3–3.5** |

**Display math does not scale down in dense mode.** `.katex-display` uses `margin: 1em` inherited from `.slidev-layout` (1.1 rem = 17.6 px, fixed), and KaTeX renders at 1.21 × that size — neither is overridden by `density: dense`. The same physical pixel height therefore represents more *line equivalents* at dense density. A slide with two display-math blocks plus bullets can overflow at dense density even if the raw line count looks safe.

### Image sizing

Images in `<FigureBlock>` **do not auto-shrink** to the available body height — they render at full width by default (`max-height: 38rem` CSS cap). Control size via props:

| Situation | Approach |
|-----------|----------|
| Limit width (most common) | `width="60%"` on `<FigureBlock>` — constrains the whole figure block |
| Limit image width inside the block | `imageWidth="400"` (px) or `imageWidth="80%"` |
| Figure in a `<Grid cols="2">` or `split` column | no extra sizing needed — the column constrains it |

```vue
<FigureBlock src="/img.png" caption="…" width="60%" />
<FigureBlock src="/img.png" caption="…" imageWidth="400" />
```

`width` sets the `<figure>` element's width (centering in the full column). `imageWidth` sets only the `<img>` inside it. Use `width` when the caption should also be narrowed; use `imageWidth` when you want the caption to span the full column width.

### Overflow rules

**Check line count before writing, not after.**

- If over budget at normal density by ≤ 20%: switch to `density: dense` + `margin: tight`.
- If over budget by more than 20%, or if there are ≥ 2 visually distinct ideas: **split into two slides** — add `(1/2)` / `(2/2)` to `subtitle:`.
- Never reach for `density: dense` to cram content that genuinely belongs on two slides; dense mode is a slight scale-down, not a compression tool.
- When splitting, put the core claim on slide 1 and the supporting detail on slide 2 (or demote to a `backup` slide).

---

## CSS Variables

Full variable reference: [references/api/theme-tokens.md](references/api/theme-tokens.md).

Key overridable variables:

| Variable                                           | Default               | Role                         |
| -------------------------------------------------- | --------------------- | ---------------------------- |
| `--ustc-blue`                                      | `#1E4C90`             | primary brand color          |
| `--ustc-fs-body`                                   | `1.4rem`              | body text (normal density)   |
| `--ustc-fs-body-dense`                             | `1.05rem`             | body text (dense density)    |
| `--ustc-fs-callout` / `--ustc-fs-callout-title`    | `1.15rem` / `1.15rem` | Callout body/title           |
| `--ustc-fs-result-title` / `--ustc-fs-result-body` | `1.15rem` / `1.15rem` | ResultBox title/body         |
| `--ustc-fs-block-title` / `--ustc-fs-block-body`   | `1.15rem` / `1.15rem` | Block title/body             |
| `--ustc-fs-takeaway`                               | `1.4rem`              | Takeaway text                |
| `--ustc-lh`                                        | `1.8`                 | body text line-height        |
| `--ustc-title-gap`                                 | `1.5rem`              | h1 to first body element gap |
| `--ustc-px` / `--ustc-py`                          | `2.8rem` / `1.75rem`  | slide padding                |
| `--ustc-max-w-cover-h1` / `--ustc-max-w-cover-sub` | `48rem` / `58rem`     | cover title/subtitle width   |
| `--ustc-footer-h`                                  | `1.75rem`             | footer bar height            |

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
highlight: 2 # highlight section 2
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
sectionLabel: 'Short Name'
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

- **Full mode:** section labels + progress indicator
- **Minimal mode:** progress indicator only
- **Labels mode:** section labels only

The "progress indicator" is per-slide dots by default. When a section has more dots than fit on one row, that section's indicator automatically switches to a horizontal progress bar (click anywhere on it to jump to the corresponding slide). Other sections keep their dots. The threshold is computed from the actual available width per section, so wide decks with few sections get dots; dense decks with many sections may show progress bars in the long sections.

Control globally:

```yaml
sectionBarMode: full # or 'minimal' | 'labels'
sectionBar: false # disable entirely
```

Hide on specific slides:

```yaml
---
sectionBar: false
---
```

The bar height is controlled by two overridable CSS variables (set these in your deck's `styles/index.css`):

```css
:root {
  --ustc-nav-h-full: 2rem; /* full mode (labels + dots) */
  --ustc-nav-h-minimal: 1.5rem; /* minimal mode (dots only) */
}
```

`--ustc-nav-h` is computed automatically from these and must not be set manually.

---

## WIP Markers

Two independent WIP signals exist; they do not interact:

**Component-level `wip` prop** — on `<FigureBlock>`, `<TableBlock>`, `<VideoBlock>`, `<QRCode>`. Shows a red "WIP" badge on the component itself. No effect on section-bar dots.

**Slide-level `wip: true` frontmatter** — on any body slide (`content`, `default`, `split`). Produces two effects:

1. A large semi-transparent "WIP" watermark centered on the slide.
2. In the section bar: if the section is showing dots, that slide's dot is tinted red with a pulsing glow. If the section is showing a progress bar (because dots overflowed), the whole bar tints red and pulses to signal "this section contains WIP content"; per-slide WIP precision is intentionally not preserved in progress-bar mode.

```yaml
---
layout: content
wip: true
---
# Draft Slide
```

**Scope limitation:** `wip: true` on a `section` layout slide shows the watermark, but does **not** produce a red dot in the section bar. Section slides appear as section-group titles in the bar, not as body-slide dots. If you need a WIP signal on a section slide visible in the bar, add a placeholder body slide after it with `wip: true`.

---

## Quick Reference

| Goal                                     | How                                                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Smaller body text globally               | `:root { --ustc-fs-body: 1.2rem }` in `styles/index.css`, or `.slidev-layout { --ustc-fs-body: 1.2rem }` per slide           |
| Dense text on one slide                  | `density: dense` in frontmatter                                                                                              |
| Change h1 / section-bar colour per slide | `.slidev-layout { --ustc-blue-dark: #... }` in slide `<style>` — reaches h1 and section bar                                  |
| Recolor footer per slide                 | `.slidev-layout { --ustc-footer-bg: #... }` (or override `--ustc-blue`) in slide `<style>`                                   |
| Hide section bar on one slide            | `sectionBar: false` in frontmatter                                                                                           |
| Indicator-only section bar (no labels)   | `sectionBarMode: minimal`                                                                                                    |
| Labels-only section bar (no indicator)   | `sectionBarMode: labels`                                                                                                     |
| Change section bar height                | `--ustc-nav-h-full` / `--ustc-nav-h-minimal` in `:root` (labels mode uses minimal height)                                    |
| Mark a body slide as WIP                 | `wip: true` in frontmatter (watermark + red section-bar dot)                                                                 |
| Background image / color on any layout   | `background: '/bg.jpg'` (or `'#1a2a4a'`) in frontmatter — accepted by every layout                                            |
| Add overlay to a background image        | `.slidev-layout { background-image: linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url('/bg.jpg') }` in slide `<style>` |
| Custom figure/table prefix               | `figurePrefix: "Fig."` / `tablePrefix: "Tab."` in global frontmatter                                                         |
| Custom number suffix                     | `figureNumberSuffix: ": "` / `tableNumberSuffix: ": "` globally, or `numberSuffix=": "` per block                            |
| Layer Abs elements                       | `:z="20"` on top, `:z="10"` behind                                                                                           |
| Wider left column in split               | `ratio: "3:1"`                                                                                                               |
| Inline footnotes                         | `footnote: flow`                                                                                                             |
| One-off width / spacing tweak            | Wrap the component in `<div style="…">`; don't passthrough to the theme component                                            |
| Equal-height items                       | Use raw native CSS Grid instead of `<Grid>` — see [design-guide.md](references/design-guide.md#force-equal-height-in-a-grid) |
| Absolute positioning                     | Prefer `<v-drag>`, use `<Abs>` for `%` coords                                                                                |
| All valid prop values                    | See [references/api/components.md](references/api/components.md)                                                             |
| All CSS variables                        | See [references/api/theme-tokens.md](references/api/theme-tokens.md)                                                         |
| Re-enable typographic replacements       | `slidev: { markdown: { markdownOptions: { typographer: true } } }` in deck's `vite.config.js`                                |
| Allow external network access to dev server | `server: { allowedHosts: true }` in deck's `vite.config.ts`                                                              |

---

## Vite Configuration

Use the deck's `vite.config.js` only for deck-local server and markdown options.
Do **not** copy files from the theme repo's `vite.config.ts` into a deck; reusable
theme behavior must come from the installed theme package itself. If a theme bug
requires changing `setup/`, `styles/`, `layouts/`, `components/`, or `utils/`,
update/reinstall the theme package and restart Slidev.

A deck only ever has **one** `export default` — merge everything into a single object:

```js
// vite.config.js in your deck
// Don't import defineConfig from 'vite' — user decks don't have vite as a
// direct dependency; Slidev bundles it internally.
export default {
  // Allow access from other devices on the network (disabled by default)
  server: {
    allowedHosts: true,
  },

  // Re-enable typographic replacements: (c)→©, (r)→®, --→– etc.
  // (the theme disables these by default for academic decks)
  slidev: {
    markdown: {
      markdownOptions: { typographer: true },
    },
  },
}
```

Include only the keys you actually need — the two blocks above are independent and can be used separately.

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
