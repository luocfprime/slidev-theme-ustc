# Group Progress Meeting Decks

Use this for internal weekly or group-meeting progress reports.

## Defaults

- Language follows the user's project context. Chinese narration with English technical terms is usually fine.
- Do not add affiliations by default. A group meeting cover can use presenter, date, project/title, and meeting name only.
- Preserve `wip: true` unless the user explicitly asks to remove draft markers.
- Prefer concise status, evidence, blockers, and next steps over a polished paper-talk narrative.
- Use footnotes where papers are cited; do not add a trailing references slide.

## Structure

Good default flow:

`cover -> current objective -> what changed -> evidence/results -> issues -> next steps -> backup`

For paper-related progress, include:

- Why this paper/result matters to the current project.
- What was tried or read this week.
- What is known, unknown, and blocked.
- Concrete next action.

## Layout Taste

- Internal slides may be denser than a conference oral, but still must pass the visual rubric.
- Avoid decorative polish that slows reading: oversized cover art, affiliation-heavy metadata, and over-boxed bullets.
- Do not use `density: dense` merely to make a sparse slide look "academic". Use `normal` or `compact` unless content pressure requires `dense`.
- Components are optional. Plain bullets plus a figure are often stronger than stacking `Block`, `Callout`, and `Takeaway`.

## Common Failures

- Adding author affiliations because the cover API supports them. For group meeting decks, omit them unless asked.
- Treating the report as a paper reproduction. Keep the deck anchored in progress and decisions.
- Removing WIP markers during cleanup. WIP is useful signal in internal reports.
