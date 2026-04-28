"""Local preview server — simulates GitHub Pages subpath deployment."""

import uvicorn
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE = "/slidev-theme-ustc"
DIST = Path(__file__).parent / "dist"

app = FastAPI()
app.mount(BASE, StaticFiles(directory=DIST, html=True), name="slides")


@app.get("/{path:path}")
async def spa_fallback(path: str):
    return FileResponse(DIST / "index.html")


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8081)
