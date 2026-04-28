# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server with example.md at http://localhost:3030
pnpm build    # Build example.md as static SPA
pnpm export   # Export to PDF (requires playwright-chromium installed separately)
pnpm preview  # Build with GitHub Pages base URL and serve locally via serve.py
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

**`global-top.vue`** is the single source of truth for figure/table auto-numbering state (`figureMapShared`, `tableMapShared`). It reactively rebuilds page→startNumber maps whenever the slide list changes (via `watchEffect`), and sets `--ustc-nav-h` on `<html>` based on section-bar visibility.

**`example.md`** is the canonical demo deck and the dev/build entry point. `examples/` holds per-feature demo decks (math, layouts, components).

## Before Committing

Always run `pnpm build` and confirm it exits with `✓ built` before creating any commit that touches `example.md`, layouts, components, or `setup/`. A build error that reaches a commit is harder to debug and blocks users.

## Theme Usage

`example.md` references the theme as `theme: ./`. CSS variables and frontmatter options are documented in `docs/configuration.md`.

## Publishing

Bump `package.json` version, commit, then tag to trigger the npm release workflow:

```bash
# edit package.json version, then:
git add package.json && git commit -m "chore: bump version to X.Y.Z"
git tag vX.Y.Z && git push origin main --tags

# create the GitHub Release:
gh release create vX.Y.Z --generate-notes --title "vX.Y.Z"
```

The workflow validates that the tag matches `package.json` version before publishing. It uses **Node 24 + `npm publish`** (not pnpm) — required for npm Trusted Publisher OIDC. The `workflow_dispatch` trigger accepts a `version` input (e.g. `v0.1.1`) for manual re-runs.

**Local pre-publish testing:**

```bash
pnpm pack --pack-destination /tmp/
cd /tmp/<test-dir> && npm install /tmp/luocfprime-slidev-theme-ustc-X.Y.Z.tgz
npx slidev slides.md   # verify dev server, logo, no warnings
```

**Published files:** `assets/`, `components/`, `layouts/`, `public/`, `setup/`, `styles/`, `utils/`, `global-top.vue`, `vite.config.ts`. Add new top-level files to the `files` field in `package.json`.

**`assets/` vs `public/`:** Files needing Vite processing (hashed URLs, tree-shaking) go in `assets/` and are imported with `import ... from '../assets/...'`. Files served as-is at runtime (images, videos, JSON) go in `public/`.
