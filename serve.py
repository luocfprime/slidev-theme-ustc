"""Local preview server — serves every deck built by scripts/build_previews.py.

Each subdir under dist/ (e.g. dist/example/, dist/components/) is mounted at
/slidev-theme-ustc/<name>/ to mirror the GitHub Pages base path. The root
/slidev-theme-ustc/ shows an index page listing all decks. Each request also
prints the active deck name to stdout so it's obvious which slides are being
viewed.
"""

from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from html import escape
import sys
from pathlib import Path

BASE = "/slidev-theme-ustc"
DIST = Path(__file__).parent / "dist"
HOST = "localhost"
PORT = 8081


def discover_decks() -> list[str]:
    if not DIST.exists():
        return []
    return sorted(
        d.name
        for d in DIST.iterdir()
        if d.is_dir() and (d / "index.html").is_file()
    )


DECKS = discover_decks()
if not DECKS:
    print(
        f"No decks found under {DIST}. Run `python3 scripts/build_previews.py` first.",
        file=sys.stderr,
    )
    sys.exit(1)


def render_index() -> bytes:
    items = "\n".join(
        f'  <li><a href="{BASE}/{escape(d)}/">{escape(d)}</a></li>' for d in DECKS
    )
    body = f"""<!doctype html>
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
    return body.encode("utf-8")


class PreviewHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args):
        return

    def do_GET(self):
        self.handle_preview_request()

    def do_HEAD(self):
        self.handle_preview_request(head_only=True)

    def handle_preview_request(self, head_only: bool = False):
        path = self.path.split("?", 1)[0].split("#", 1)[0]

        if path == "/":
            self.redirect(BASE + "/")
            return

        if path in (BASE, BASE + "/"):
            self.send_bytes(render_index(), "text/html; charset=utf-8", head_only=head_only)
            return

        if not path.startswith(BASE + "/"):
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        rest = path[len(BASE) + 1 :]
        deck, _, deck_path = rest.partition("/")
        if deck not in DECKS:
            self.redirect(BASE + "/")
            return

        deck_dir = DIST / deck
        target = self.resolve_deck_path(deck_dir, deck_path)
        if target is None:
            self.redirect(BASE + "/")
            return
        if not target.is_file():
            target = deck_dir / "index.html"

        self.send_file(path, target, deck, head_only=head_only)

    def resolve_deck_path(self, deck_dir: Path, deck_path: str) -> Path | None:
        raw = deck_path or "index.html"
        if raw.endswith("/"):
            raw += "index.html"
        target = (deck_dir / raw).resolve()
        try:
            target.relative_to(deck_dir.resolve())
        except ValueError:
            return None
        return target

    def redirect(self, location: str):
        self.send_response(HTTPStatus.TEMPORARY_REDIRECT)
        self.send_header("Location", location)
        self.end_headers()

    def send_bytes(self, body: bytes, content_type: str, head_only: bool = False):
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if not head_only:
            self.wfile.write(body)

    def send_file(self, request_path: str, file_path: Path, deck: str, head_only: bool = False):
        ctype = self.guess_type(str(file_path))
        try:
            file = open(file_path, "rb")
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return
        fs = file_path.stat()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(fs.st_size))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.send_header("X-Active-Deck", deck)
        self.end_headers()
        print(f"[deck={deck}] {self.command} {request_path} -> 200", flush=True)
        if head_only:
            file.close()
            return
        try:
            self.copyfile(file, self.wfile)
        finally:
            file.close()


if __name__ == "__main__":
    try:
        server = ThreadingHTTPServer((HOST, PORT), PreviewHandler)
    except OSError as exc:
        print(f"[serve] failed to bind http://{HOST}:{PORT}: {exc}", file=sys.stderr, flush=True)
        raise SystemExit(1)

    print(f"[serve] mounted {len(DECKS)} deck(s): {', '.join(DECKS)}", flush=True)
    print(f"[serve] index: http://{HOST}:{PORT}{BASE}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[serve] stopped", flush=True)
    finally:
        server.server_close()
