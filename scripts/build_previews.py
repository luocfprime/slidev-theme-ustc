#!/usr/bin/env python3
"""Build the local preview decks into dist/<name>/.

Each deck is built with --base /slidev-theme-ustc/<name>/ so serve.py can mount
them side by side under one local host. The examples/ directory is a symlink
into the skill references; staging those markdown files under .preview/ avoids
Vite/Rollup symlink path escapes during the build.
"""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from html import escape
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get("PREVIEW_BASE", "/slidev-theme-ustc").rstrip("/")
STAGE = ROOT / ".preview"
PUBLIC = ROOT / "public"


@dataclass(frozen=True)
class Deck:
    name: str
    file: str


@dataclass(frozen=True)
class BuildResult:
    name: str
    file: str
    code: int
    stdout: str
    stderr: str


def discover_decks() -> list[Deck]:
    """Discover every deck under examples/, including the canonical full-deck demo.

    All decks are staged under .preview/ to keep Vite's symlink path resolution
    happy (examples/ is itself a symlink into the skill references). Frontmatter
    in each deck uses `theme: ../`, which from .preview/<file>.md resolves back
    to the project root where the theme lives.
    """
    decks: list[Deck] = []
    examples_dir = ROOT / "examples"
    if not examples_dir.exists():
        return decks

    STAGE.mkdir(parents=True, exist_ok=True)
    for source in sorted(examples_dir.iterdir(), key=lambda p: p.name):
        if source.suffix != ".md":
            continue
        target = STAGE / source.name
        shutil.copy2(source, target)
        decks.append(Deck(source.stem, f".preview/{source.name}"))
    return decks


def deck_url(base: str, name: str) -> str:
    prefix = base.rstrip("/")
    path = quote(name)
    return f"{prefix}/{path}/" if prefix else f"/{path}/"


def render_index(decks: list[Deck], base: str = BASE) -> str:
    items = "\n".join(
        f'  <li><a href="{deck_url(base, deck.name)}">{escape(deck.name)}</a></li>'
        for deck in decks
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>slidev-theme-ustc previews</title>
<style>
  :root {{
    color-scheme: light;
    --blue: #1E4C90;
    --ink: #1f2933;
    --muted: #5f6b7a;
    --line: #d8dee7;
    --surface: #f7f9fc;
  }}
  body {{
    font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    max-width: 48rem;
    margin: 4rem auto;
    padding: 0 1.5rem;
    color: var(--ink);
    background: white;
  }}
  h1 {{
    font-size: 1.65rem;
    line-height: 1.2;
    margin: 0 0 0.35rem;
  }}
  p {{
    color: var(--muted);
    margin: 0 0 1.4rem;
  }}
  ul {{
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 8px;
    overflow: hidden;
  }}
  li + li {{
    border-top: 1px solid var(--line);
  }}
  a {{
    display: block;
    padding: 0.75rem 0.95rem;
    color: var(--blue);
    background: var(--surface);
    text-decoration: none;
    font-weight: 600;
  }}
  a:hover {{
    background: #eef4fb;
    text-decoration: underline;
  }}
  code {{
    background: #eef1f5;
    padding: 0 0.3em;
    border-radius: 3px;
  }}
</style>
</head>
<body>
<h1>slidev-theme-ustc previews</h1>
<p>Static builds for every deck under <code>examples/</code>.</p>
<ul>
{items}
</ul>
</body>
</html>
"""


def write_index(out_dir: Path, decks: list[Deck], base: str = BASE) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(render_index(decks, base), encoding="utf-8")


def copy_public_assets(out_dir: Path) -> None:
    if not PUBLIC.exists():
        return
    out_dir.mkdir(parents=True, exist_ok=True)
    for source in PUBLIC.iterdir():
        target = out_dir / source.name
        if source.is_dir():
            shutil.copytree(source, target, dirs_exist_ok=True)
        else:
            shutil.copy2(source, target)


def build_one(deck: Deck) -> BuildResult:
    out_dir = ROOT / "dist" / deck.name
    base = deck_url(BASE, deck.name)
    cmd = [
        "pnpm",
        "exec",
        "slidev",
        "build",
        deck.file,
        "--base",
        base,
        "--out",
        str(out_dir),
    ]

    try:
        completed = subprocess.run(
            cmd,
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError as exc:
        return BuildResult(deck.name, deck.file, -1, "", str(exc))

    stdout = completed.stdout
    stderr = completed.stderr
    code = completed.returncode

    if code == 0:
        try:
            copy_public_assets(out_dir)
        except OSError as exc:
            code = -1
            stderr += f"\nFailed to copy public assets: {exc}\n"

    return BuildResult(deck.name, deck.file, code, stdout, stderr)


def worker_count(deck_count: int) -> int:
    raw = os.environ.get("PREVIEW_BUILD_JOBS")
    if raw:
        try:
            return max(1, min(deck_count, int(raw)))
        except ValueError:
            print(f"[build-previews] ignoring invalid PREVIEW_BUILD_JOBS={raw!r}", file=sys.stderr, flush=True)
    return deck_count


def has_warning(text: str) -> bool:
    lowered = text.lower()
    return "warn" in lowered or "(!)" in text


def print_success_diagnostics(results: list[BuildResult]) -> None:
    for result in results:
        if result.code != 0:
            continue
        if result.stderr.strip():
            print(f"\n--- {result.name} stderr (successful build) ---\n{result.stderr}", file=sys.stderr, flush=True)
        if result.stdout.strip() and has_warning(result.stdout):
            print(f"\n--- {result.name} stdout (successful build) ---\n{result.stdout}", file=sys.stderr, flush=True)


def main() -> int:
    print("[build-previews] cleaning dist/ and .preview/", flush=True)
    shutil.rmtree(ROOT / "dist", ignore_errors=True)
    shutil.rmtree(STAGE, ignore_errors=True)

    decks = discover_decks()
    if not decks:
        print("[build-previews] no decks found under examples/", file=sys.stderr, flush=True)
        return 1

    print(f"[build-previews] building {len(decks)} deck(s) in parallel:", flush=True)
    for deck in decks:
        print(f"  - {deck.name}  ({deck.file})", flush=True)

    started = time.monotonic()
    jobs = worker_count(len(decks))
    with ThreadPoolExecutor(max_workers=jobs) as pool:
        results = list(pool.map(build_one, decks))
    elapsed = time.monotonic() - started

    failed = [result for result in results if result.code != 0]
    for result in results:
        tag = "ok  " if result.code == 0 else "FAIL"
        print(f"[{tag}] {result.name}  (exit {result.code})", flush=True)

    print_success_diagnostics(results)

    if failed:
        print(f"\n{len(failed)} deck(s) failed after {elapsed:.1f}s:", file=sys.stderr, flush=True)
        for result in failed:
            print(f"\n--- {result.name} stderr ---\n{result.stderr or '(no stderr)'}", file=sys.stderr, flush=True)
            if result.stdout:
                print(f"--- {result.name} stdout ---\n{result.stdout}", file=sys.stderr, flush=True)
        return 1

    write_index(ROOT / "dist", decks, BASE)
    print(f"[build-previews] wrote index at {ROOT / 'dist' / 'index.html'}", flush=True)
    print(f"\n[build-previews] all {len(decks)} deck(s) built in {elapsed:.1f}s", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
