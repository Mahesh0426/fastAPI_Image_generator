import logging
import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from database import get_session
from models import Job, Thumbnail
from services.generator import process_job, STYLE_ORDER
from services.imagekit_services import upload_file, get_variants

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------

class CreateJobRequest(BaseModel):
    prompt: str
    num_thumbnails: int
    headshot_url: str


class CreateJobResponse(BaseModel):
    job_id: str


class ThumbnailResponse(BaseModel):
    id: str
    style_name: str
    status: str
    imagekit_url: str | None = None
    error_message: str | None = None
    variants: dict | None = None


class JobResponse(BaseModel):
    id: str
    prompt: str
    num_thumbnails: int
    headshot_url: str
    status: str
    thumbnails: list[ThumbnailResponse]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/upload-headshot")
async def upload_headshot(file: UploadFile = File(...)):
    """Upload a headshot image and return its CDN URL."""
    contents = await file.read()
    url = upload_file(
        file_bytes=contents,
        file_name=file.filename or "headshot.jpg",
        folder="headshots",
        content_type=file.content_type or "image/jpeg",
    )
    return {"url": url}


@router.post("/jobs", response_model=CreateJobResponse)
async def create_job(
    request: CreateJobRequest,
    session: Session = Depends(get_session),
):
    """Create a new thumbnail-generation job and start processing in the background."""
    if request.num_thumbnails < 1 or request.num_thumbnails > 3:
        raise HTTPException(
            status_code=400,
            detail="num_thumbnails must be between 1 and 3",
        )

    job = Job(
        prompt=request.prompt,
        num_thumbnails=request.num_thumbnails,
        headshot_url=request.headshot_url,
    )
    session.add(job)
    session.flush()  # ensure job.id is populated before creating thumbnails

    styles = STYLE_ORDER[: request.num_thumbnails]
    for style in styles:
        thumbnail = Thumbnail(job_id=job.id, style_name=style)
        session.add(thumbnail)

    session.commit()
    session.refresh(job)

    # Fire-and-forget background processing.
    asyncio.create_task(process_job(job.id))

    return CreateJobResponse(job_id=job.id)


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str, session: Session = Depends(get_session)):
    """Return the latest state of a job along with its thumbnails."""
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    thumbnails = session.exec(
        select(Thumbnail).where(Thumbnail.job_id == job_id)
    ).all()

    thumb_responses: list[ThumbnailResponse] = []
    for thumb in thumbnails:
        variants = get_variants(thumb.imagekit_url) if thumb.imagekit_url else None
        thumb_responses.append(
            ThumbnailResponse(
                id=thumb.id,
                style_name=thumb.style_name,
                status=thumb.status,
                imagekit_url=thumb.imagekit_url,
                error_message=thumb.error_message,
                variants=variants,
            )
        )

    return JobResponse(
        id=job.id,
        prompt=job.prompt,
        num_thumbnails=job.num_thumbnails,
        headshot_url=job.headshot_url,
        status=job.status,
        thumbnails=thumb_responses,
    )


@router.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str):
    """Stream thumbnail updates for a job using server-sent events."""

    async def event_generator():
        from database import engine

        sent_thumbnails: set[str] = set()

        while True:
            with Session(engine) as session:
                job = session.get(Job, job_id)
                if not job:
                    yield f"event: error\ndata: {json.dumps({'message': 'Job not found'})}\n\n"
                    return

                thumbnails = session.exec(
                    select(Thumbnail).where(Thumbnail.job_id == job_id)
                ).all()

                for thumb in thumbnails:
                    if thumb.id in sent_thumbnails:
                        continue

                    if thumb.status == "uploaded":
                        variants = (
                            get_variants(thumb.imagekit_url)
                            if thumb.imagekit_url
                            else None
                        )
                        data = json.dumps(
                            {
                                "thumbnail_id": thumb.id,
                                "style_name": thumb.style_name,
                                "imagekit_url": thumb.imagekit_url,
                                "variants": variants,
                            }
                        )
                        yield f"event: thumbnail_ready\ndata: {data}\n\n"
                        sent_thumbnails.add(thumb.id)

                    elif thumb.status in ("failed", "error"):
                        data = json.dumps(
                            {
                                "thumbnail_id": thumb.id,
                                "style_name": thumb.style_name,
                                "error_message": thumb.error_message,
                            }
                        )
                        yield f"event: thumbnail_failed\ndata: {data}\n\n"
                        sent_thumbnails.add(thumb.id)

                all_done = all(
                    thumb.status in ("uploaded", "failed", "error")
                    for thumb in thumbnails
                )
                if all_done and len(sent_thumbnails) == len(thumbnails):
                    data = json.dumps(
                        {
                            "job_id": job.id,
                            "status": job.status,
                        }
                    )
                    yield f"event: job_completed\ndata: {data}\n\n"
                    return

            await asyncio.sleep(1.5)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
