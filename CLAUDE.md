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
pnpm dev        # Start Slidev with examples/full-deck.md at http://localhost:3030
pnpm build      # Build examples/full-deck.md as a static SPA
pnpm export     # Export examples/full-deck.md to PDF; needs Playwright browser support
pnpm preview    # Build with GitHub Pages base URL and serve via serve.py
pnpm test       # Run all tests: unit tests then Playwright DOM assertions
pnpm test:unit  # Unit tests only (fast, no browser)
```

`pnpm test` starts the fixture Slidev servers automatically — no need to run `pnpm dev`
first. Playwright tests use isolated fixture decks under `tests/fixtures/`, not
`examples/full-deck.md`.

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
`VideoBlock`. `PageFooter` and `BodyLayout` are internal to layouts.

Shared helpers live in `utils/`:

- `defaults.ts`: centralized prop defaults for layouts and components.
- `layoutHelper.ts`: background, asset URL, body margin, section title, layout,
  and author/affiliation helpers. Prefer editing here instead of duplicating
  logic in layouts.
- `sectionModel.ts`: the single source of truth for section-bar and TOC section
  grouping. Reuse it instead of re-scanning `$slidev.nav.slides`.
- `blockNumberTransform.ts`: compile-time figure/table numbering injection for
  static `<FigureBlock>` and `<TableBlock>` tags.
- `markdown.ts`: markdown-it helper utilities.

`global-top.vue` owns only the section bar height CSS variable `--ustc-nav-h`.
Figure/table numbering is injected at compile time by
`setup/transformers.ts` using `utils/blockNumberTransform.ts`, so dev, build,
and export share the same source-order numbering path.

`setup/main.ts` runs once on app mount. It imports KaTeX CSS and wires footnote
tooltips. `setup/transformers.ts` registers the Typst code-block transformer.
`vite.config.ts` is local Vite config for repository demos and tests. Published
runtime behavior must live under the package `files` surface.

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

## Code Review Style

When reviewing code for this project, self-reflect multiple rounds before
presenting findings. Do not surface a finding until you have:

1. Verified it is real (read the actual code, not a summary).
2. Traced the actual consequence — not a theoretical one. If the consequence
   is "zero today, possible future confusion," say that plainly.
3. Checked whether fixing it is consistent with the project's taste (see
   Long-term Maintainability below) or would introduce more churn than value.

Present findings honestly: if there are no serious problems, say so directly
rather than padding with minor issues at inflated severity. For each finding,
state: what it is → when it actually causes visible harm → the recommended
action → whether that action is worth taking or better left alone. Let the
developer decide based on real information, not alarming framing.

## Long-term Maintainability

This theme is built to be maintained over time, not patched into a working state
for a single use case. Prioritize clean, idiomatic solutions over workarounds.

Treat AI coding agents as planning and design partners, not blind executors.
When a requested feature reaches beyond Slidev's stable extension points or
requires inferred runtime state, parsing compiled slide source, depending on
dev-only metadata, or otherwise fighting the framework, stop and surface the
constraint before implementing. Prefer a smaller explicit API that matches
Slidev's model over a clever hidden linkage. For example, slide-level signals
such as section-bar markers and watermarks should be driven by slide
frontmatter; component props should affect only that component unless Slidev
provides a clean, documented way to promote component state to slide metadata.
When considering any new feature, explicitly check whether it works in both
interactive runtime/dev mode and static build/export mode. The ideal design
supports both. If the feature can only work in one mode, or would behave
differently between dev and build/export, explain the limitation and get an
explicit developer decision before continuing with implementation.

If a feature cannot be implemented cleanly—for example, it requires reaching
into Slidev internals, abusing CSS in ways that will break across Slidev
versions, or duct-taping Vue reactivity—**stop and flag it** rather than
implementing it silently. Explain to the developer:

1. Why the clean approach is blocked (Slidev API limitation, framework
   constraint, etc.).
2. What the hack would look like and why it's fragile.
3. What a better long-term path might be: a Slidev upstream issue, a different
   API surface, a scoped workaround with a clear comment, or deferring the
   feature entirely.

A feature that ships as an undocumented hack becomes maintenance debt for every
future contributor. It is better to ship nothing, or a limited but honest
implementation, than to ship something that silently breaks later.

The same principle applies to bug fixes. Before applying a minimal patch, ask
whether the bug is a symptom of a deeper design problem. A one-line fix that
papers over a structural flaw leaves the flaw intact and often causes the same
class of bug to resurface elsewhere. If the root cause points to a design
issue—wrong abstraction boundary, missing single source of truth, fragile
coupling between subsystems—say so explicitly. Propose the architectural fix
even if it is larger in scope, and let the developer decide whether to address
it now or track it as known debt. Never silently treat the symptom while
ignoring the cause.

When the developer is explicitly asking for a root-cause solution, a
fundamental redesign, or a thorough refactor, do not deflect into small
incremental patches as a way to avoid the hard design question. Small fixes are
appropriate only after the structural problem has been named and the tradeoff is
made explicit. If the correct answer is a deeper redesign, present that design
directly, including its cost and migration path, rather than circling around the
issue with local cleanups.

Before adding or expanding any feature, run an implementation-boundary check and
state the answers in the plan or commit context:

- Does it behave the same in interactive dev, static build, and export?
- Does it rely on Slidev internals, virtual module names, or dev-only metadata?
- Does it parse user markdown/Vue source directly? If yes, what syntax is
  explicitly supported and what is out of scope?
- Does it inspect or mutate rendered DOM after Vue has mounted?
- Is there an explicit frontmatter/component/CSS-variable API, or is behavior
  inferred from hidden runtime state?
- If the implementation is intentionally limited or hacky, is that boundary
  documented in the skill/reference docs?

## Testing

### When to run tests

Run `pnpm test` before committing any change to the runtime surface (`layouts/`,
`components/`, `setup/`, `styles/`, `utils/`, `global-top.vue`). It runs unit
tests first, then Playwright DOM assertions against fixture decks — no manual
server startup needed.

### Adding tests for new features

Global features — anything that affects numbering, section-bar state, layout
chrome, or cross-slide behavior — should get a Playwright DOM assertion test:

1. Add or extend a fixture deck under `tests/fixtures/` (keep it minimal; only
   the slides needed to exercise the feature).
2. Write a spec file named `<feature>*.spec.mjs` in `tests/`. Playwright routes
   it to the right fixture server based on the filename prefix (see
   `playwright.config.mjs`).
3. Scope every locator through `page.locator('.slidev-layout:visible').first()`
   — Slidev renders all slides in DOM simultaneously, so unscoped locators
   silently match hidden slides.

Pure logic in `utils/` should get a `*.test.mjs` unit test instead; it is
auto-collected by `pnpm test:unit` without configuration changes.

### What not to test

Tests should verify real behavioral boundaries, not pad coverage:

- Do not test trivially obvious outcomes (e.g., `wip: false` returns false).
- Do not test the absence of UI elements on structural layouts (cover, toc) that
  never rendered that element to begin with.
- Do not write two assertions that are logical consequences of each other (if
  the first passes, the second cannot fail independently).
- Do not depend on `examples/full-deck.md` for tests — it is actively edited and
  not a stable fixture. Use `tests/fixtures/` instead.

### Fixture deck discipline

Each fixture deck under `tests/fixtures/` should be the smallest deck that
exercises the feature under test. Annotate the slide layout in a header comment
inside the spec file. New fixture servers need a matching entry in
`playwright.config.mjs` (`webServer` + `projects`).

## Verification

Always run `pnpm build` and confirm it exits with `built` before creating any
commit that touches `examples/full-deck.md`, `layouts/`, `components/`, `setup/`,
`styles/`, `utils/`, `global-top.vue`, or package configuration.

For documentation-only changes to this file, `README.md`, issue templates, or
internal planning notes, a build is optional unless the docs describe behavior
you also changed.

## Post-Implementation Quality Check

After completing any code change — new feature or bug fix — before declaring the
task done:

1. Re-read this `CLAUDE.md` to refresh the rules in full context.
2. Launch a subagent via the `Agent` tool (`subagent_type: "superpowers:code-reviewer"`)
   to perform an objective quality check. Brief it with:
   - The specific files changed and what the change was intended to do.
   - A pointer to this `CLAUDE.md` as the authoritative ruleset.
   - An explicit ask: does the implementation satisfy every relevant rule in
     `CLAUDE.md`? Flag any violation, even if minor.
3. If the subagent surfaces a real finding, fix it before proceeding. If it
   finds nothing, state that clearly so the developer knows the check ran.

The subagent must not be the same context that wrote the code — its value comes
from a fresh, neutral read. Do not skip this step on the grounds that the change
was "small" or "obvious."

## Publishing

Before bumping the version, run `pnpm test:visual` to catch any unintended visual regressions. If tests fail, review the diffs with `playwright show-report` and either fix the regression or update baselines with `pnpm test:visual:update`.

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
