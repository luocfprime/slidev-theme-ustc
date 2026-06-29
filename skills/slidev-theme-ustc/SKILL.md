---
name: slidev-theme-ustc
description: Use when creating, editing, converting, exporting, or designing academic Slidev decks with slidev-theme-ustc, including group-meeting reports, literature surveys, conference talks, PPT-to-Slidev conversion, figure/PDF asset ingestion, layout density fixes, and ugly/empty/cramped slide repair.
---

# slidev-theme-ustc

A clean academic Slidev theme for USTC-style presentations.

## First classify the deck

Before drafting or editing, classify the task and read the matching reference:

| Scenario | Read |
| --- | --- |
| Internal group progress / weekly report | [references/scenarios/group-progress.md](references/scenarios/group-progress.md) |
| Group literature survey / paper reading | [references/scenarios/group-literature.md](references/scenarios/group-literature.md) |
| Conference oral / formal paper talk | [references/scenarios/conference-talk.md](references/scenarios/conference-talk.md) |
| PPT or PowerPoint conversion | [references/workflows/ppt-to-slidev.md](references/workflows/ppt-to-slidev.md) |
| Paper figures, PDFs, large images, videos | [references/workflows/asset-ingestion.md](references/workflows/asset-ingestion.md) |
| Final package for another presenter | [references/workflows/handover-export.md](references/workflows/handover-export.md) |

If the user gives a PPT, distinguish **materials-only PPT** from **drafted deck PPT**.
Materials-only PPTs can be reorganized. Drafted PPTs with titles/order/notes should
be treated as structural references unless the user asks for a redesign.

Group meeting and conference defaults differ: group meeting decks normally omit
affiliations; formal conference talks normally include authors, affiliations, venue,
date, and presenter. Do not let one scenario's cover metadata leak into the other.

> **Designing a deck, not just operating the template?** Read
> [references/authoring-academic-decks.md](references/authoring-academic-decks.md) first.
> It covers how to make slides that are logically clear, rigorous, and not ugly:
> the argument spine, the layout decision tree, the density rubric, figure handling,
> academic taboos, citation discipline, and the **render → measure → fix audit loop**
> (`scripts/audit-layout.mjs`). This file below is the API reference — *what knobs
> exist*; that file is *which to turn and why*.

## Designing a deck — 10 rules (start here)

The load-bearing rules, condensed. The *why/how* (layout decision tree, density rubric,
taboos, citations) is in [references/authoring-academic-decks.md](references/authoring-academic-decks.md).

1. **A deck is an argument, not a document** — pick one claim; rest → `backup`.
2. **One job per slide** — one clear point each; split if it does two things.
3. **Structure, not prose** — short bullet fragments, never paragraphs (walls of text are the #1 tell of a bad deck).
4. **Motivation before formalism** — "Why?" before "What?"; task + motivation before method/results.
5. **Dense content, not dense *mode*** — cover a lot via structure and terse wording, not by reaching for `density: dense` to shrink text. `dense` + a half-empty slide is the worst combination.
6. **Fill the canvas (~85–100%) by adding substance, never by cramming** — this style dislikes empty corners, but reach the target by adding a figure / merging thin slides / rebalancing; legibility always wins over a fill number.
7. **Wide figures (aspect ratio > ~2.5) span full width** — never in a `split` column (they go small and leave a void below).
8. **Cite on the slide, verify every citation** — per-page footnotes, **no references slide**; credit borrowed figures; never invent a citation.
9. **Academic voice** — no colloquialisms, filler, "not X but Y" templates, or invented abbreviations; don't oversell (no "SOTA" for older work). See [references/style/wording.md](references/style/wording.md).
10. **Measure, then commit** — run `scripts/audit-layout.mjs` + eyeball a `--shot` screenshot before declaring a slide done; when you cut content to fit, relocate it to `backup` — never silently delete.

Density tiers: `normal` (default) → `compact` (middle) → `dense` (tightest); reach for the *largest* that fits. The visual target is clean, compact, and readable: neither sparse nor cramped. See [references/style/visual-rubric.md](references/style/visual-rubric.md). The `end` slide MUST have an `# h1` (the large centered closing line).

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
lineHeight: 1.6 # optional deck-wide body line-height multiplier; body slides can override
flowGap: normal # optional deck-wide top-level content block gap; 'none' | 'tight' | 'normal' | 'loose' or CSS length
figurePrefix: Figure # auto-numbering prefix for FigureBlock
tablePrefix: Table # auto-numbering prefix for TableBlock
figureNumberSuffix: ': ' # suffix between FigureBlock number and caption
tableNumberSuffix: ': ' # suffix between TableBlock number and caption
figureZoom: false # click-to-zoom lightbox for all FigureBlocks (default: false; interactive-only, no-op in PDF export)
---
```

**Authors format:** array of `{ name, affiliations, marks? }` objects. `presenterName` sets who is underlined (defaults to first author). Institutions get sequential superscript numbers in order of first appearance. `marks` are per-author symbols (e.g. `†`, `*`) displayed as superscripts after the institute number; `authorMarks` maps each symbol to its legend text (rendered below the affiliations line).

**Global body rhythm:** `lineHeight` and `flowGap` may be set in the first
slide's global frontmatter as deck-wide defaults for `default` / `content` /
`split` body slides. A body slide can override either value locally.
`lineHeight` is a unitless CSS line-height multiplier. `flowGap` controls
vertical spacing between adjacent top-level content blocks (markdown tables,
theme components, media blocks, Plotly, code fences, Mermaid diagrams, Typst
output, grids, and split-column top-level blocks); it does not affect internal
spacing such as image-caption gaps, component title/body gaps, list item gaps,
or `split`/`Grid` column gaps. Accepted `flowGap` presets: `none` (`0`), `tight`
(`0.45rem`), `normal` (`0.75rem`), `loose` (`1rem`), or a CSS length string
such as `0.6rem` or `8px`.

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
density: normal # 'normal' (default) | 'compact' | 'dense'
margin: normal # 'normal' | 'tight' | 'tighter' | 'none'
lineHeight: 1.8 # optional slide override; falls back to global lineHeight if set
flowGap: normal # optional slide override; 'none' | 'tight' | 'normal' | 'loose' or CSS length (e.g. 0.6rem)
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
variant: arrow # 'arrow' (default) | 'classic'
highlight: 2 # 1-indexed section to highlight (0 = no highlight)
columns: 1 # only used by variant: classic; 1 | 2
footer: true
footerMode: full
background: '#f5f5f5' # optional, CSS color or image path
---

# Contents   # optional; omit for a titleless agenda page
```

The `# Title` line is **optional**. If omitted, the TOC has no heading. Write `# Contents` (or any text) when the page needs an explicit title.

Sections use h1 text from each `section` slide (or `sectionLabel` if set). The `arrow` variant displays `01`, `02`, …; `classic` displays `§1`, `§2`, ….

TOC variant rubric:

- `variant: arrow` (default): use for 3–5 sections, and up to about 6 if labels are short. Best for opening agenda pages and section-transition pages; usually omit the H1 and avoid numbered section labels such as `一、`. Use `sectionLabel` on section slides when the section slide title itself needs numbering. `columns` has no effect.
- `variant: classic`, `columns: 1`: use for 6–8 sections when a linear reading order matters.
- `variant: classic`, `columns: 2`: use for 9–14 sections when space matters more than a strong visual agenda.
- 15+ sections: avoid listing every section automatically; merge sections, split into grouped TOCs, or hand-author a shorter structure page.

Compatibility: existing decks that set `columns` without `variant` keep the old classic appearance. New decks should set `variant: classic` explicitly when they want `columns`.

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

# Thank you

::contact::
name@ustc.edu.cn
```

**The `end` slide MUST have an `# h1`** — that h1 is the large centered line (e.g.
`# Thank you`, or the closing line in the deck's language). A common mistake is
shipping an `end` slide with only body
text and no h1, which renders small and off-center. Always include the h1.

The `end` slide is a courtesy close; it does **not** replace a substantive
**conclusions / takeaways** slide, which must come *before* it. The `::contact::` slot
renders below the main content.

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

`Grid`, `Abs`, `VSpace` — layout helpers. `NumberedList`, `Note`, `Block`, `Box` — structural content blocks. `Callout`, `FigureBlock`, `TableBlock`, `ResultBox`, `Takeaway` — content blocks. `Badge` — inline pill tag. `VideoBlock`, `PlotlyGraph`, `QRCode` — media.

All are auto-imported by Slidev. For full prop tables see [references/api/components.md](references/api/components.md).

### When to use which content component

| Component     | Semantic role                   | Typical use                                                                   |
| ------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `<Block>`     | Generic named container         | Definitions, lemmas, frameworks — any "labeled box" without emotional valence |
| `<NumberedList>` | Ordered module list          | Parts, stages, or ranked components where numbering matters but a process diagram would overstate the relation |
| `<Note>`      | Lightweight title-body pair     | Q&A, summary/specification, assumption/limitation, observation/implication |
| `<Callout>`   | Typed supplementary note | Tips, warnings, important caveats — when the _type_ of side information matters |
| `<Takeaway>`  | The single most important point | One bold conclusion per slide; no props, forces brevity                       |
| `<ResultBox>` | Quantitative or formal result   | Experimental numbers, theorem statements, final answers                       |
| `<Badge>`     | Inline metadata tag (not a box) | Venue / year / status / CCF rank / dataset / links — flowing inline with text |

Rules of thumb: `<Callout type="warning">` is for the audience, not the presenter. `<Callout>` has visible type color and a left rail; use it for typed side notes, not for the slide's main claim. `<Block>` is neutral — reach for it when none of the others fit.

### Visual emphasis budget

Every component spends visual attention. A border, background fill, icon,
strong color, or oversized type each adds emphasis. Match the visual weight to
the information's role: high-emphasis components should be rare; low-emphasis
components can appear more often when they form a clean structure.

These are recommended maximums per component type, not hard validation rules.
They are also not shared quotas by emphasis tier. The real failure mode is
mixing many different high-visibility treatments on one slide so that nothing
has priority.

| Component        | Visual emphasis | Recommended max per slide                                      |
| ---------------- | --------------- | -------------------------------------------------------------- |
| `<Takeaway>`     | High            | 1                                                              |
| `<Callout>`      | Medium-high     | 1; 2 only for brief side notes with distinct types |
| `<ResultBox>`    | Medium-high     | 2                                                              |
| `<NumberedList>` | Medium          | 1 group; 2 groups only for a clear split-column process        |
| `<Block>`        | Medium-low      | 2; in `split`, 2-3 when distributed across both columns        |
| `<Box>`          | Low             | 2; in `split`, 2-3 when distributed across both columns        |
| `<Badge>`        | Low, but easily fragmented | 6; more only as a deliberate legend or tag row       |
| `<Note>`         | Low          | 4; in `split`, 5-6 when used as lightweight title-body pairs   |

`<Note>` is a low-emphasis title-body pair for Q&A,
summary/specification, assumption/limitation, or observation/implication
content: more structured than a plain list, but lighter than `<Block>`,
`<Callout>`, or `<ResultBox>`. Stack multiple `<Note>`s naturally; do not wrap
them in a separate `<Notes>` container.

`<Callout>` uses a GitHub-like rail style by default: colored left rail, title
icon on, and no filled background. Set `:showIcon="false"` for a quieter rail
or `filled` for the older, more salient pale background. Treat it as typed
supplementary information, not as a high-level conclusion box. Use `<Takeaway>`
or `<ResultBox>` when the message should carry the slide.

Repeating one low- or medium-emphasis component in a strict grid, matrix, or
comparison is usually calmer than mixing many component styles. A page with
several peer `<Block>`s in a 2x2 matrix can work; a page with a `<Takeaway>`, a
`<Callout>`, two `<ResultBox>`es, and multiple boxes usually over-spends the
attention budget. Media/content carriers such as `<FigureBlock>`,
`<TableBlock>`, `<VideoBlock>`, `<PlotlyGraph>`, and `<QRCode>` are governed by
content/layout needs and are intentionally not included in this structural
emphasis table.

### Quick reference

```vue
<Grid cols="2" gap="md" alignY="top">...</Grid>
<VSpace size="1rem" />
<VSpace size="-0.5rem" />
<!-- explicit one-off vertical spacing; prefer over <br>; negative values are an escape hatch -->

<NumberedList
  :items="[
    { title: 'Collect data', body: 'gather sources and normalize fields' },
    { title: 'Run analysis', body: 'apply the shared scoring protocol' },
    { title: 'Write summary', body: 'report findings and remaining caveats' },
  ]"
/>

<Note title="Input">

...

</Note>

<Note title="Output" color="#92400e" :divider="false">

...

</Note>

<Block title="Definition">

...

</Block>

<Block title="Recovered state" color="#065f46">

...

</Block>

<Box bg="blue-pale" borderColor="var(--ustc-blue)" radius="4px">

...

</Box>

<Callout type="tip" title="Insight">

...

</Callout>
<!-- types: note tip warning important example -->

<Takeaway>

Key point.

</Takeaway>

<ResultBox title="Result" bg="blue-pale" borderColor="var(--ustc-blue)">

...

</ResultBox>
<Badge variant="solid" color="#c0392b">CCF A</Badge> <Badge variant="soft"><mdi-github /> Code</Badge>
<!-- variants: soft solid outline; any color; href turns it into a link -->
<Badge href="https://arxiv.org/abs/2509.20358" color="#b31b1b"><mdi-school /> arXiv</Badge>
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

**Content-bearing Vue components must be multi-line with blank lines.** Write
`<Block>`, `<Box>`, `<Note>`, `<Callout>`, `<ResultBox>`, and `<Takeaway>` with the opening tag,
a blank line, the body, another blank line, and the closing tag. Do this even when
the body is a single short sentence or a tiny demo cell; `<Takeaway>` is not an
exception. The one-line form is syntactically possible, but it is not the style for
this skill and it fails as soon as the body grows markdown syntax (bold `**...**`,
lists, links, footnotes `[^x]`, inline/block math, embedded HTML, etc.). In those
cases Slidev/markdown-it treats the body as raw HTML: `**foo**` keeps the literal
asterisks and `[^1]` is not turned into a footnote reference. One-line bodies also
bypass some theme typography hooks, so the rendered size can differ from the
normal component body.

Correct (multi-line + blank lines):

```vue
<Block title="Definition">

A **convex** function satisfies[^1] $f(\lambda x + (1-\lambda) y) \le \lambda f(x) + (1-\lambda) f(y)$.

</Block>
```

Wrong (all on one line — not accepted, even if the text looks simple):

```vue
<Block title="Definition">A **convex** function satisfies[^1] $f(...) \le ...$.</Block>
```

Do not use one-line content components such as
`<Takeaway>Key point.</Takeaway>`, `<Block title="A">Plain text.</Block>`, or
`<Note title="A">Plain text.</Note>`.
`<Badge>` is different: it is an inline pill and should stay inline when used inside
running text.

When a content component is nested inside raw HTML such as `<div>`, keep the
component tag and its body below Markdown's code-block indentation threshold:
do not indent them by 4 or more spaces. Four-space indentation turns the body or
tag into `<pre><code>...`, which can make Vue report "Element is missing end
tag." Prefer unindented component markup inside raw HTML wrappers.

Named slots follow the same rule: `<template #caption>` also needs a blank line around its content, otherwise a `[^x]` footnote reference in the caption renders literally. For a plain-text caption the `caption` prop is enough; only open the slot when you need footnote references, links, or Vue components.

Before handoff, run the mechanical check on edited deck files:

```bash
node <skill>/scripts/check-component-format.mjs slides.md sections/*.md
```

Fix every reported one-line content component. The check intentionally ignores inline
`<Badge>` and self-closing media components.

---

## Design Principles

The theme exposes many features (subtitle, dense mode, section bar, footnotes, Callout types, etc.) so a deck _can_ match a specific need — not so every deck _must_ use all of them. Plain markdown on a `default` layout is often the strongest slide.

- **Subtitle is optional.** Add `subtitle:` only when the title is genuinely ambiguous. (`default`/`content` are aliases — both accept `subtitle:`; pick whichever name reads better in your frontmatter.)
- **Don't stack components.** One `<Block>` _or_ one `<Callout>` _or_ one `<Takeaway>` reads better than all three. Reach for a component only when its semantic role fits — wrapping every paragraph in something is a smell.
- **Vary repeated component treatments.** More than two identical-looking instances of the same component on one slide flatten into a visual group: the audience sees "a pile of boxes" before it sees hierarchy. If you need 3+ peers, make the repetition intentional and ordered (for example a 2×2 `<Block>` matrix or a 3×1 card-like stack); otherwise vary structure, emphasis, or component choice so the main point stays legible.
- **Align parallel items horizontally.** When a slide does hold multiple instances of the same component (two `<Block>`s, three `<Box>`es, side-by-side `<Callout>`s), wrap them in `<Grid cols="N">` so they sit in a row, not stacked vertically. Vertical stacking reads as sequence; horizontal layout reads as comparison. For equal-height items, swap `<Grid>` for raw native CSS Grid (`<Grid>` defaults to `align-items: start`; native defaults to `stretch`).
- **Use the theme rhythm first.** Top-level components and media blocks already share `--ustc-component-gap`, with compact/dense variants. `<Note>` also has dedicated `--ustc-note-stack-gap` / `--ustc-note-after-gap` tokens because title-body pairs often need slightly more breathing room than ordinary flow blocks. If a single slide still needs a touch more or less separation at one specific point, use `<VSpace size="..."/>` instead of `<br>`. For repeated spacing changes, override the relevant rhythm token on `.slidev-layout` for one slide or `:root` for the deck instead of sprinkling one-off spacers throughout the deck.
- **Use `flowGap` for body block rhythm.** Set `flowGap` globally when the whole deck should breathe tighter/looser, or per slide when one dense page needs special spacing. It controls the same top-level flow rhythm as `--ustc-component-gap`; use dedicated tokens for component-specific structure such as Note stacking or figure caption spacing.
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
| compact | 1.22 rem × 1.65 = **2.01 rem / 32 px** | 10 | **7** |
| dense   | 1.05 rem × 1.5 = **1.58 rem / 25 px** | 13 | **9–10** |

A "line" is one rendered text line — a sub-bullet, a continuation wrap, or a blank-line separator all count. Use the **practical target** column: real bullets often wrap, and slides usually include a heading, intro sentence, or component alongside the list. Plan for 5–6 at normal density; only approach the hard max if every item is a short single-line phrase with no other elements on the slide.

### Component line cost

Add these to your line count. "Normal" = `density: normal`; "Dense" = `density: dense`.

| Element | Normal (40 px/line) | Dense (25 px/line) |
|---------|--------------------|--------------------|
| `<Callout type="…" title="…">` + 1 body line | 3 | 2.5 |
| `<Block title="…">` + 1 body line | 2.5 | 2 |
| `<ResultBox>` + 1 body line | 2.5 | 2 |
| `<Note title="…">` + 1 body line | 2 | 1.5 |
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
| `--ustc-fs-body-compact`                           | `1.22rem`             | body text (compact density)  |
| `--ustc-fs-body-dense`                             | `1.05rem`             | body text (dense density)    |
| `--ustc-fs-callout` / `--ustc-fs-callout-title`    | Block scale           | Callout body/title           |
| `--ustc-fs-result-title` / `--ustc-fs-result-body` | Block scale           | ResultBox title/body         |
| `--ustc-fs-block-title` / `--ustc-fs-block-body`   | `1.22rem` / `1.22rem` | Block title/body             |
| `--ustc-fs-note-title` / `--ustc-fs-note-body`     | body scale            | Note title/body              |
| `--ustc-fs-takeaway`                               | `1.4rem`              | Takeaway text                |
| `--ustc-fs-badge-scale`                            | `0.68`                | Badge text scale vs body     |
| `--ustc-fs-badge`                                  | unset                 | Fixed Badge text override    |
| `--ustc-lh`                                        | `1.8`                 | body text line-height        |
| `--ustc-title-gap`                                 | `1.5rem`              | h1 to first body element gap |
| `--ustc-component-gap`                             | `0.75rem`             | top-level content block gap  |
| `--ustc-note-stack-gap` / `--ustc-note-after-gap`  | `0.95rem` / `1rem`    | Note-to-Note / Note-to-next gap |
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

`density: dense` is a coordinated scale-down — it simultaneously shrinks body text (`1.4rem` → `1.05rem`), Note title/body with the body scale, Callout / ResultBox / Block text on the same component scale (`1.22rem` → `1.05rem`), table cells (`1.1rem` → `0.96rem`), h2 (drops to h3 size `1.3rem`), Takeaway text (`1.4rem` → `1.05rem`), and tightens line-height (`1.8` → `1.5`) plus list spacing. Use it instead of overriding font sizes in `<style>` because a `<style>` override changes one element in isolation and breaks the theme's internal proportions. Dense mode keeps the whole slide visually coherent at a smaller scale. Combine with `margin: tight` or `margin: tighter` to reclaim additional page padding.

**`density: compact` is the middle tier** — every typography token sits roughly halfway between `normal` and `dense` (body `1.4rem` → `1.22rem` → `1.05rem`; line-height `1.8` → `1.65` → `1.5`). Reach for it when a slide is slightly over budget at `normal` but `dense` shrinks things more than necessary. Same coordinated-scale mechanism as dense — don't hand-tune font sizes to fake an in-between size.

### Limit a component's width

Wrap the component in a plain `<div style="…">` — inline `style` on a raw `<div>` is bulletproof. Don't try to pass `style` or `class` directly to a theme component in markdown: Slidev's `<style>` blocks are auto-scoped (so `.my-class` on the component root often doesn't match), and attribute passthrough on theme components in markdown is unreliable.

```vue
<Grid cols="2" gap="lg">
  <Block title="A">

  …

  </Block>
  <div style="justify-self: center; max-width: 26rem;">
    <Block title="B">

    …

    </Block>
  </div>
</Grid>
```

For consistent inset width across slides, prefer gutter columns: `<Grid cols="1 8 8 1">` with empty `<div>`s on the edges.

For equal-height items, replace the theme `<Grid>` with raw native CSS Grid — `<Grid>` defaults to `align-items: start`, native Grid defaults to `stretch`:

```vue
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem;">
  <Block>

  …

  </Block>
  <Callout type="tip">

  …

  </Callout>
  <ResultBox>

  …

  </ResultBox>
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
variant: arrow # default; columns is ignored
highlight: 2 # highlight section 2
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
| Middle density (between normal & dense)  | `density: compact` in frontmatter                                                                                            |
| Deck-wide body line-height               | `lineHeight: 1.6` in first-slide global frontmatter; override per body slide with `lineHeight`                                |
| Deck-wide top-level block spacing        | `flowGap: tight` in first-slide global frontmatter; override per body slide with `flowGap: 0.6rem`                            |
| Change h1 / heading colour per slide     | `.slidev-layout { --ustc-blue-dark: #... }` in slide `<style>` — reaches h1, block/takeaway/callout titles                  |
| Recolor section bar + footer per slide   | `.slidev-layout { --ustc-blue: #... }` in slide `<style>` — both chrome bars share this token                                |
| Recolor only the footer (keep nav blue)  | `.slidev-layout { --ustc-footer-bg: #... }` in slide `<style>`                                                              |
| Hide section bar on one slide            | `sectionBar: false` in frontmatter                                                                                           |
| Indicator-only section bar (no labels)   | `sectionBarMode: minimal`                                                                                                    |
| Labels-only section bar (no indicator)   | `sectionBarMode: labels`                                                                                                     |
| Change section bar height                | `--ustc-nav-h-full` / `--ustc-nav-h-minimal` in `:root` (labels mode uses minimal height)                                    |
| Mark a body slide as WIP                 | `wip: true` in frontmatter (watermark + red section-bar dot)                                                                 |
| Background image / color on any layout   | `background: '/bg.jpg'` (or `'#1a2a4a'`) in frontmatter — accepted by every layout                                            |
| Add overlay to a background image        | `.slidev-layout { background-image: linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url('/bg.jpg') }` in slide `<style>` |
| Custom figure/table prefix               | `figurePrefix: "Fig."` / `tablePrefix: "Tab."` in global frontmatter                                                         |
| Custom number suffix                     | `figureNumberSuffix: ": "` / `tableNumberSuffix: ": "` globally, or `numberSuffix=": "` per block                            |
| Click-to-zoom figures (lightbox)         | `figureZoom: true` in global frontmatter (deck-wide); per-figure `zoomable` / `:zoomable="false"` override. Interactive-only — no-op in PDF export. |
| Layer Abs elements                       | `:z="20"` on top, `:z="10"` behind                                                                                           |
| Wider left column in split               | `ratio: "3:1"`                                                                                                               |
| Inline footnotes                         | `footnote: flow`                                                                                                             |
| One-off width / spacing tweak            | Wrap the component in `<div style="…">`; don't passthrough to the theme component                                            |
| Equal-height items                       | Use raw native CSS Grid instead of `<Grid>` — see [design-guide.md](references/design-guide.md#force-equal-height-in-a-grid) |
| Absolute positioning                     | Use `<Abs x y w :z>` (`%`/px coords); Slidev's built-in `<v-drag>` also works for drag-positioned elements                   |
| All valid prop values                    | See [references/api/components.md](references/api/components.md)                                                             |
| All CSS variables                        | See [references/api/theme-tokens.md](references/api/theme-tokens.md)                                                         |
| Re-enable typographic replacements       | `slidev: { markdown: { markdownOptions: { typographer: true } } }` in deck's `vite.config.js`                                |
| Allow external network access to dev server | `server: { allowedHosts: true }` in deck's `vite.config.ts`                                                              |
| Ignore speaker-note-only HMR updates     | Built into the theme for `slides.md` and `sections/*.md`; add deck-specific files via `ustcTheme.extraNotesOnlyHmrFiles`     |

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

### Theme-maintained HMR whitelist

The theme's default Vite plugin ignores HMR when a whitelisted markdown file
changes only Slidev speaker notes (HTML comments outside fenced code blocks).
This keeps presenter-note edits from refreshing the visible deck.

Default whitelist:

```ts
// setup/vite-plugins.ts in the theme repo
export const notesOnlyHmrFiles = ['slides.md', 'sections/*.md']
```

For a deck/project with extra markdown entry points, do **not** copy the theme
plugin into the project. Add the extra deck-root-relative patterns in the deck's
`vite.config.js`:

```js
// vite.config.js in your deck
export default {
  ustcTheme: {
    // Appended to the default ['slides.md', 'sections/*.md'] whitelist.
    extraNotesOnlyHmrFiles: ['chapters/*.md', 'appendix.md'],
  },
}
```

If the deck also needs other local Vite options, merge them into the same single
`export default` object:

```js
export default {
  server: {
    allowedHosts: true,
  },
  ustcTheme: {
    extraNotesOnlyHmrFiles: ['chapters/*.md'],
  },
}
```

For theme-repo changes that should affect every deck by default, update
`notesOnlyHmrFiles` in `setup/vite-plugins.ts` instead:

```ts
export const notesOnlyHmrFiles = ['slides.md', 'sections/*.md', 'chapters/*.md']
```

Patterns are deck-root-relative, case-insensitive, and support `*` inside a
single path segment only. Do not add broad patterns such as `**/*.md` unless the
theme intentionally wants notes-only edits in every markdown file to skip HMR.
After changing the whitelist or stripping behavior, update
`tests/vitePlugins.test.mjs` and run:

```bash
pnpm exec tsx --test tests/vitePlugins.test.mjs
pnpm test:unit
```

---

## Additional Resources

- [references/authoring-academic-decks.md](references/authoring-academic-decks.md) — **how to design good academic decks**: argument spine, layout decision tree, density rubric, figure handling, academic taboos, citations, the render→measure→fix audit loop
- [references/scenarios/group-progress.md](references/scenarios/group-progress.md) — internal group meeting / weekly progress defaults, including no-affiliation covers and WIP handling
- [references/scenarios/group-literature.md](references/scenarios/group-literature.md) — literature survey / paper reading structure, metadata badges, and survey-specific pitfalls
- [references/scenarios/conference-talk.md](references/scenarios/conference-talk.md) — formal conference/oral paper talks: affiliations, time budget, image-heavy text-light slides, and drafted PPT preservation
- [references/workflows/ppt-to-slidev.md](references/workflows/ppt-to-slidev.md) — classify PPTs as materials-only vs drafted deck, then convert appropriately
- [references/workflows/asset-ingestion.md](references/workflows/asset-ingestion.md) — bring in PDF/SVG/raster/video assets; includes `scripts/pdf2svg.py`
- [references/workflows/handover-export.md](references/workflows/handover-export.md) — package PDF/PPTX/PNG/source handovers; includes `scripts/handover-export.sh`
- [references/style/wording.md](references/style/wording.md) — wording preferences: avoid AI-smelling shorthand, invented acronyms, filler, and unsupported SOTA claims
- [references/style/visual-rubric.md](references/style/visual-rubric.md) — operational check for sparse, cramped, ugly, over-boxed, or misaligned slides
- [scripts/audit-layout.mjs](scripts/audit-layout.mjs) — the layout audit ruler: renders each slide headless and reports overflow / sparse / wide-figure-in-split / image whitespace / orphan defects with fix hints (`node <skill>/scripts/audit-layout.mjs <url-or-deck.md>`)
- [scripts/pdf2svg.py](scripts/pdf2svg.py) — convert PDF figures/pages to SVG (`uv run <skill>/scripts/pdf2svg.py input.pdf -o public/images`)
- [scripts/handover-export.sh](scripts/handover-export.sh) — export PDF/PPTX/PNG once and zip a handover package (`bash <skill>/scripts/handover-export.sh <deck-dir> <handover-dir> <artifact-prefix>`)
- [scripts/check-component-format.mjs](scripts/check-component-format.mjs) — fail on one-line content components such as `<Takeaway>...</Takeaway>` (`node <skill>/scripts/check-component-format.mjs slides.md sections/*.md`)
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
