from pathlib import Path
from contextlib import redirect_stderr, redirect_stdout
import io
import importlib.util
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


def load_build_previews():
    spec = importlib.util.spec_from_file_location(
        "build_previews", ROOT / "scripts" / "build_previews.py"
    )
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class BuildPreviewsTest(unittest.TestCase):
    def test_render_index_links_to_every_deck(self):
        build_previews = load_build_previews()
        decks = [
            build_previews.Deck("components", ".preview/components.md"),
            build_previews.Deck("full-deck", ".preview/full-deck.md"),
        ]

        html = build_previews.render_index(decks, "/slidev-theme-ustc")

        self.assertIn('<a href="/slidev-theme-ustc/components/">components</a>', html)
        self.assertIn('<a href="/slidev-theme-ustc/full-deck/">full-deck</a>', html)
        self.assertIn("slidev-theme-ustc previews", html)

    def test_write_index_creates_static_pages_entry(self):
        build_previews = load_build_previews()
        decks = [build_previews.Deck("math", ".preview/math.md")]

        with tempfile.TemporaryDirectory() as tmp:
            out_dir = Path(tmp)
            build_previews.write_index(out_dir, decks, "/repo-name")

            html = (out_dir / "index.html").read_text(encoding="utf-8")

        self.assertIn('<a href="/repo-name/math/">math</a>', html)

    def test_main_returns_clear_error_when_no_decks_exist(self):
        build_previews = load_build_previews()

        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            build_previews.ROOT = root
            build_previews.STAGE = root / ".preview"
            build_previews.discover_decks = lambda: []

            stderr = io.StringIO()
            stdout = io.StringIO()
            with redirect_stderr(stderr), redirect_stdout(stdout):
                code = build_previews.main()

        self.assertEqual(code, 1)
        self.assertIn("no decks found", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()
