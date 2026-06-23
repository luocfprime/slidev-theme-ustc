#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <deck-dir> <handover-dir> <artifact-prefix>" >&2
  exit 2
fi

DECK_DIR="$(cd "$1" && pwd)"
HANDOVER_DIR="$2"
PREFIX="$3"
ZIP_OUT="$(cd "$(dirname "$HANDOVER_DIR")" && pwd)/$(basename "$HANDOVER_DIR").zip"

mkdir -p "$HANDOVER_DIR"
HANDOVER_DIR="$(cd "$HANDOVER_DIR" && pwd)"

cd "$DECK_DIR"

echo "==> Exporting PDF with clicks..."
pnpm export
cp "$DECK_DIR/slides-export.pdf" "$HANDOVER_DIR/${PREFIX}.pdf"

echo "==> Exporting PPTX with clicks..."
pnpm export:pptx
cp "$DECK_DIR/slides-export.pptx" "$HANDOVER_DIR/${PREFIX}.pptx"

echo "==> Exporting PNG pages once..."
pnpm export:png
if pnpm run | grep -qE '(^|[[:space:]])pack:png($|[[:space:]])'; then
  pnpm pack:png
else
  rm -f slides-export-png.tar.gz
  tar -czf slides-export-png.tar.gz slides-export-png
fi
cp "$DECK_DIR/slides-export-png.tar.gz" "$HANDOVER_DIR/${PREFIX}_png.tar.gz"

echo "==> Syncing source and assets..."
for file in slides.md package.json vite.config.js vite.config.ts CLAUDE.md AGENTS.md; do
  if [[ -f "$DECK_DIR/$file" ]]; then
    cp "$DECK_DIR/$file" "$HANDOVER_DIR/$file"
  fi
done
if [[ -d "$DECK_DIR/public" ]]; then
  rsync -a --delete "$DECK_DIR/public/" "$HANDOVER_DIR/public/"
fi

echo "==> Creating zip..."
rm -f "$ZIP_OUT"
(cd "$(dirname "$HANDOVER_DIR")" && zip -qr "$ZIP_OUT" "$(basename "$HANDOVER_DIR")")
echo "==> Done: $ZIP_OUT"
