import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File

from backend.models import UploadResponse

router = APIRouter()

# Images are saved to an uploads/ directory next to the DB.
# In production swap this out for S3/Cloudinary — only the returned URL changes.
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/upload", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)) -> UploadResponse:
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 5 MB limit.")

    suffix = Path(file.filename or "upload").suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{suffix}"
    dest = UPLOAD_DIR / filename
    dest.write_bytes(contents)

    # Return a relative URL; the FastAPI app mounts /uploads as a static directory.
    return UploadResponse(url=f"/uploads/{filename}")
