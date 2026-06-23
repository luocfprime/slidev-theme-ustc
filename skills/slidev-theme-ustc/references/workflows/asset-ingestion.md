# Asset Ingestion Workflow

Use this when bringing paper figures, PDFs, PPT exports, videos, or generated images into a Slidev deck.

## Placement

- Put runtime static files under the deck's `public/` directory and reference them with root paths such as `/images/teaser.svg`.
- Use semantic filenames based on figure meaning or caption: `teaser-compositional-3d.svg`, not `image3.svg`.
- Keep generated/exported directories out of hand-written source unless they are intentionally part of the handover.

## PDF / Figure Conversion

Preferred order:

1. Use original SVG/PDF/vector figure when available.
2. Convert PDF pages to SVG if labels must remain sharp.
3. Use high-resolution PNG only when the source is raster or SVG conversion is broken.
4. Crop baked-in whitespace before placing the figure.

Bundled helper:

```bash
uv run <skill>/scripts/pdf2svg.py paper-figure.pdf -o public/images
uv run <skill>/scripts/pdf2svg.py reference/figures/
```

The script uses PyMuPDF and only converts pages. It does not patch fonts or rewrite SVG styling. Multi-page PDFs produce one SVG per page unless `-o` names a single SVG for a single-page input.

## Large Raster Images

- Do not place huge PNGs blindly. Check dimensions and file size.
- If the image is a vector export disguised as a large PNG, find or create SVG instead.
- If raster is required, resize only after confirming the on-slide rendered size.

## Videos and Demos

- Use `VideoBlock` for videos that are part of the talk.
- Keep video files in `public/videos/` or another clear public subfolder.
- Verify export behavior. PDF/PPTX cannot preserve every interactive behavior; provide a static fallback frame if needed.

## Visual Checks

- Check natural image size versus rendered size.
- Make paper figure labels readable at audience scale.
- Use identical dimensions for comparable result panels.
- Crop black edge artifacts, white bands, and irrelevant PPT canvas margins before using an image.
- Avoid borders or baked-in backgrounds that fight the white slide unless they are intentional.
- Do not wrap every image in a white card or border. If the theme component already gives enough structure, let the image and caption stand on their own.
- If many images feel too small, fix the source crop and layout first; do not compensate by adding decorative frames.
