# Conference Oral / Formal Paper Talks

Use this for conference oral presentations, invited talks, defenses, and other formal paper presentations.

## Defaults

- Include authors, affiliations, venue/conference, date, and presenter on the cover when the event is formal.
- If the presenter is not the first author, set `presenterName` explicitly so the correct author is underlined.
- Follow the required language of the event. If the project context says "English only", keep all slide text English.
- Build for speaking time. A 15-minute conference oral usually wants about 12-15 body slides, plus backup.
- Formal decks should not show internal `wip: true` markers in the final export.

## Narrative

Conference talks need a tight claim spine:

`task -> why hard -> key insight -> method components -> evidence -> conclusion`

For original-work talks, action titles are often better than topic labels when they can state the takeaway cleanly. Topic title plus subtitle is acceptable for method-heavy slides.

## Content Density

- Image-heavy, text-light, but not vague. Replace paragraphs with concrete mechanism phrases, not empty slogans.
- Keep enough specificity to explain the technical contribution: component names, cause-effect links, and exact visual evidence.
- If a slide becomes too short after trimming, restore the key mechanism or visual anchor instead of leaving a sparse shell.

## Figure and Alignment Rules

- Figures are primary evidence. Make labels readable at audience scale.
- Use full-width layouts for wide paper figures.
- For three parallel method components or comparisons, align titles, figures, and text rows. Use raw CSS Grid with equal-height rows when `<Grid>` cannot align rows.
- Use `FigureBlock :numbered="false"` for visual-only figures when formal numbering would distract.

## Existing Formal PPT

When a provided PPT already has a coherent paper-talk structure, treat it as a structural reference:

- Preserve the main slide order and speaker-note intent unless there is a clear defect.
- Convert to Slidev while improving consistency, alignment, and readability.
- Keep speaker notes or extracted outline as source-of-truth for what each slide is supposed to say.

## Final Handover

For a presenter who may not have Node/Slidev installed, deliver PDF and PPTX. PNG page archives are useful for quick inspection or fallback. Do not rely on `dist/index.html` as the primary handover artifact.
