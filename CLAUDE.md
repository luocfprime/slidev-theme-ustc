# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server with example.md at http://localhost:3030
pnpm build    # Build example.md as static SPA
pnpm export   # Export to PDF (requires playwright-chromium installed separately)
```

**Tests** require the dev server to already be running on port 3030:

```bash
pnpm dev &
npx playwright test
```

## Architecture

This is a Slidev theme package (`@luocfprime/slidev-theme-ustc`). The published surface is `components/`, `layouts/`, `public/`, `setup/`, `styles/`, `utils/`, and `global-top.vue`. Everything else (`example.md`, `examples/`, `tests/`, `docs/`) is local-only and excluded from npm.

**Runtime flow:** Slidev picks up layouts from `layouts/`, auto-registers components from `components/`, runs `setup/main.ts` once on app mount (KaTeX CSS + footnote tooltips), and loads `styles/index.ts` → `styles/layout.css` for global CSS. Shared helpers used by both layouts and components live in `utils/`.

**Layouts** (`content`, `split`, `toc`, `section`, `cover`, `end`, `backup`, `blank`, `default`) accept frontmatter props via `defineProps`. Per-slide density, line-height, and section-bar overrides are all frontmatter-driven. The `toc` layout uses `highlight` (1-based section index) to highlight the active entry.

**Components** are auto-imported by Slidev. Structural ones: `Grid`, `Block`, `Abs`, `Takeaway`. Content ones: `Callout`, `FigureBlock`, `TableBlock`, `ResultBox`, `PlotlyGraph`, `QRCode`. `PageFooter` is used internally by layouts.

**`utils/`**: `layoutHelper.ts` — shared CSS-in-JS helpers for background, margin, and grid resolution; also exports `getLayout()` and `getSectionTitle()` used by `toc.vue`, `PageFooter.vue`, and `global-top.vue` — edit once here, not in each file. `numbering.ts` — figure/table auto-numbering. `markdown.ts` — markdown-it helpers. `defaults.ts` — shared prop defaults.

**`global-top.vue`** is the single source of truth for figure/table auto-numbering state (`figureMapShared`, `tableMapShared`). It scans all slide sources on mount to build page→startNumber maps, and sets `--ustc-nav-h` on `<html>` based on section-bar visibility.

**`example.md`** is the canonical demo deck and the dev/build entry point. `examples/` holds per-feature demo decks (math, layouts, components).

## Theme Usage

`example.md` references the theme as `theme: ./`. CSS variables and frontmatter options are documented in `docs/configuration.md`.
