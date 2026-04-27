# USTC Slidev Theme

A clean academic Slidev theme for USTC presentations.

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
|-- global-top.vue       # Global Slidev layer
|-- example.md           # Main local template deck
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
theme: @avencastf/slidev-theme-ustc
---
```

See `docs/configuration.md` for supported frontmatter options, component props, and CSS variables.
