# Design & Layout Guidelines

Long-form companion to the **Design Principles** section in SKILL.md. Read this when you're choosing whether to use a feature, fine-tuning a slide's layout, or deciding how aggressively to override the theme.

---

## The Precedence Ladder for Adjustments

When a slide doesn't look right, climb in this order. **Stop at the first step that solves the problem.**

1. **Frontmatter prop** — `density`, `margin`, `align`, `lineHeight`, `ratio`, `gap`, `cols`. The theme was designed around these; they survive upgrades and combine cleanly.
2. **CSS variable override scoped to a wrapper `<div>` or to `.slidev-layout`.** Slidev auto-scopes `<style>` blocks per slide, so `:root { … }` from a slide does **not** reach `:root`. Two scoping levels are available:
   - _Element scope_ — wrap the affected content in `<div class="my-scope">…</div>` and override variables on `.my-scope` in the slide's `<style>`. Only descendants of that wrapper pick up the new values.
   - _Slide scope_ — write `.slidev-layout { --vars }` in the slide's `<style>`. Every element inside `.slidev-layout` (h1, body, tables, footer, **section bar**) inherits the override. The `<style>` is auto-scoped by Slidev, so it only applies to the current slide.
     For _deck-wide_ overrides (brand color, base font size everywhere), put `:root { … }` in `styles/index.css` at the deck root, **not** in a slide. See [theme-tokens.md](api/theme-tokens.md) for the catalog.
3. **Wrap a theme component in a plain `<div style="…">`** to apply layout/styling. Don't try to put `style` or `class` directly on `<Block>`/`<Callout>`/etc. — Slidev's markdown→Vue compilation makes attribute passthrough on theme components unreliable, and scoped `<style>` selectors targeting a child component's root don't always match. A raw `<div>` is plain HTML; inline `style` on it lands on the DOM with zero plumbing.
4. **A `<style>` block with a class selector on slide-template elements** (raw `<div class="…">`, `<p>`, `<table>` you wrote yourself in the slide). These are scoped correctly and reliably matched.
5. **Propose a feature request or PR against the theme repo** if none of steps 1–4 can express the change cleanly. **Never edit the installed theme** — i.e. never modify any file under `node_modules/@luocfprime/slidev-theme-ustc/` (or the equivalent in your package manager's store). Those files are outside project scope: every `npm install` / `pnpm install` wipes them, the change does not version-control with your deck, and your deck silently forks from upstream. Open an issue or PR against the theme repo and stay on a published version until it lands.

Rule of thumb: one-shot change → step 3 or 4 (wrapper `<div>`). Deck-wide change → `styles/index.css`. Reusable theme-level change → upstream feature request / PR. **Editing `node_modules` is never the answer.**

### Deck-local CSS restraint

Keep `style.css` short and deck-specific. It should usually do only two things:

- Brand/theme adaptation for this deck, preferably through CSS variables such as `--ustc-blue`.
- Local layout helpers that the theme API cannot express cleanly.

Do not copy large chunks of theme CSS into a deck. If the deck links a local theme package, fix reusable behavior in the theme repo instead of shadowing it in `style.css`.

Avoid overriding theme internals such as `toc`, section-bar arrows, footer chrome, or component base styles unless the user explicitly asks for a deck-specific fork. The theme's built-in TOC should remain visually recognizable; custom arrows and copied selectors often look harsher or drift from the package after updates.

---

## Layout Fine-Tuning Recipes

### Limit a component's width inside a Grid

Wrap the component in a `<div>` — the wrapper becomes the grid item and carries `justify-self` / `max-width`:

```vue
<Grid cols="2" gap="lg">
  <Block title="A">…</Block>
  <div style="justify-self: center; max-width: 26rem;">
    <Block title="B">…</Block>
  </div>
</Grid>
```

### Use gutter columns instead of widths

```vue
<Grid cols="1 8 8 1" gap="md">
  <div></div>
  <Block>…</Block>
  <Block>…</Block>
  <div></div>
</Grid>
```

`cols="1 8 8 1"` reads as four fr-units; the empty cells become natural gutters. Cleaner than per-component `max-width` when several slides need consistent inset width.

### Force equal height in a Grid

The theme `<Grid>` sets `align-items: start`, so items don't stretch to row height. To get equal-height items across mismatched-length components, replace `<Grid>` with raw native CSS Grid — native default is `align-items: stretch`:

```vue
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem;">
  <Block title="A">one line</Block>
  <Callout type="tip" title="B">two<br>bullets</Callout>
  <ResultBox title="C">four<br>bullets<br>of<br>content</ResultBox>
</div>
```

The boxes now stretch to the row's height (the tallest item defines the row). Their internal layout (title + body) still top-aligns, leaving whitespace at the bottom of shorter items — that's expected.

### Centring inside a Grid cell

When you wrap a component in a `<div>` to width-limit it, also use `justify-self: center` to centre the wrapper within its cell:

```vue
<div style="justify-self: center; max-width: 18rem;">
  <Block>…</Block>
</div>
```

`margin-inline: auto` doesn't help here — Grid's default `justify-items: stretch` leaves no free space for auto margin to absorb. Use `justify-self: center` on grid items.

### Reclaim page padding without shrinking text

Try `margin: tight` (or `tighter`, or `none`) **before** reaching for `density: dense` when the problem is slide padding. `margin` reduces the layout's top/side padding; `density` rescales typography. Paragraph and list rhythm are separate CSS rules, so adjust them with a scoped CSS wrapper if that is the actual problem.

### Per-slide font-size tweak (or any per-slide variable override)

Slidev `<style>` blocks are scoped to the slide, so `:root { --ustc-fs-body: … }` from a slide does not reach `:root`. Use a wrapper `<div class="…">` instead:

```vue
<div class="smaller-body">

Body text…

| col | col |
| --- | --- |
| ...   | ...   |

</div>

<style>
.smaller-body {
  --ustc-fs-body: 1.25rem;
}
</style>
```

Children inherit the override via CSS variable cascade. For a deck-wide override, put `:root { --ustc-fs-body: 1.25rem; }` in `styles/index.css` at the deck root — that file is loaded as a global stylesheet.

A direct `p { font-size: … }` desyncs the theme's coordinated proportions (table cells, list spacing, blockquote, line-height). Variables keep them in step.

### Mix dense and normal in the same deck

`density: dense` is per-slide. The audience won't notice density changes between separated slides; they will notice mid-slide proportion breakage from ad-hoc font-size hacks. Use `dense` only on the slides that actually overflow.

### Exact positioning

`<Abs>` does not reflow — swap a figure for a wider one and the layout silently breaks. Reach for it only inside `layout: blank` or for floating annotations on top of an otherwise normal slide. For everything else, prefer `<Grid>` plus natural document flow.

---

## When NOT to Use a Feature

| Feature                                                             | Skip when                                                                                                                                                       |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subtitle` (`default` / `content` / `split`)                        | Title alone is unambiguous → omit `subtitle:` (the layout is fine — subtitle is just opt-in)                                                                    |
| `density: dense`                                                    | Slide already fits in normal density                                                                                                                            |
| `<Callout>`                                                         | Message has no specific _type_ (note/tip/warning/…) → use `<Block>`                                                                                             |
| `<Takeaway>`                                                        | Slide has more than one main point — split the slide instead                                                                                                    |
| `<ResultBox>`                                                       | The result reads naturally inline rather than as a quotable boxed answer                                                                                        |
| `footnote: flow`                                                    | Footnote is supplementary — overlay (default) is correct                                                                                                        |
| `<Abs>`                                                             | Content participates in document flow                                                                                                                           |
| `sectionBar: false`                                                 | Motivation is just "more vertical space" → try `margin: tight` first                                                                                            |
| Editing files under `node_modules/.../slidev-theme-ustc/`           | **Never** — outside project scope; wiped on reinstall. Use a wrapper `<div style="…">` for one-offs; file an upstream feature request / PR for reusable changes |
| Putting `style="…"` or `class="…"` on a theme component in markdown | **Skip** — passthrough is unreliable in Slidev's markdown→Vue compilation. Wrap in a plain `<div style="…">` instead                                            |

---

## Component Selection, Quick Heuristics

SKILL.md has the semantic table. Three deciding questions when several components seem to fit:

1. **Does the box need an icon and severity color?** Yes → `<Callout>`. No → `<Block>` or `<ResultBox>`.
2. **Is this the slide's single key message?** Yes → `<Takeaway>`. Otherwise don't use Takeaway.
3. **Is the content a measured number, theorem, or final answer?** Yes → `<ResultBox>`. Otherwise → `<Block>`.

If you're wrapping every paragraph in a component, undo it. Plain markdown is usually right.

---

## Sanity Checks Before Committing

- Did I render the slide with `pnpm dev`? Theme issues are visual, not textual.
- If I added a feature: would the slide be _worse_ without it?
- If I overrode a CSS variable: deck-wide intent (→ `styles/index.css`) or a single-slide tweak (→ wrapper `<div class="…">` + scoped `<style>`)?
- If the wrapper `<div>` approach feels heavy: am I sure a frontmatter prop or CSS variable can't already do this?

---

## Working demos

[`examples/tweaks.md`](examples/tweaks.md) — runnable deck with before/after slides for each recipe above (`slidev examples/tweaks.md`).
