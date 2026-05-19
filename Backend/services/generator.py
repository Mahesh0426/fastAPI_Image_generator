import asyncio
import logging
from sqlmodel import Session, select 
from database import engine
from models import Job, Thumbnail
from services.openai_service import generate_thumbnail
from services.imagekit_services import upload_file

logger = logging.getLogger(__name__)

STYLES = {
    "bold_dramatic": (
        "create a bold, dramatic YouTube thumbnail with high contrast"
        "cinematic lightning, dark moody background and powerful composition."
        "The person face should be prominent with a dramatic expression."
    ),
    "clean_minimal":(
        "create a clean, minimal YouTube thumbnail with bright lighting."
        "White/light background, a modern professional aesthetic, plenty of"
        "whitespace and sharp clean composition, the person should look"
        "approachable and professional."
    ),
    "Vibrant_energetic":(
        "create a vibrant, energetic YouTube thumbnail with colorful gradients,"
        "dynamic angles eye-catching pop-art style colors, and energetic"
        "composition. The person should have an excited or engaging expression."

    )
}

STYLE_ORDER = ["bold_dramatic", "clean_minimal", "Vibrant_energetic"]


# This function will be called for each thumbnail generation task
async def generate_single_thumbnail(thumbnail_id: str, prompt: str, headshot_url: str):
    #DB mark -> generating 
    with Session(engine) as session:
        thumb = session.get(Thumbnail, thumbnail_id)
        thumb.status = "generating"
        style_name = thumb.style_name
        session.add(thumb)
        session.commit()

    style_prompt = STYLES[style_name]

    # AI call 
    try:
        image_byte = await generate_thumbnail(
            prompt=prompt, headshot_url=headshot_url, style_prompt=style_prompt
        )
        with Session(engine) as session:
            thumb = session.get(Thumbnail, thumbnail_id)
            job_id = thumb.job_id

        # upload this image to imagekit and get the url
        url = upload_file(
            file_bytes=image_byte,
            file_name=f"{thumbnail_id}.png",
            folder=f"thumbnails/{job_id}/",
        )
          
        # db call to save url and marked uploaded
        with Session(engine) as session:
            thumb = session.get(Thumbnail, thumbnail_id)
            thumb.imagekit_url = url
            thumb.status = "uploaded"
            session.add(thumb)
            session.commit()
        logger.info(f"Thumbnail {thumbnail_id} generated and uploaded successfully.")

    except Exception as e:
        logger.error(f"Error generating thumbnail {thumbnail_id}:{e}",)
        with Session(engine) as session:
            thumb = session.get(Thumbnail, thumbnail_id)
            thumb.status = "error"
            thumb.error_message = str(e)[:500]  # Truncate error message to 500 chars
            session.add(thumb)
            session.commit()

# This function will be called to process a job and generate all its thumbnails
async def process_job(job_id: str):
    #make a job at processing
    with Session(engine) as session:
        job = session.get(Job, job_id)
        job.status = "processing"
        prompt = job.prompt
        headshort_url = job.headshot_url
        session.add(job)
        session.commit()
        
         # Find all thumbnails for this job.
        thumbnails = session.exec(
            select(Thumbnail).where(Thumbnail.job_id == job_id)
        ).all()

        # create a list of tasks for each thumbnail |   # start one worker for each thumbnail
        thumbnails_ids = [thumb.id for thumb in thumbnails]
        tasks = [
            generate_single_thumbnail(tid, prompt, headshort_url) 
            for tid in thumbnails_ids
        ]
        await asyncio.gather(*tasks, return_exceptions=True)

        # wait for all workers to finish
        with Session(engine) as session:
            thumbnails = session.exec(
            select(Thumbnail).where(Thumbnail.job_id == job_id)).all()

            # mark the job as completed/failed based on the thumbnail status
            all_failed = all(thumb.status == "error" for thumb in thumbnails)
            job = session.get(Job, job_id)
            job.status = "failed" if all_failed else "completed"
            session.add(job)
            session.commit()
            



       
      
  

