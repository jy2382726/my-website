from pydantic import BaseModel
from datetime import datetime


class CourseResponse(BaseModel):
    id: int
    title: str
    description: str | None
    category: str | None
    difficulty: str | None
    cover_url: str | None
    is_published: bool

    model_config = {"from_attributes": True}


class EnrollmentResponse(BaseModel):
    course_id: int
    title: str
    enrolled_at: datetime

    model_config = {"from_attributes": True}


class CourseDetailResponse(CourseResponse):
    lessons: list["LessonBriefResponse"]

    model_config = {"from_attributes": True}


class LessonBriefResponse(BaseModel):
    id: int
    title: str
    order: int
    lesson_type: str
    is_published: bool

    model_config = {"from_attributes": True}


class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    content: str | None
    order: int
    lesson_type: str
    ai_prompt: str | None
    is_published: bool

    model_config = {"from_attributes": True}


class CourseCreateRequest(BaseModel):
    title: str
    description: str | None = None
    category: str | None = None
    difficulty: str | None = None
    cover_url: str | None = None
    is_published: bool = False


class CourseUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    difficulty: str | None = None
    cover_url: str | None = None
    is_published: bool | None = None


class LessonCreateRequest(BaseModel):
    title: str
    content: str | None = None
    order: int = 0
    lesson_type: str = "text"
    ai_prompt: str | None = None
    is_published: bool = False


class LessonUpdateRequest(BaseModel):
    title: str | None = None
    content: str | None = None
    order: int | None = None
    lesson_type: str | None = None
    ai_prompt: str | None = None
    is_published: bool | None = None
