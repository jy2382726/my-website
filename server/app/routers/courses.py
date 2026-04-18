from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.lesson import Lesson
from app.models.user import User
from app.middleware.auth import get_current_user
from app.schemas.course import (
    CourseResponse,
    CourseDetailResponse,
    EnrollmentResponse,
    LessonResponse,
)

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("", response_model=list[CourseResponse])
def list_courses(
    category: str | None = None,
    difficulty: str | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Course).filter(Course.is_published == True)  # noqa: E712
    if category:
        q = q.filter(Course.category == category)
    if difficulty:
        q = q.filter(Course.difficulty == difficulty)
    return q.order_by(Course.created_at.desc()).all()


@router.get("/enrollments/list", response_model=list[EnrollmentResponse])
def list_enrollments(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    rows = (
        db.query(Enrollment, Course.title)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(Enrollment.user_id == user.id)
        .order_by(Enrollment.enrolled_at.desc())
        .all()
    )
    return [
        EnrollmentResponse(
            course_id=enr.course_id,
            title=title,
            enrolled_at=enr.enrolled_at,
        )
        for enr, title in rows
    ]


@router.get("/{course_id}", response_model=CourseDetailResponse)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    course = (
        db.query(Course)
        .options(joinedload(Course.lessons))
        .filter(Course.id == course_id, Course.is_published == True)  # noqa: E712
        .first()
    )
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    published_lessons = [l for l in course.lessons if l.is_published]
    course.lessons = sorted(published_lessons, key=lambda l: l.order)
    return course


@router.post("/{course_id}/enroll", status_code=status.HTTP_201_CREATED)
def enroll_course(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    existing = db.query(Enrollment).filter(
        Enrollment.user_id == user.id, Enrollment.course_id == course_id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already enrolled")

    enrollment = Enrollment(user_id=user.id, course_id=course_id)
    db.add(enrollment)

    # Auto-create progress for all published lessons
    published_lessons = db.query(Lesson).filter(
        Lesson.course_id == course_id, Lesson.is_published == True  # noqa: E712
    ).all()
    from app.models.progress import Progress
    for lesson in published_lessons:
        prog = Progress(user_id=user.id, lesson_id=lesson.id, status="not_started")
        db.add(prog)

    db.commit()
    return {"detail": "Enrolled successfully"}


@router.get("/{course_id}/lessons/{lesson_id}", response_model=LessonResponse)
def get_lesson(
    course_id: int,
    lesson_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user.id, Enrollment.course_id == course_id
    ).first()
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enrolled in this course",
        )
    lesson = db.query(Lesson).filter(
        Lesson.id == lesson_id, Lesson.course_id == course_id
    ).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson
