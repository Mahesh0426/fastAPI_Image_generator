from datetime import datetime, timezone
from typing import Optional, List
from uuid import uuid4
from sqlmodel import SQLModel, Field, Relationship


def _uuid() -> str:
    return str(uuid4())

def _now() -> datetime:
    return datetime.now(timezone.utc)

#creating thumbnail table | schemas
class Thumbnail(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    job_id: str = Field(foreign_key="job.id")
    style_name: str = Field(default="")
    imagekit_url: Optional[str] = Field(default=None)
    status: str = Field(default="pending")
    error_message: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=_now)

    # Establish relationship back to Job many-to-one
    job: Optional["Job"] = Relationship(back_populates="thumbnails")


#creating job table | schemas
class Job(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    prompt: str = Field(default="")
    num_thumbnails: int = Field(default=1, ge=1, le=3)
    headshot_url: str = Field(default="")
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=_now)
    
    # Establish relationship to Thumbnails one-to-many
    thumbnails: List[Thumbnail] = Relationship(back_populates="job")




