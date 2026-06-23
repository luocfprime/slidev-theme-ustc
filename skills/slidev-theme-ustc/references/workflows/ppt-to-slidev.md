# PPT to Slidev Workflow

Classify the input before writing slides. The two cases have different rules.

## Case A: PPT as Materials Only

Signals:

- The PPT is a dump of figures, screenshots, tables, or copied paper pages.
- The user asks to "use these materials" or the deck has no coherent talk flow.

Approach:

1. Inventory assets and extract the useful figures/tables.
2. Build a fresh outline for the target scenario.
3. Still read the PPT's text, titles, and labels. Even a "materials" PPT often contains the correct terminology, updated titles, or slide intent.
4. Reuse assets selectively; do not preserve the original page order by default.
5. Create semantic asset names from captions/content, not mechanical names like `image1.png`.

## Case B: PPT as Drafted Deck

Signals:

- The PPT already has titles, slide order, speaker notes, or a coherent story.
- The user says it is a reference, draft, or existing V1.

Approach:

1. Extract a page-by-page outline: title, intended point, assets, notes.
2. Preserve the main order and intent unless a slide is redundant or structurally broken.
3. Convert each page into Slidev with better typography, spacing, and theme components.
4. Keep comments/TODOs that encode user intent unless the user asks to remove them.

## Conversion Discipline

- Do not silently drop source content. Move overflow to backup or speaker notes and say what moved.
- If the original PPT contains notes, keep their intent in an outline or comments before rewriting.
- Use theme components only when their semantic role fits. Do not wrap everything in boxes.
- If the user provides an updated PPT version, re-read its text and titles as well as its assets. Do not only swap images.
- After conversion, run the visual audit and inspect screenshots. PPT imports often create slides that are too sparse, too crowded, or misaligned.
