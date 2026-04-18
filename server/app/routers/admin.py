from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.lesson import Lesson
from app.models.user import User
from app.models.progress import Progress
from app.models.chat_message import ChatMessage
from app.middleware.auth import require_admin
from app.schemas.course import (
    CourseCreateRequest,
    CourseUpdateRequest,
    CourseResponse,
    LessonCreateRequest,
    LessonUpdateRequest,
    LessonResponse,
)
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])


# --- Courses ---

@router.get("/courses", response_model=list[CourseResponse])
def admin_list_courses(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(Course).order_by(Course.created_at.desc()).all()


@router.post("/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def admin_create_course(
    req: CourseCreateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    course = Course(**req.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/courses/{course_id}", response_model=CourseResponse)
def admin_update_course(
    course_id: int,
    req: CourseUpdateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    for key, value in req.model_dump(exclude_unset=True).items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    enroll_count = db.query(Enrollment).filter(Enrollment.course_id == course_id).count()
    if enroll_count > 0:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Course has enrollments, cannot delete")
    db.delete(course)
    db.commit()


# --- Lessons ---

@router.get("/courses/{course_id}/lessons", response_model=list[LessonResponse])
def admin_list_lessons(
    course_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()


@router.post("/courses/{course_id}/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def admin_create_lesson(
    course_id: int,
    req: LessonCreateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    lesson = Lesson(course_id=course_id, **req.model_dump())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.put("/lessons/{lesson_id}", response_model=LessonResponse)
def admin_update_lesson(
    lesson_id: int,
    req: LessonUpdateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    for key, value in req.model_dump(exclude_unset=True).items():
        setattr(lesson, key, value)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    # Cascade delete progress + chat_messages
    db.query(Progress).filter(Progress.lesson_id == lesson_id).delete()
    db.query(ChatMessage).filter(ChatMessage.lesson_id == lesson_id).delete()
    db.delete(lesson)
    db.commit()


# --- Users ---

class RoleUpdateRequest(BaseModel):
    role: str


@router.get("/users", response_model=list[UserResponse])
def admin_list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(User).order_by(User.created_at).all()


@router.put("/users/{user_id}/role", response_model=UserResponse)
def admin_update_role(
    user_id: int,
    req: RoleUpdateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.role = req.role
    db.commit()
    db.refresh(user)
    return user


# --- Stats ---

@router.get("/stats")
def admin_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    total_users = db.query(User).count()
    total_courses = db.query(Course).count()
    total_enrollments = db.query(Enrollment).count()
    total_completed = db.query(Progress).filter(Progress.status == "completed").count()
    total_progress = db.query(Progress).count()
    completion_rate = round(total_completed / total_progress * 100, 1) if total_progress > 0 else 0.0
    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "completion_rate": completion_rate,
    }
