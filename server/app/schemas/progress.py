from datetime import datetime

from pydantic import BaseModel


class ProgressResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    status: str
    notes: str | None
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class ProgressUpdateRequest(BaseModel):
    status: str
    notes: str | None = None
