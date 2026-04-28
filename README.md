# USTC Slidev Theme

A clean academic Slidev theme for USTC presentations. This theme is inspired by [slidev-theme-hep](https://github.com/AvencastF/slidev-theme-hep).

> [!NOTE]
> This is a presentation theme template. All names, affiliations, titles, dates, and other content appearing in the example slides are fictional placeholders and do not represent real people or events. Factual claims, data, and technical content in the examples are for demonstration purposes only and may be inaccurate.

## Development

```bash
pnpm install
pnpm dev
pnpm build
```

`pnpm dev` opens `example.md`, which is the canonical local template deck for this theme.

## Template Entry

This theme keeps `example.md` as the template entry so users can copy or inspect one complete starter deck.

## Project Structure

This repository follows Slidev's conventional directories and keeps theme runtime files separate from local demos and tests.

```text
.
|-- components/          # Auto-registered Vue components for slides
|-- layouts/             # Theme layouts, including overrides for default/cover/section
|-- public/              # Static assets served from /
|-- setup/               # Slidev app setup and browser hooks
|-- styles/              # Global theme CSS entry
|-- utils/               # Internal helpers shared by layouts/components
|-- scripts/             # Local QA and maintenance scripts
|-- docs/                # Theme usage and configuration docs
|-- examples/            # Additional demo decks
|-- tests/               # Playwright smoke tests for rendered slides
|-- skills/              # Claude Code skill for this theme
|-- global-top.vue       # Global Slidev layer
|-- example.md           # Symlink → skills/slidev-theme-ustc/references/example.md
`-- vite.config.ts       # Vite extension config
```

## Published Files

The `files` field in `package.json` only publishes the theme runtime surface:

- `components/`, `layouts/`, `public/`, `setup/`, `styles/`, `utils/`
- `global-top.vue`, `vite.config.ts`
- `docs/configuration.md`

Local template decks, extra examples, tests, and generated build output are intentionally excluded from the npm package.

## Usage

```md
---
theme: @luocfprime/slidev-theme-ustc
---
```

See `docs/configuration.md` for supported frontmatter options, component props, and CSS variables.

## Typst Support

The theme bundles [Typst](https://typst.app) rendering support (vendored from [slidev-addon-typst](https://github.com/shigma/slidev-addon-typst), MIT). Use a `typst` code block to render Typst content inline:

````md
```typst
#table(
  columns: 3,
  [*Method*], [*Accuracy*], [*Speed*],
  [Ours], [97.9%], [18 ms],
)
```
````

Note: `#set page(...)` is not supported — page dimensions are controlled by the slide layout.

## Agent Skill

> [!TIP]
> **Claude Code** — add this repo as a plugin marketplace, then install:
> ```
> /plugin marketplace add luocfprime/slidev-theme-ustc
> /plugin install slidev-theme-ustc@slidev-theme-ustc
> ```
> Then run `/reload-plugins` to activate.

> [!TIP]
> **Other agents (Copilot, Gemini CLI, Codex, …)** — install via [`npx skills`](https://github.com/vercel-labs/skills):
> ```
> npx skills add luocfprime/slidev-theme-ustc
> ```
> To install globally (all projects) or target a specific agent:
> ```
> npx skills add luocfprime/slidev-theme-ustc
> ```
