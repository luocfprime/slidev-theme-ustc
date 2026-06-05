# Authoring Beautiful Academic Decks

How to *design* a logically-clear, rigorous, visually-clean academic deck with this
theme — not just operate the template. The API docs tell you what knobs exist; this
tells you which to turn and why. When a rule here conflicts with the deck author's
explicit instruction, the author wins.

The fastest way to use this file: read **§0 the loop** and **§1 the ten rules**, design
from **§2–§5**, then run the **audit loop (§7)** until clean. Everything else is reference.

---

## 0. The loop: design → render → measure → fix

You author blind. Whether a slide overflows the fixed **980×552** canvas, whether a
bullet wraps to an ugly orphan, whether a wide figure leaves half a column empty —
none of it is visible in the Markdown. It is only knowable after the browser renders.
So the only reliable way to make slides that aren't ugly is a **feedback loop**:

1. **Outline first** (§2). Get the argument's spine right *before* building slides.
2. **Draft** a slide following the layout/density/figure rules (§3–§5).
3. **Measure** with the audit ruler: `node <skill>/scripts/audit-layout.mjs <url>` (§7).
4. **Resolve** each finding — fix it using its hint, *or* consciously accept it after
   looking (the flags are heuristics, not absolute defects; a deliberate airy slide or a
   sparse question slide can be correct). Re-measure as you go.
5. **Look** at borderline slides: `--shot` screenshots them — read the image with your
   own eyes for the things numbers can't catch (balance, taste, "feels off", and
   **legibility**: body text and figure labels readable at audience scale — the ruler
   does *not* check font size or contrast).

Numbers give you precision; the screenshot gives you taste; this file gives you the
rules. You need all three — a slide can pass every metric and still read badly, and a
slide can look fine in your head and overflow on screen.

---

## 1. The ten rules (the high-leverage core)

1. **A deck is an argument, not a document.** Don't dump the paper. Pick the one claim
   you can support in the time budget; everything else goes to `backup`.
2. **One job per slide.** If a slide does two things, split it. Every slide earns its
   place with **one clear point** — a figure, a result, a definition, *or* a sharp
   conceptual/transition/question statement. (A deliberate question or synthesis slide
   that is "just text" is fine; three vague bullets with no point is not.)
3. **Structure, not prose.** Slides show the *skeleton* of the argument. Short bullet
   fragments, never paragraphs. The #1 sign of a bad academic deck is walls of text.
4. **Motivation before formalism.** "Why?" before "What?". State each work's *task and
   motivation* before its method/results. Never a definition without context.
5. **Dense content, not dense *mode*.** Cover a lot — academic audiences expect
   information density — but achieve it with structure and terse wording, **not** by
   reaching for `density: dense` to shrink text. If it doesn't fit, cut or split first.
   `density: dense` + a half-empty slide (small text *and* whitespace) is the worst
   combination there is.
6. **Fill the canvas, evenly — by adding substance, not by cramming.** Aim for roughly
   **85–100%** vertical fill on body slides: this deck style dislikes conspicuous empty
   corners and a crammed slide sitting next to a near-empty one. But reach the target by
   *adding a figure, merging thin slides, or rebalancing* — **never** by shrinking text or
   packing in more words. Legibility and one-point-per-slide always win over a fill number.
7. **Wide figures span full width.** A long/wide figure (aspect ratio > ~2.5) in a
   `split` column is small *and* leaves the column empty below it. Put it full-width
   instead (§4).
8. **Cite on the slide, verify every citation.** Per-page footnotes where the work is
   discussed — **no trailing references page**. Credit every borrowed figure. Never
   invent a citation; check titles/venues against reality.
9. **Academic voice.** No colloquialisms, no stock filler phrases ("it is worth noting
   that", "in summary", "obviously" — in any language), no "not X, but Y" rhetorical
   templates, no invented abbreviations the audience can't decode. Don't oversell (no
   "SOTA" for older work — say "beats baseline X").
10. **Measure, then commit.** Run the audit + eyeball the screenshot before declaring a
    slide done. Keep a prior version when experimenting (A/B, then delete the loser) —
    never silently delete or rewrite the author's content.

---

## 2. Outline before you build

Decide the argument before touching slides.

- **Pick a spine and hold it.** Common academic spines:
  - *SCR* — Situation (what was known) → Complication (the gap) → Resolution (the contribution).
  - *Funnel* — broad context → specific gap → approach → findings → implications.
  - For a **survey deck**: group works by theme/section; within each section, one
    work per slide-cluster (motivation → method → results), capped at a page budget.
- **Deck architecture** (adapt; survey decks repeat the middle per topic):
  `cover → toc → [section divider → motivation → method → results]×N → conclusions/takeaways → end`.
- **Slide budget by talk length** — *starting ranges*, not quotas; adjust for speaking
  pace, Q&A/interaction, and how theory-heavy the content is (rehearsal time is the real
  test):

  | Duration | Body slides |
  |---|---|
  | 5 min (lightning) | 5–7 |
  | 10 min | 8–12 |
  | 15 min (conference) | 12–15 |
  | 20 min (seminar) | 15–18 |
  | 45 min | 30–40 |

- **Per-topic budget.** Cap each work/topic (e.g. ≤6 slides for a focus work, 1–2 for a
  minor mention). When a topic runs long, split with a *stated* logic
  (problem → approach → expected outcome), not arbitrarily. Merge near-duplicate slides.

### Title style — pick per scenario
Two valid schools; the theme supports both. Choose per deck and stay consistent:

- **Topic title + subtitle** (`# Method X` / `subtitle: Results & Insight`) — compact,
  scannable; the right default for **information-dense survey decks** with many works.
- **Action title** — the title is a full sentence stating the takeaway
  (`# Treatment effect holds across all three cohorts`). Strongest signposting:
  reading only the titles in sequence should tell the whole argument (the *ghost-deck
  test*). Prefer for **original-work talks** where you're making one sustained argument.

---

## 3. Density & fill (the rubric)

The single most common defect is wrong density/fill. Use this ladder:

- **Target fill ~85–100%** of usable body height on `content`/`split` body slides — as an
  aim, not a hard rule (see rule 6: never cram to hit it).
- **Overflow (fill > 100%)** — content past the frame, silently clipped. Fix **in this
  order**, content before cosmetics: (1) **trim wording / cut a weak item** — the cleanest
  fix; (2) if it's only slightly over and still readable, `density: compact` (and/or
  `margin: tight`); (3) if it's ≥20% over or holds ≥2 distinct ideas, **split into two
  slides**. Never use `density: dense` to cram what belongs on two slides. When you cut
  content to fit, **relocate it to a `backup` slide or notes and say what you moved — never
  silently delete** (see §8).
- **Under-full (fill < ~40%)** on a body slide → too empty. Add a figure, center the
  content, merge with a neighbour, or balance against an over-full neighbour.
- **`dense` + fill < 85%** → wrong tool. The text is shrunk but space is wasted. **Go up
  to `density: compact`** (the middle tier: body 1.4 → 1.22 → 1.05 rem). Compact fills
  fuller with more readable text. Only stay `dense` when `compact` overflows.
- The **density tiers**: `normal` (default, biggest) → `compact` (middle) → `dense`
  (tightest). Reach for the *largest* tier that still fits — bigger text is more
  readable. Don't hand-tune font sizes in `<style>` to fake an in-between size; the tiers
  are coordinated scale-downs.

**Per-slide upper bounds** (heuristics, not hard limits): ≤ ~40 words of body text,
≤ 7 bullets, ≤ 2 display equations, ≤ 5 new symbols, ≤ 2 callout/box components,
**one exhibit per results slide** — where an "exhibit" is *one analytical point*, which
may be a single figure or one coordinated multi-panel grid, not two unrelated charts.

---

## 4. Layout decision tree (choose by content shape)

Pick the layout from what the content *is*, not by habit. **Measure figure aspect
ratios first** — don't guess whether something fits. Aspect ratio is the strongest *cue*,
but also weigh label legibility and how much supporting text the figure needs.

```
Has a wide figure (AR > ~2.5, a wide strip)?
  └─ YES → content layout, figure FULL-WIDTH (text above, wide figure below at width 85–100%).
            A wide figure in a split column goes small and leaves a void below it.
Has a tall / square figure + supporting text?
  └─ YES → split (figure one side, text the other). For results, figure LEFT,
            interpretation RIGHT (evidence → interpretation reads left-to-right).
Has 2+ comparable figures?
  └─ YES → grid, tiled (4 landscape → 2×2), at the SAME size — and, more importantly,
            with consistent axes/scales/encodings so the comparison is honest.
Two competing approaches / prior-vs-ours?
  └─ YES → split or a 2-column comparison table, side-by-side (not sequential slides).
Mostly text, no figure?
  └─ content; density by the §3 budget. Break monotony — don't ship 3 identical
     bulleted slides in a row.
```

**Figure handling rules:**
- **Make figures big enough to read.** "Too small" is a defect. Control the *inner image*
  width (`imageWidth`) when you want the caption to span wider than the image; control the
  whole block with `width`.
- **Crop baked-in whitespace** from a figure before using it. A figure with a white band
  (any edge) is invisible on the white slide but glaring when zoomed — and wastes space.
  The audit flags this; fix the *source image*, don't paper over it.
- **Annotate the key finding directly on the figure** (arrow, box, color) when feasible —
  don't make the audience hunt for the point.
- **Same-size comparable figures.** When several figures are meant to be compared, render
  them at identical size.

**Vertical rhythm:** between stacked visual blocks (a `<Block>` and a `<Callout>`, a
figure and a `<Takeaway>`) that pack tight, one `<br>` adds breathing room — *but only
when the slide has room to spare*. If the slide is already full, don't; cut instead.

---

## 5. Components & chrome — taste

- **Don't over-box.** A plain bullet or a figure caption usually beats wrapping content in
  a labeled `<Block>` / `<Callout>` / `<Takeaway>`. Use at most one "box" per slide, and
  only when its semantic role genuinely fits. Stacking three components reads as clutter.
- **Lists:** use `(1) (2) (3)` for manual enumeration — **never** unicode markers like ①.
- **Section dividers** at genuine argument transitions (roughly every 5–8 slides in a long
  deck) — to re-orient, not to pad. Vary the layout when the content shape warrants it so
  the deck doesn't read as one template repeated.
- **`cover`:** title as a statement or question; author/affiliation/venue/date. One of the
  few places a darker/atmospheric background is appropriate.
- **`section`:** the divider slide; its `# h1` is the section title (shown large/centered).
- **`end`: the closing slide MUST have an `# h1`** — that h1 is the large centered line
  (e.g. `# Thank you`, or the closing line in the deck's language). Agents frequently
  forget it and ship a blank end slide;
  always include the h1. The end slide is a courtesy close — it does **not** replace a
  real **conclusions / takeaways** slide, which must come *before* it and carry the
  substantive last word.

---

## 6. Academic taboos — the explicit "avoid" list

Strong anti-patterns. Avoid all of these.

**Text & logic**
- Wall of text / paragraphs on a slide; reading the slide verbatim.
- Uniform bulleted pages (the #1 tell of an AI-generated deck) — vary composition.
- Topic-label titles when the deck uses action titles; burying the research question
  instead of giving it room.
- Sparse filler slides (3 bare bullets); equation dumps (formula isolated from its
  consequence; theorem + proof crammed together); introducing 5+ symbols at once or
  reusing one symbol for two meanings.
- AI-filler phrasing ("it is worth noting that", "in summary", "of great theoretical and
  practical significance", "obviously" — in any language), conversational hedging, the
  "not X, but Y" rhetorical template, invented unexplained abbreviations.

**Visual**
- Decorative clutter (clip art, icon-in-colored-circle, an accent line under every title).
- Full-bleed background images / gradients on *content* slides (reserve atmosphere for
  cover/section only); more than ~3–5 colors; color as decoration rather than to direct
  attention.
- Red/green as the only distinction (color-blind hostile — prefer blue/orange with a
  redundant cue); contrast below WCAG-AA 4.5:1.
- Mixed typefaces / drifting font sizes / misaligned grids; tiny fonts to cram content
  (remove content instead).
- Figures so small the labels can't be read; figures left with baked-in whitespace.

**Integrity**
- Uncited borrowed figures or data; hallucinated / unverified citations; overselling
  ("SOTA" on older work). Mark AI-generated figures discreetly. Drop the arXiv suffix when
  a work has a real published venue; annotate works with date, venue, and honors when
  relevant.

**Citation format.** Cite as a per-page footnote where the work is discussed — Slidev
footnotes: a `[^1]` marker in the text and `[^1]: …` at the slide's end (see SKILL.md's
footnote example for the mechanics; `footnote: flow` to render inline). Keep it short and
muted: author + short title + venue + year, e.g. `[^1]: Smith et al. "Title." NeurIPS 2024.`
Verify against the real source. No trailing references slide.

**Where "cut" content goes** (when a rule says relocate, not delete): the theme's `backup`
layout (appendix slides, `A.N`-numbered), or Slidev **speaker notes** — an HTML comment
`<!-- ... -->` at the very end of a slide's markdown, presenter-only and never rendered.

---

## 7. The audit ruler — how to run the loop

`scripts/audit-layout.mjs` (ships with this skill) is a measurement tool — a ruler. It
renders each slide in a real headless browser and reports only the render-truth defects
you're blind to, with a fix hint per finding. **It does not judge taste — this file does.**

```bash
# reuse a running `slidev` dev server (fastest), else it spawns one:
node <skill>/scripts/audit-layout.mjs http://localhost:3030
node <skill>/scripts/audit-layout.mjs slides.md            # audit a deck file
node <skill>/scripts/audit-layout.mjs <target> --slide 7   # one slide
node <skill>/scripts/audit-layout.mjs <target> --shot      # screenshot flagged slides → ./audit-shots/
node <skill>/scripts/audit-layout.mjs <target> --all       # list every slide's fill%, not just flagged
```

What it flags, and the canonical fix (the rubric the agent applies):

| Finding | Meaning | Fix |
|---|---|---|
| `OVERFLOW +Npx` | content past the frame | trim/cut first → `compact` if still readable → split (§3) |
| `SPARSE` (fill < 40%) | body slide too empty | add figure / center / merge / balance vs neighbour — *or accept if it's a deliberate question/transition slide* |
| `dense` + low fill | small text *and* whitespace | raise to `density: compact` |
| `WIDE FIGURE … in a split column` | wide figure (AR>2.5), void below it | full-width: `content` + figure `width≈100%` (AR is the cue; also weigh label legibility) |
| `IMAGE …: whitespace band` | image carries a whitespace band (any edge) | crop the **source** image — after confirming the band is non-semantic (not a label/margin) |
| `IMAGE …: upscaled N×` | raster figure upscaled (blurry) | use a higher-res source |
| `ORPHAN` | bullet/heading wraps to a tiny stub last line | rephrase, or adjust width, then re-render |

**Workflow:** run after drafting → resolve every flag (fix, or accept after a look — they
are warnings, not absolute defects) → re-run → `--shot` the borderline slides and read the
images, checking the things the ruler can't (legibility, contrast, balance). Requirements:
a headless browser (`@playwright/test` / `playwright`; present wherever `slidev export`
works). With no browser, fall back to the rules above as heuristics — but they're
approximate; the loop is what makes slides reliably not-ugly.

---

## 8. Process discipline

- **Self-verify visually.** After building, render and screenshot your own output, compare
  to the intended style, fix defects, re-screenshot. Don't declare done from the Markdown.
- **Preserve versions.** When trying an alternative, keep the prior slide as reference;
  offer A/B, let the author pick, *then* delete the loser. Never silently lose a variant.
- **Edit precisely; don't silently cut.** Relocate/restyle rather than delete content
  unless told. Don't rely on stale-git "restores" — make the exact edit.
- **Asset hygiene.** Name extracted media semantically (by caption/role), sort into
  per-topic folders, keep `node_modules`/vendor dirs out of the repo and archives.
- For Chinese decks: prose in Chinese, technical terms in English.
