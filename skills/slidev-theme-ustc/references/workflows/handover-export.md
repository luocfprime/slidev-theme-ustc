# Handover and Export Workflow

Use this when preparing a deck for another presenter or a machine that may not have Node, pnpm, or Slidev installed.

## Deliverables

Default formal handover:

- PDF with clicks included.
- PPTX with clicks included.
- PNG page archive with clicks included.
- `slides.md`, `package.json`, `vite.config.*`, `CLAUDE.md`/`AGENTS.md` if present.
- `public/` assets.

Do not treat `dist/index.html` as a universal handover artifact. A static Slidev build still needs an HTTP server; opening it with `file://` can fail.

During ordinary editing, do not export every format unless the user asks. Use build, audit, and screenshots for iteration. Reserve PDF/PPTX/PNG handover export for final packaging or explicit export requests.

## Package Scripts

Use simple non-nested scripts:

```json
{
  "scripts": {
    "export": "slidev export --with-clicks --timeout 60000",
    "export:pptx": "slidev export --format pptx --with-clicks --timeout 60000",
    "export:png": "slidev export --format png --with-clicks --output slides-export-png --timeout 60000",
    "pack:png": "rm -f slides-export-png.tar.gz && tar -czf slides-export-png.tar.gz slides-export-png"
  }
}
```

Do not define `export:png:gz` as `export:png && tar ...` if a handover script already calls export and pack. Export PNG once, then pack once.

## Bundled Helper

```bash
bash <skill>/scripts/handover-export.sh /path/to/deck /path/to/handover Deck_Name
```

The helper exports PDF, PPTX, and PNG once; packs PNG once; syncs source files and `public/`; then creates a zip next to the handover directory.

## Checks

- Confirm PDF/PPTX/PNG outputs exist.
- Confirm source files and assets are present.
- If the handover package is for a non-technical recipient, put PDF/PPTX first in the README and treat source as optional.
