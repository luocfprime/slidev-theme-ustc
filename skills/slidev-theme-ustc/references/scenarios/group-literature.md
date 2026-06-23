# Group Literature Survey Decks

Use this for internal paper reading, literature survey, and related-work group meetings.

## Defaults

- Group works by theme, not by arbitrary reading order.
- Start each paper/topic with task and motivation before architecture or equations.
- Cite papers on the slide where they are discussed. Use short footnotes; do not add a references slide.
- Keep venue/year/status metadata close to the paper title. Use `<Badge>` for compact metadata now that the theme provides it.
- Avoid invented shorthand. If the user rejected an abbreviation, write the full term consistently.

## Structure

For each major paper or theme:

1. Problem: what gap the paper targets.
2. Method: the minimum mechanism needed for the audience.
3. Evidence: key result, figure, or table.
4. Takeaway: why it matters for the user's work.

For a broad survey:

`cover -> map/taxonomy -> theme sections -> synthesis -> implications/next reading`

## Layout Taste

- Prefer one paper per slide cluster. Do not cram method, results, and critique into one slide unless it is a minor mention.
- Use comparison tables only when the dimensions are real and useful. Do not invent axes just to fill a table.
- Put venue/year/award/code/project badges inline near the title or first mention, not as bulky boxes.
- Use figures from the paper when they carry the point; crop whitespace and keep labels readable.

## Common Failures

- AI-style labels such as unexplained invented acronyms or "framework X" names not used by the paper.
- Overly uniform bullet-only slides. Vary with figures, taxonomies, and side-by-side comparisons when the content calls for it.
- Claiming "SOTA" without context. Prefer "outperforms baseline X on metric Y" or omit the claim.
