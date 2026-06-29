# Visual Rubric

Use this before declaring slides ready.

## The Target

Slides should be clean, compact, and readable. Both extremes are defects:

- Too sparse: tiny content floating in empty space, especially with `density: dense`.
- Too crowded: walls of text, cramped boxes, unreadable figures, or overlapping content.

## Review Loop

1. Render the deck.
2. Run `scripts/audit-layout.mjs`.
3. Screenshot flagged or suspicious slides.
4. Fix layout, density, figure size, and wording.
5. Re-run until the remaining issues are consciously accepted.

## Density Decisions

- Use the largest density that fits: `normal -> compact -> dense`.
- Start from `normal`. `compact` is an exception for real content pressure, not the default look for "group meeting" or "technical" slides.
- Use `compact` when a slide is only slightly tight after layout, figure size, and wording have been tuned. Typical cases: a slide with multiple figures plus several `ResultBox`es, or a large process figure that needs a little extra room.
- Do not use `compact` to fix sparse slides. Sparse slides need better content placement, larger figures, stronger hierarchy, or more appropriate line spacing; shrinking everything makes the theme look flattened while still leaving empty space.
- If the slide is sparse, do not switch to `compact` or `dense`.
- If the slide is crowded but should not be `dense`, split, rebalance columns, shorten wording, or move details to backup.
- Use `<VSpace>` for intentional local breathing room; `<br>` is only an escape hatch inside prose or raw HTML. If a slide needs many manual spacers, fix the layout/component choice instead.

## Component Restraint

- A component must earn its semantic role.
- Do not box every paragraph.
- Peer information should normally use the same component treatment. Mix `Block`, `Box`, `Callout`, `Note`, or `ResultBox` only when the difference signals a real difference in information type, reading role, or emphasis intent.
- Layout fixes come before emphasis upgrades: adjust `Grid`, column ratio, alignment, `flowGap`, or `VSpace` before turning neutral content into a louder component.
- `Takeaway` is for one important slide-level point, not every slide.
- `Callout` is easy to overuse because its rail/color implies typed urgency. Use it for warnings, caveats, tips, or typed side notes, not ordinary grouping.
- `ResultBox` is for measured/final results, not decorative grouping.
- A few parallel `ResultBox`es work when they expose key numbers. Too many small boxes can become cramped and over-designed; switch to a simple table or list when the numbers no longer need card emphasis.
- Plain bullets plus a `FigureBlock` are often enough.

## Figure Checks

- Figure labels must be readable.
- Wide figures should span full width.
- Comparable panels should have the same rendered size.
- Use `imageWidth` when only the image should shrink; use `width` when the whole figure including caption should shrink.
- Crop baked-in whitespace in source assets.
- Remove accidental black borders, white bands, or decorative frames from PPT-extracted images. Do not add image borders just to make a slide feel filled.
- If an image is the evidence, make it large enough to be the visual subject before adding more text or boxes.

## Alignment Checks

- Parallel columns should align by title, visual, and body rows.
- If `<Grid>` cannot align rows or equal heights, use raw CSS Grid.
- Avoid vertical stacks for parallel alternatives; use horizontal comparison.
