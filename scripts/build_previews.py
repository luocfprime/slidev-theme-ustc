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
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time


ROOT = Path(__file__).resolve().parents[1]
BASE = "/slidev-theme-ustc"
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
    base = f"{BASE}/{deck.name}/"
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


def main() -> int:
    print("[build-previews] cleaning dist/ and .preview/", flush=True)
    shutil.rmtree(ROOT / "dist", ignore_errors=True)
    shutil.rmtree(STAGE, ignore_errors=True)

    decks = discover_decks()

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

    if failed:
        print(f"\n{len(failed)} deck(s) failed after {elapsed:.1f}s:", file=sys.stderr, flush=True)
        for result in failed:
            print(f"\n--- {result.name} stderr ---\n{result.stderr or '(no stderr)'}", file=sys.stderr, flush=True)
            if result.stdout:
                print(f"--- {result.name} stdout ---\n{result.stdout}", file=sys.stderr, flush=True)
        return 1

    print(f"\n[build-previews] all {len(decks)} deck(s) built in {elapsed:.1f}s", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
