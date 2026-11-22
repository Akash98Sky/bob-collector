from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from backend.database import init_db
from backend.routes import issues, upload

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Civic Pulse API", version="1.0.0")


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(issues.router, prefix="/api/v1")
app.include_router(upload.router, prefix="/api/v1")

# Serve uploaded images at /uploads/<filename>
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
