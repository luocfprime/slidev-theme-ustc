# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "fastapi>=0.136.1",
#   "uvicorn>=0.46.0",
# ]
# ///

"""Local preview server - serves every deck built by scripts/build_previews.py.

Each subdir under dist/ (e.g. dist/full-deck/, dist/components/) is mounted at
/slidev-theme-ustc/<name>/ to mirror the GitHub Pages base path. The root
/slidev-theme-ustc/ shows an index page listing all decks. Each request also
prints the active deck name to stdout so it's obvious which slides are being
viewed.
"""

from http import HTTPStatus
from html import escape
from pathlib import Path
import socket
import sys

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse, Response

BASE = "/slidev-theme-ustc"
DIST = Path(__file__).parent / "dist"
HOST = "localhost"
PORT = 8080


def find_available_port(host: str, preferred_port: int) -> int:
    for port in range(preferred_port, 65536):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind((host, port))
            except OSError:
                continue
            return port
    raise RuntimeError(f"No available port found at or above {preferred_port}")


def discover_decks(dist: Path = DIST) -> list[str]:
    if not dist.exists():
        return []
    return sorted(
        d.name for d in dist.iterdir() if d.is_dir() and (d / "index.html").is_file()
    )


def render_index(decks: list[str]) -> str:
    items = "\n".join(
        f'  <li><a href="{BASE}/{escape(d)}/">{escape(d)}</a></li>' for d in decks
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>slidev-theme-ustc previews</title>
<style>
  body {{ font: 16px/1.6 -apple-system, BlinkMacSystemFont, sans-serif;
         max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; color: #222; }}
  h1 {{ font-size: 1.4rem; margin-bottom: 0.25rem; }}
  p  {{ color: #666; margin-top: 0; }}
  ul {{ padding-left: 1.2rem; }}
  li {{ margin: 0.4rem 0; }}
  a  {{ color: #1E4C90; text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  code {{ background: #f3f3f3; padding: 0 0.3em; border-radius: 3px; }}
</style>
</head>
<body>
<h1>slidev-theme-ustc previews</h1>
<p>Each link below is a static build served under <code>{BASE}/&lt;name&gt;/</code>.</p>
<ul>
{items}
</ul>
</body>
</html>
"""


def resolve_deck_path(deck_dir: Path, deck_path: str) -> Path | None:
    raw = deck_path or "index.html"
    if raw.endswith("/"):
        raw += "index.html"
    target = (deck_dir / raw).resolve()
    try:
        target.relative_to(deck_dir.resolve())
    except ValueError:
        return None
    return target


def create_app(dist: Path = DIST, decks: list[str] | None = None) -> FastAPI:
    active_decks = decks if decks is not None else discover_decks(dist)
    app = FastAPI()

    @app.api_route("/{path:path}", methods=["GET", "HEAD"])
    async def preview(path: str, request: Request):
        request_path = request.scope["path"]

        if request_path == "/":
            return RedirectResponse(
                BASE + "/", status_code=HTTPStatus.TEMPORARY_REDIRECT
            )

        if request_path in (BASE, BASE + "/"):
            return HTMLResponse(render_index(active_decks))

        if not request_path.startswith(BASE + "/"):
            return Response(status_code=HTTPStatus.NOT_FOUND)

        rest = request_path[len(BASE) + 1 :]
        deck, _, deck_path = rest.partition("/")
        if deck not in active_decks:
            return RedirectResponse(
                BASE + "/", status_code=HTTPStatus.TEMPORARY_REDIRECT
            )

        deck_dir = dist / deck
        target = resolve_deck_path(deck_dir, deck_path)
        if target is None:
            return RedirectResponse(
                BASE + "/", status_code=HTTPStatus.TEMPORARY_REDIRECT
            )
        if not target.is_file():
            target = deck_dir / "index.html"

        print(f"[deck={deck}] {request.method} {request_path} -> 200", flush=True)
        response = FileResponse(target)
        response.headers["X-Active-Deck"] = deck
        return response

    return app


def main():
    decks = discover_decks()
    if not decks:
        print(
            f"No decks found under {DIST}. Run `python3 scripts/build_previews.py` first.",
            file=sys.stderr,
        )
        raise SystemExit(1)

    port = find_available_port(HOST, PORT)
    if port != PORT:
        print(f"[serve] port {PORT} unavailable; using {port}", flush=True)

    print(f"[serve] mounted {len(decks)} deck(s): {', '.join(decks)}", flush=True)
    print(f"[serve] index: http://{HOST}:{port}{BASE}/", flush=True)
    uvicorn.run(create_app(DIST, decks), host=HOST, port=port)


if __name__ == "__main__":
    main()
