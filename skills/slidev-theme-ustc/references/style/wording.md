# Wording Preferences

Use this for slide text, captions, speaker-facing summaries, and paper survey phrasing.

## Core Rules

- Avoid AI-smelling invented terminology, unexplained acronyms, and unnatural shorthand.
- If the user rejects an abbreviation, use the full phrase consistently.
- Keep descriptive content either one sentence or clear bullets.
- Prefer specific claims over vague praise.
- Do not say "SOTA" unless the claim is current, relevant, and supported. Usually write the exact comparison instead.

## Academic Voice

Good:

- "Improves instance separation under occlusion."
- "Outperforms GraphDreamer on CLIP text-image similarity."
- "Uses shared attention to preserve foreground-background relations."

Avoid:

- "A novel paradigm for holistic synergistic generation."
- "VDM/VD" if the audience or user expects "video generation model" or "video generation".
- "It is worth noting that..." filler.
- "Not X, but Y" as a repeated rhetorical template.

## Chinese / English Mixing

- For Chinese group meetings, Chinese narration plus English technical terms is acceptable.
- For formal English-only talks, keep all rendered slide text English.
- Do not translate established method names unless the user asks.

## Captions

- Captions should identify the evidence, not restate the whole slide.
- Use caption slots only when markdown, footnotes, links, or inline components are needed.
- For plain captions, prefer the `caption` prop.
