#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "pymupdf>=1.24",
# ]
# ///
"""Convert PDF files to SVG. Multi-page PDFs produce one SVG per page.

Usage:
    uv run pdf2svg.py input.pdf
    uv run pdf2svg.py input.pdf -o public/images/
    uv run pdf2svg.py input.pdf -o figure.svg
    uv run pdf2svg.py reference/figures/
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pymupdf


def collect_pdfs(inputs: list[Path]) -> list[Path]:
    pdfs: list[Path] = []
    for path in inputs:
        if path.is_dir():
            pdfs.extend(sorted(path.glob("*.pdf")))
        elif path.is_file() and path.suffix.lower() == ".pdf":
            pdfs.append(path)
        else:
            print(f"skip: {path} (not a PDF or directory)", file=sys.stderr)
    return pdfs


def convert(pdf_path: Path, output: Path | None) -> list[Path]:
    doc = pymupdf.open(pdf_path)
    try:
        page_count = doc.page_count
        if page_count == 0:
            print(f"skip: {pdf_path} (no pages)", file=sys.stderr)
            return []

        if output is None or output.is_dir():
            out_dir = output if output is not None else pdf_path.parent
            out_dir.mkdir(parents=True, exist_ok=True)
            if page_count == 1:
                targets = [out_dir / f"{pdf_path.stem}.svg"]
            else:
                targets = [out_dir / f"{pdf_path.stem}-p{i + 1}.svg" for i in range(page_count)]
        else:
            if page_count > 1:
                raise SystemExit(f"{pdf_path} has {page_count} pages; -o must be a directory")
            output.parent.mkdir(parents=True, exist_ok=True)
            targets = [output]

        written: list[Path] = []
        for page, target in zip(doc, targets):
            svg = page.get_svg_image(text_as_path=False)
            target.write_text(svg, encoding="utf-8")
            written.append(target)
        return written
    finally:
        doc.close()


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert PDF files to SVG.")
    parser.add_argument("inputs", nargs="+", type=Path, help="PDF files or directories")
    parser.add_argument("-o", "--output", type=Path, help="Output SVG file or directory")
    args = parser.parse_args()

    pdfs = collect_pdfs(args.inputs)
    if not pdfs:
        print("no PDFs found", file=sys.stderr)
        return 1

    output = args.output
    if output is not None and len(pdfs) > 1:
        output.mkdir(parents=True, exist_ok=True)

    for pdf in pdfs:
        for svg in convert(pdf, output):
            print(f"{pdf} -> {svg}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
