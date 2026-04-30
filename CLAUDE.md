# Repository Agent Instructions

`AGENTS.md` is a symlink to this file. Keep this file useful for any coding
agent that works in the repository, not only Claude Code.

## Project

This repository publishes the Slidev theme package
`@luocfprime/slidev-theme-ustc`, a clean academic presentation theme. The
runtime package surface is defined by the `files` field in `package.json`:
`assets/`, `components/`, `layouts/`, `public/`, `setup/`, `styles/`,
`utils/`, and `global-top.vue`. Everything else is local development,
documentation, tests, examples, or release tooling.

The canonical local deck is `examples/full-deck.md`, accessed via the `examples/`
directory (a symlink into `skills/slidev-theme-ustc/references/examples/`). All
runnable demo decks—the full deck plus focused decks like `layouts.md`,
`components.md`, `math.md`, and `tweaks.md`—live together under `examples/`.
Editing these files changes both the local demos and the published agent skill
references.

## Commands

```bash
pnpm dev      # Start Slidev with examples/full-deck.md at http://localhost:3030
pnpm build    # Build examples/full-deck.md as a static SPA
pnpm export   # Export examples/full-deck.md to PDF; needs Playwright browser support
pnpm preview  # Build with GitHub Pages base URL and serve via serve.py
```

Playwright smoke tests expect the dev server to already be running on port 3030:

```bash
pnpm dev
npx playwright test
```

Use `pnpm` for local development. Release CI uses Node 24 and `npm publish`
because npm Trusted Publisher OIDC requires npm.

## Architecture

Slidev loads layouts from `layouts/`, auto-registers Vue components from
`components/`, runs setup hooks from `setup/`, includes `global-top.vue` as the
global layer, and imports `styles/index.ts` -> `styles/layout.css` for global
theme CSS.

Layouts are `default`, `content`, `split`, `toc`, `section`, `cover`, `end`,
`backup`, and `blank`. Layout props are frontmatter-driven through
`defineProps`. Content layouts expose density, margin, alignment, footnote,
line-height, footer, and section-bar controls. Structural layouts intentionally
do not expose all body controls; check `utils/defaults.ts` before adding a prop.

Components are auto-imported by Slidev. Structural/layout helpers are `Grid`,
`Block`, `Abs`, and `Takeaway`. Content and media components include `Callout`,
`FigureBlock`, `TableBlock`, `ResultBox`, `PlotlyGraph`, `QRCode`, and
`VideoBlock`. `PageFooter` is internal to layouts.

Shared helpers live in `utils/`:

- `defaults.ts`: centralized prop defaults for layouts and components.
- `layoutHelper.ts`: background, asset URL, body margin, section title, layout,
  and author/affiliation helpers. Prefer editing here instead of duplicating
  logic in layouts.
- `useAutoNumbering.ts`, `numbering.ts`, and `useLocalIndex.ts`: figure/table
  numbering and per-slide component indexing.
- `markdown.ts`: markdown-it helper utilities.

`global-top.vue` owns the shared figure/table numbering maps
(`figureMapShared`, `tableMapShared`) and the section bar height CSS variable
`--ustc-nav-h`. `setup/vite-plugins.ts` injects `_figureStart` and `_tableStart`
into slide frontmatter before virtual frontmatter modules compile, so build
mode keeps numbering stable even when slide content is stripped. Treat these as
one system when changing numbering.

`setup/main.ts` runs once on app mount. It imports KaTeX CSS and wires footnote
tooltips. `setup/transformers.ts` registers the Typst code-block transformer.
`vite.config.ts` is local Vite config and currently filters known dependency
sourcemap noise.

## Editing Guidelines

Keep changes scoped to the published runtime surface unless the task is about
demos, tests, docs, skills, or release metadata.

For layout behavior, start in `utils/defaults.ts`, `utils/layoutHelper.ts`, and
the relevant layout file. Use existing CSS variables in `styles/layout.css`
instead of hardcoding new values. Add a new CSS variable only when it is a real
theme knob and document it in `skills/slidev-theme-ustc/references/api/theme-tokens.md`.

For component API changes, update the component, any shared defaults/helpers,
the canonical full-deck demo when useful, and
`skills/slidev-theme-ustc/references/api/components.md`. The skill is the current
source for frontmatter, component prop, and CSS variable usage documentation;
there is no `docs/configuration.md`.

For assets, put files that need Vite processing in `assets/` and import them
from code. Put files that should be served as-is at runtime in `public/` and
reference them with root-relative paths such as `/Graph/plotly1.json`.

Avoid changing generated or local-only output directories: `dist/`, `.slidev/`,
`test-results/`, `playwright-report/`, `node_modules/`, and `.worktrees/`.

## Verification

Always run `pnpm build` and confirm it exits with `built` before creating any
commit that touches `examples/full-deck.md`, `layouts/`, `components/`, `setup/`,
`styles/`, `utils/`, `global-top.vue`, or package configuration.

Run `npx playwright test` when a change affects rendered slides, navigation,
layout chrome, numbering, media loading, or browser setup behavior. Remember to
start `pnpm dev` first and leave it running on port 3030.

For documentation-only changes to this file, `README.md`, issue templates, or
internal planning notes, a build is optional unless the docs describe behavior
you also changed.

## Publishing

To publish, bump `package.json` version, commit, tag, and push the tag:

```bash
git add package.json
git commit -m "chore: bump version to X.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```

Then create the GitHub Release:

```bash
gh release create vX.Y.Z --generate-notes --title "vX.Y.Z"
```

If `skills/slidev-theme-ustc/SKILL.md` or any file under
`skills/slidev-theme-ustc/references/` changed since the previous release, bump
`.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` to the same
`X.Y.Z` version before committing.

The release workflow validates that the tag matches `package.json` version. The
manual `workflow_dispatch` input expects a tag-style version such as `v0.1.6`.

Local pre-publish smoke test:

```bash
pnpm pack --pack-destination /tmp/
cd /tmp/<test-dir>
npm install /tmp/luocfprime-slidev-theme-ustc-X.Y.Z.tgz
npx slidev slides.md
```

When adding a new top-level runtime file or directory, update the `files` field
in `package.json`; that field is the authoritative published-file list.
