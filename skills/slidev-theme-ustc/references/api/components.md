# Components Reference

All components are auto-imported by Slidev — no import needed.

---

## Auto-numbering for `<FigureBlock>` and `<TableBlock>`

Numbers are injected at compile time by the Slidev markdown transformer in `setup/transformers.ts` (single source of truth: `utils/blockNumberTransform.ts`). The number is bound to the tag's source-code position, NOT its rendered DOM presence.

**`autoNumber` headmatter key (default `true`):** set `autoNumber: false` in the deck's global frontmatter to disable the transformer. When disabled, `FigureBlock` and `TableBlock` render without number labels, and Vite can hot-update individual slides without a full page reload — useful when editing with `dragPos` or the slide editor. Re-enable before build/export to restore sequential numbering.

```yaml
---
autoNumber: false   # smooth HMR during editing; re-enable before publishing
---
```

| Override                          | Behavior                                               |
| --------------------------------- | ------------------------------------------------------ |
| Bare `<FigureBlock>`              | Auto-injected `:number="N"`, counter `+1`              |
| `<FigureBlock :number="7">`       | Manual override; auto counter resumes from `max(c, 8)` |
| `<FigureBlock :numbered="false">` | No number rendered AND counter unchanged               |

**v-if / v-show semantics:** these only affect rendering. The figure still occupies a number from its source-code position. Show/hide a figure via reactive state and its number stays stable across toggles. To exclude a tag entirely (no slot, no number), use `:numbered="false"` or wrap it in an HTML comment.

**Skip regions:** tags inside fenced code (``` and ~~~), inline code spans, and HTML comments are NOT counted. Tags inside attribute string values may falsely match — vanishingly rare in practice.

**Supported syntax boundary:** auto-numbering is intentionally limited to static `<FigureBlock>`, `<figure-block>`, `<TableBlock>`, and `<table-block>` tags in slide source. It is a compile-time source transform, not a Vue runtime registry.

**Out of scope:** `<component :is="'FigureBlock'" />` dynamic rendering, object spread such as `v-bind="{ number: 1 }"`, component aliases, and generated component names are not recognized by the static transformer. Set `:number` manually when using those patterns.

Caption label format is `${prefix} ${number}${numberSuffix}${caption}` when a caption exists. The default suffix is `. `; set `figureNumberSuffix` / `tableNumberSuffix` in global frontmatter or `numberSuffix` on one block to use values such as `:`, `.`, or `. `.

---

## `<Grid>`

CSS grid container.

```vue
<Grid cols="2" gap="md" alignY="top">

Left cell

<div>Right cell</div>

</Grid>
```

| Prop     | Type   | Default | Values                                            |
| -------- | ------ | ------- | ------------------------------------------------- |
| `cols`   | string | `'2'`   | `'3'`, `'1 2 1'`, `'1fr 2fr'`, `'300px 1fr'`      |
| `gap`    | string | `'md'`  | `'sm'` (0.8rem) · `'md'` (1.4rem) · `'lg'` (2rem) |
| `alignY` | string | `'top'` | `'top'` · `'center'` · `'bottom'`                 |

`cols` resolution: single digit → `repeat(n, 1fr)`; space-separated numbers → `Nfr` each; anything else → used verbatim.

---

## `<VSpace>`

Explicit one-off vertical spacer. Use it instead of `<br>` when a single slide
needs a local rhythm adjustment between two flow elements.

```vue
Paragraph above.

<VSpace size="1rem" />

Paragraph below.
```

```vue
<VSpace />
<VSpace size="sm" />
<VSpace size="24" />
<VSpace :size="24" />
<VSpace size="-0.5rem" />
```

| Prop   | Type             | Default | Values                                                                 |
| ------ | ---------------- | ------- | ---------------------------------------------------------------------- |
| `size` | string \| number | `'md'`  | `'xs'` (0.25rem) · `'sm'` (0.5rem) · `'md'` (1rem) · `'lg'` (1.5rem) · `'xl'` (2rem), a CSS length, or a number/number string in px. |

Positive values insert space by setting the spacer height. Literal negative
values such as `"-0.5rem"` or `"-8"` compress the following flow by applying a
negative bottom margin. Negative space is intentionally supported for
LaTeX-like fine-tuning, but treat it as an escape hatch: it can overlap text,
floating labels, formulas, footnotes, or footer chrome if overused.

For repeated spacing changes across a slide or deck, prefer `flowGap` or
`--ustc-component-gap`; `<VSpace>` is for local one-off adjustments.

---

## `<NumberedList>`

Numbered module list with blue circular markers and bounded horizontal dividers. Use it for ordered parts, components, stages, or checklist-like explanations when a plain bullet list is too weak but a process diagram would overstate the structure.

```vue
<NumberedList
  :items="[
    { title: 'Collect data', body: 'gather sources and normalize fields' },
    { title: 'Run analysis', body: 'apply the shared scoring protocol' },
    { title: 'Write summary', body: 'report findings and remaining caveats' },
  ]"
/>
```

```vue
<NumberedList
  :start="4"
  color="#065f46"
  :divider="false"
  :items="[
    { title: '**Observation** model $p(x_t)$', body: '**images** -> latent state $z_t$' },
    { title: 'Policy head', body: 'state -> action' },
  ]"
/>
```

| Prop      | Type    | Default            | Description                                          |
| --------- | ------- | ------------------ | ---------------------------------------------------- |
| `items`   | array   | `[]`               | Array of `{ title, body? }`; both fields support inline markdown and `$...$` LaTeX math. |
| `start`   | number  | `1`                | First marker number; following items increment by one. |
| `color`   | string  | `var(--ustc-blue)` | Marker fill and item-title color.                    |
| `divider` | boolean | `true`             | Show bounded dividers between items.                 |

The dividers belong only to the text column, not the whole slide row, so they do not visually collide with adjacent columns in a `split` or `Grid` layout. `NumberedList` is explicit data only: it does not inspect slide markdown, rendered DOM, section state, or other Slidev internals, so dev/build/export behavior is the same.

---

## `<Note>`

Low-emphasis title-body pair for lightweight structured notes. Use it for Q&A,
summary/specification, assumption/limitation, or observation/implication
content when a plain list is too flat but `<Block>`, `<Callout>`, or
`<ResultBox>` would over-emphasize the material.

```vue
<Note title="Input">

Dataset, task definition, and evaluation metric.

</Note>

<Note title="Output">

A short summary with reusable settings.

</Note>
```

```vue
<Note title="Context" color="#065f46">

The comparison uses a fixed dataset.

</Note>
```

| Prop      | Type    | Default                 | Description                           |
| --------- | ------- | ----------------------- | ------------------------------------- |
| `title`   | string  | `''`                    | Optional title; supports inline markdown and `$...$` LaTeX math. |
| `color`   | string  | `var(--ustc-blue-dark)` | Title accent color.                    |
| `divider` | boolean | `true`                  | Show a neutral title underline divider. |

The `title` prop is rendered as inline markdown, including `$...$` LaTeX math.
The body slot uses normal Slidev markdown, so emphasis, links, code, and LaTeX
math work there as well.

`Note` is intentionally a single component, not a `<Notes>` wrapper. Stack
multiple `<Note>`s naturally in document flow, or place them in `split` /
`Grid` columns. It has no icon, filled background, or outer border so it stays
below `<Block>` in the visual emphasis budget.

---

## `<Block>`

Labeled neutral container with a floating title label and outlined box.

```vue
<Block title="Definition">

Content inside the block.

</Block>
```

```vue
<Block title="Recovered state" color="#065f46">

Custom accent color for the label and outline.

</Block>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | — | Optional floating label; supports inline markdown. |
| `color` | string | USTC blue-dark | Optional CSS color for the label and outline family. |

---

## `<Box>`

No-semantics atomic container for partitioning slide content. Defaults to a clean sharp rectangle (USTC-blue border, transparent background); set `bg`, `borderColor`, `border`, and `radius` to get other shapes.

```vue
<Box>

Default — bordered sharp rectangle.

</Box>

<Box bg="gray-soft" :border="false" radius="6px">
Soft partition: gray fill, no border, rounded.
</Box>

<Box bg="blue-pale" borderColor="#1e4c90" radius="4px">

Theme-color tinted (border kept).

</Box>

<Box bg="#eef5ff" :border="false" radius="8px">

Any CSS color string.

</Box>
```

| Prop          | Type      | Default                        |
| ------------- | --------- | ------------------------------ |
| `bg`          | `string`  | `'transparent'`                |
| `border`      | `boolean` | `true`                         |
| `borderColor` | `string`  | `var(--ustc-box-border-color)` |
| `radius`      | `string`  | `'0'`                          |

`bg` is dual-mode: `'blue-pale'` resolves to `var(--ustc-blue-pale)`, `'gray-soft'` resolves to `var(--ustc-box-bg-gray)`; anything else passes through verbatim as a CSS color value.

`borderColor` accepts any CSS color. Typography (font-size, line-height, color,
font-weight) is inherited from context — Box does not override it. Theme-level
customization via `--ustc-box-*` tokens (see `theme-tokens.md`).

---

## `<Callout>`

Alert box with icon and colored left border.

```vue
<Callout type="tip" title="Key Insight">

Body text here.

</Callout>
```

| `type`           | Icon         | Color  |
| ---------------- | ------------ | ------ |
| `note` (default) | info         | blue   |
| `tip`            | lightbulb    | teal   |
| `warning`        | alert        | amber  |
| `important`      | alert-circle | red    |
| `example`        | beaker       | purple |

Both `type` and `title` are optional.

---

## `<Takeaway>`

Highlighted key-point box (blue border, bold dark-blue text). No props.

```vue
<Takeaway>

The main conclusion in one sentence.

</Takeaway>
```

---

## `<Badge>`

Inline pill for compact factual tags — venue, year, status, CCF rank, dataset, links. Renders as a single inline-flex pill that sits on the text baseline, so multiple badges flow inline or wrap naturally inside a `<div class="row">`.

```vue
<Badge>default soft</Badge>
<Badge variant="solid" color="#c0392b">CCF A</Badge>
<Badge variant="outline" color="#16a34a"><mdi-check-circle /> reproduced</Badge>
<Badge href="https://arxiv.org/abs/2509.20358" color="#b31b1b"><mdi-school /> arXiv</Badge>
```

| Prop      | Default            | Behavior                                                            |
| --------- | ------------------ | ------------------------------------------------------------------ |
| `variant` | `soft`             | `soft` (tinted bg) · `solid` (filled, white text) · `outline` (bordered) |
| `color`   | `var(--ustc-blue)` | Any CSS color; drives bg/text/border per variant via `color-mix`   |
| `href`    | `''`               | Turns the badge into a link. `http(s)://` or `//` opens in a new tab; in-deck anchors (`#/5`) navigate in place |

**Slot content** is freeform: plain text, emoji, or Slidev Iconify icons (e.g. `<mdi-github />`). Icons are sized relative to the text and baseline-aligned automatically — no wrapper needed.

**Sizing.** Badge text defaults to `calc(var(--ustc-fs-body) * var(--ustc-fs-badge-scale))` (`--ustc-fs-badge-scale: 0.68`), anchored to the current layout body size so it auto-shrinks in `dense`/`compact` and stays consistent whether the badge sits in a `<p>`, `<li>`, or a bare `<div>`. Override `--ustc-fs-badge-scale` to resize badges while preserving density scaling; override `--ustc-fs-badge` only when you want a fixed text size.

---

## `<ResultBox>`

Result/conclusion box with 2px border.

```vue
<ResultBox title="Main Result">

Our method achieves 94.3% accuracy.

</ResultBox>

<ResultBox title="Green Result" bg="#ecfdf5" borderColor="#16a34a">

The same semantic result box with custom colors.

</ResultBox>
```

`title` is optional and supports markdown.

| Prop          | Type     | Default            |
| ------------- | -------- | ------------------ |
| `title`       | `string` | `''`               |
| `bg`          | `string` | `'blue-pale'`      |
| `borderColor` | `string` | `var(--ustc-blue)` |

`bg` uses the same naming as `<Box>`: `'blue-pale'` resolves to `var(--ustc-blue-pale)`,
`'gray-soft'` resolves to `var(--ustc-box-bg-gray)`, and any other value passes through
as a CSS color.

---

## `<FigureBlock>`

Image with auto-numbered caption. Counter is global across the entire deck.

```vue
<FigureBlock
  src="/path/to/image.png"
  caption="Description of the figure"
  width="80%"
  imageWidth="100%"
  captionAlign="center"
/>
```

| Prop                | Default                               | Notes                                                     |
| ------------------- | ------------------------------------- | --------------------------------------------------------- |
| `src`               | —                                     | required unless `wip` is set                              |
| `alt`               | `''`                                  | accessibility                                             |
| `caption`           | `''`                                  | plain-text fallback when `#caption` slot is empty         |
| `width`             | `'100%'`                              | outer container width                                     |
| `imageWidth`        | `'100%'`                              | image element (max-height: 38rem)                         |
| `captionAlign`      | `'center'`                            | `'left'` · `'center'`                                     |
| `captionInsetLeft`  | `0`                                   | padding-left on caption                                   |
| `captionInsetRight` | `0`                                   | padding-right on caption                                  |
| `prefix`            | global `figurePrefix`                 | per-figure label override                                 |
| `numberSuffix`      | global `figureNumberSuffix` or `'. '` | per-figure separator after the number                     |
| `wip`               | `false`                               | mark figure as work-in-progress; shows red WIP badge      |
| `number`            | injected                              | auto-numbered at compile time; set explicitly to override |
| `numbered`          | `true`                                | set to `false` to skip auto-numbering entirely            |
| `zoomable`          | inherits global `figureZoom`          | click-to-zoom lightbox; tristate — see below              |

Global prefix set in deck frontmatter: `figurePrefix: Figure` (default). Global suffix set in deck frontmatter: `figureNumberSuffix: ". "` (default).

**Click-to-zoom (lightbox).** Off by default. Enable deck-wide with `figureZoom: true` in the first slide's frontmatter; every `<FigureBlock>` then opens a fullscreen enlarged view on click (click the backdrop/image or press `Esc` to close). The `zoomable` prop is a **tristate override**:

```vue
<FigureBlock src="/a.png" />                    <!-- inherits global figureZoom -->
<FigureBlock src="/b.png" :zoomable="false" />  <!-- force off, even if global on -->
<FigureBlock src="/c.png" zoomable />           <!-- force on, even if global off -->
```

Resolution: `zoomable` prop (if set) wins; otherwise the deck-wide `figureZoom` headmatter; otherwise off. A zoomable image shows a `zoom-in` cursor on hover. The overlay backdrop color is the `--ustc-zoom-backdrop` CSS variable (default `rgba(0,0,0,0.85)`).

**Mode boundary — interactive only.** Zoom is a runtime DOM interaction: it works in `pnpm dev` and in the static `pnpm build` SPA, but is a **no-op in `pnpm export`** (PDF/PNG). Exported figures still render normally at their original size — they just can't be clicked. Don't rely on zoom to convey information that must survive to PDF.

**Caption slot — required for footnotes, links, or rich markdown.** The `caption` prop runs through a stripped-down inline markdown renderer (math + inline HTML only); footnote refs (`[^x]`), reference-style links, and Vue components inside it render as literal text. To use those, write the caption as the `#caption` slot — its content goes through Slidev's slide-level markdown pipeline, so footnote refs wire up to definitions placed elsewhere in the slide.

**Critical: blank lines required around slot content.** Slidev only processes markdown inside an HTML/Vue block when the inner content is separated from the surrounding tags by blank lines. Without blank lines, slot content is treated as raw HTML and `[^x]` renders as literal text.

```vue
<FigureBlock src="/img.png" width="60%">

<template #caption>

Comparison against ProlificDreamer[^pd] and others.

</template>

</FigureBlock>

[^pd]: Wang et al. NeurIPS 2023.
```

The auto-numbered label (`Figure N. `) still renders before the slot content. Slot wins when both slot and `caption` prop are provided.

**WIP mode:** Add `wip` to show a red badge. Use a [placehold.co](https://placehold.co) URL as `src` to hold the correct aspect ratio while the real image is not ready.

```vue
<!-- placeholder — no image yet, holds 4:3 space -->
<FigureBlock wip src="https://placehold.co/800x600" caption="Experiment results" />

<!-- draft — image exists but not finalised -->
<FigureBlock wip src="/fig-draft.png" caption="Experiment results" />
```

---

## `<VideoBlock>`

Video with optional caption. Similar prop set to `FigureBlock` (no auto-numbering, no `#caption` slot — caption is prop-only).

```vue
<VideoBlock
  src="/videos/demo.mp4"
  caption="Description of the video"
  width="80%"
  :controls="true"
/>
```

| Prop                | Default    | Notes                                                 |
| ------------------- | ---------- | ----------------------------------------------------- |
| `src`               | —          | required; `/`-prefixed paths get `BASE_URL` prepended |
| `caption`           | `''`       | supports markdown                                     |
| `width`             | `'100%'`   | outer container width                                 |
| `videoWidth`        | `'100%'`   | `<video>` element width                               |
| `captionAlign`      | `'center'` | `'left'` · `'center'`                                 |
| `captionInsetLeft`  | `0`        | padding-left on caption                               |
| `captionInsetRight` | `0`        | padding-right on caption                              |
| `controls`          | `true`     | show browser video controls                           |
| `autoplay`          | `false`    | autoplay (forces `muted`)                             |
| `loop`              | `false`    | loop playback                                         |
| `muted`             | `false`    | mute audio                                            |

`playsinline` is always set (iOS compatibility). Place files under `public/videos/` and reference as `/videos/file.mp4`.

---

## `<TableBlock>`

Table wrapper with auto-numbered caption. Counter is global across the entire deck.
When `width` is narrower than the content area, a top-level TableBlock is centered by default.

```vue
<TableBlock caption="Comparison results" captionAlign="center">

| Method | Acc | F1 |
|--------|-----|----|
| Ours   | 94  | 93 |

</TableBlock>
```

| Prop           | Default                              | Notes                                                               |
| -------------- | ------------------------------------ | ------------------------------------------------------------------- |
| `caption`      | `''`                                 | plain-text fallback when `#caption` slot is empty                   |
| `captionAlign` | `'center'`                           | `'left'` · `'center'`                                               |
| `width`        | `'100%'`                             | container width; narrower top-level blocks center by default        |
| `prefix`       | global `tablePrefix`                 | per-table label override                                            |
| `numberSuffix` | global `tableNumberSuffix` or `'. '` | per-table separator after the number                                |
| `wip`          | `false`                              | mark table as work-in-progress; shows red WIP badge next to caption |
| `number`       | injected                             | auto-numbered at compile time; set explicitly to override           |
| `numbered`     | `true`                               | set to `false` to skip auto-numbering entirely                      |

Global prefix set in deck frontmatter: `tablePrefix: Table` (default). Global suffix set in deck frontmatter: `tableNumberSuffix: ". "` (default).

`captionAlign` only controls caption text inside the TableBlock. To deliberately place a narrow table left or right, wrap it in a flex container with `justify-content:flex-start` or `justify-content:flex-end`.

**Caption slot — required for footnotes, links, or rich markdown.** Same as FigureBlock: the `caption` prop runs through the local stripped-down renderer; for footnote refs / reference-style links / Vue components in the caption, use the `#caption` slot instead. **Blank lines around `<template #caption>` and its inner content are required** for Slidev to process the slot as markdown — without them, refs render as literal text.

```vue
<TableBlock width="70%">

<template #caption>

Numbers compared against the He et al.[^resnet] baseline.

</template>

| Method | Acc |
|--------|-----|
| Ours   | 79  |

</TableBlock>

[^resnet]: He et al. CVPR 2016.
```

Default `<slot />` is reserved for the table markdown itself, so the caption slot must be the named `#caption`.

**WIP mode:** Add `wip` to show an red WIP badge inline after the caption. Table content still renders normally.

```vue
<TableBlock wip caption="Ablation study">

| Method | Acc |
|--------|-----|
| Ours   | ?   |

</TableBlock>
```

---

## `<Abs>`

Absolute-positioned container. Use inside `blank` or any layout for precise manual placement.

```vue
<Abs x="200" y="100" w="300" :z="10">

Content here

</Abs>
```

| Prop | Notes                                                                                                                                                     |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x`  | left position **(required)**; number → px, string → used as-is                                                                                            |
| `y`  | top position **(required)**                                                                                                                               |
| `w`  | width (optional)                                                                                                                                          |
| `z`  | z-index within the slide content layer, default `10`. Cannot override the section bar or other global overlays — they are in a separate stacking context. |

---

## `<PlotlyGraph>`

Renders an interactive Plotly.js chart from a JSON config file.

```vue
<PlotlyGraph
  filePath="/charts/results.json"
  :graphWidth="600"
  :graphHeight="400"
  :tickFontSize="12"
/>
```

| Prop                                | Notes                                    |
| ----------------------------------- | ---------------------------------------- |
| `filePath`                          | path to Plotly JSON spec                 |
| `graphWidth` / `graphHeight`        | override layout dimensions               |
| `xTitleFontSize` / `yTitleFontSize` | axis title font size                     |
| `tickFontSize`                      | tick label font size                     |
| `legendFontSize`                    | legend font size                         |
| `annotationFontSizeScale`           | multiplier for all annotation font sizes |

---

## `<QRCode>`

SVG QR code with optional caption.

```vue
<QRCode
  url="https://example.com"
  :size="160"
  color="#000000"
  background="#ffffff"
  caption="Scan for paper"
/>
```

| Prop         | Default     | Notes                                                     |
| ------------ | ----------- | --------------------------------------------------------- |
| `url`        | —           | required; URL to encode                                   |
| `size`       | `160`       | QR code size in pixels                                    |
| `color`      | `'#000000'` | foreground color                                          |
| `background` | `'#ffffff'` | background color                                          |
| `caption`    | `''`        | text below QR code                                        |
| `wip`        | `false`     | show WIP badge; renders placeholder when `url` is omitted |
