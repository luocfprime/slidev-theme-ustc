# Components Reference

All components are auto-imported by Slidev — no import needed.

---

## `<Grid>`

CSS grid container.

```vue
<Grid cols="2" gap="md" alignY="top">

Left cell

<div>Right cell</div>

</Grid>
```

| Prop | Type | Default | Values |
|------|------|---------|--------|
| `cols` | string | `'2'` | `'3'`, `'1 2 1'`, `'1fr 2fr'`, `'300px 1fr'` |
| `gap` | string | `'md'` | `'sm'` (0.6rem) · `'md'` (1.2rem) · `'lg'` (2rem) |
| `align` | string | `'top'` | `'top'` · `'center'` · `'bottom'` |

`cols` resolution: single digit → `repeat(n, 1fr)`; space-separated numbers → `Nfr` each; anything else → used verbatim.

---

## `<Block>`

Labeled container with header bar and bordered box.

```vue
<Block title="Definition">

Content inside the block.

</Block>
```

`title` is optional and supports markdown.

---

## `<Callout>`

Alert box with icon and colored left border.

```vue
<Callout type="tip" title="Key Insight">

Body text here.

</Callout>
```

| `type` | Icon | Color |
|--------|------|-------|
| `note` (default) | info | blue |
| `tip` | lightbulb | teal |
| `warning` | alert | amber |
| `important` | alert-circle | red |
| `example` | beaker | purple |

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

## `<ResultBox>`

Result/conclusion box with 2px border.

```vue
<ResultBox title="Main Result">

Our method achieves 94.3% accuracy.

</ResultBox>
```

`title` is optional and supports markdown.

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

| Prop | Default | Notes |
|------|---------|-------|
| `src` | — | required unless `wip` is set |
| `alt` | `''` | accessibility |
| `caption` | `''` | — |
| `width` | `'100%'` | outer container width |
| `imageWidth` | `'100%'` | image element (max-height: 30rem) |
| `captionAlign` | `'center'` | `'left'` · `'center'` |
| `captionInsetLeft` | `0` | padding-left on caption |
| `captionInsetRight` | `0` | padding-right on caption |
| `prefix` | global `figurePrefix` | per-figure label override |
| `wip` | `false` | mark figure as work-in-progress; shows red WIP badge |

Global prefix set in deck frontmatter: `figurePrefix: Figure` (default).

**WIP mode:** Add `wip` to show a red badge. Use a [placehold.co](https://placehold.co) URL as `src` to hold the correct aspect ratio while the real image is not ready.

```vue
<!-- placeholder — no image yet, holds 4:3 space -->
<FigureBlock wip src="https://placehold.co/800x600" caption="Experiment results" />

<!-- draft — image exists but not finalised -->
<FigureBlock wip src="/fig-draft.png" caption="Experiment results" />
```

---

## `<VideoBlock>`

Video with optional caption. Mirrors `FigureBlock` API (no auto-numbering).

```vue
<VideoBlock
  src="/videos/demo.mp4"
  caption="Description of the video"
  width="80%"
  :controls="true"
/>
```

| Prop | Default | Notes |
|------|---------|-------|
| `src` | — | required; `/`-prefixed paths get `BASE_URL` prepended |
| `caption` | `''` | supports markdown |
| `width` | `'100%'` | outer container width |
| `videoWidth` | `'100%'` | `<video>` element width |
| `captionAlign` | `'center'` | `'left'` · `'center'` |
| `captionInsetLeft` | `0` | padding-left on caption |
| `captionInsetRight` | `0` | padding-right on caption |
| `controls` | `true` | show browser video controls |
| `autoplay` | `false` | autoplay (forces `muted`) |
| `loop` | `false` | loop playback |
| `muted` | `false` | mute audio |

`playsinline` is always set (iOS compatibility). Place files under `public/videos/` and reference as `/videos/file.mp4`.

---

## `<TableBlock>`

Table wrapper with auto-numbered caption. Counter is global across the entire deck.

```vue
<TableBlock caption="Comparison results" captionAlign="center">

| Method | Acc | F1 |
|--------|-----|----|
| Ours   | 94  | 93 |

</TableBlock>
```

| Prop | Default | Notes |
|------|---------|-------|
| `caption` | `''` | — |
| `captionAlign` | `'center'` | `'left'` · `'center'` |
| `width` | `'100%'` | container width |
| `prefix` | global `tablePrefix` | per-table label override |
| `wip` | `false` | mark table as work-in-progress; shows red WIP badge next to caption |

Global prefix set in deck frontmatter: `tablePrefix: Table` (default).

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

| Prop | Notes |
|------|-------|
| `x` | left position; number → px, string → used as-is |
| `y` | top position |
| `w` | width (optional) |
| `z` | z-index within the slide content layer, default `10`. Cannot override the section bar or other global overlays — they are in a separate stacking context. |

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

| Prop | Notes |
|------|-------|
| `filePath` | path to Plotly JSON spec |
| `graphWidth` / `graphHeight` | override layout dimensions |
| `xTitleFontSize` / `yTitleFontSize` | axis title font size |
| `tickFontSize` | tick label font size |
| `legendFontSize` | legend font size |
| `annotationFontSizeScale` | multiplier for all annotation font sizes |

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

| Prop | Default | Notes |
|------|---------|-------|
| `url` | — | required; URL to encode |
| `size` | `160` | QR code size in pixels |
| `color` | `'#000000'` | foreground color |
| `background` | `'#ffffff'` | background color |
| `caption` | `''` | text below QR code |
