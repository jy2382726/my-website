from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.enrollment import Enrollment
from app.models.lesson import Lesson
from app.models.progress import Progress
from app.models.user import User
from app.middleware.auth import get_current_user
from app.schemas.progress import ProgressResponse, ProgressUpdateRequest

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("", response_model=list[ProgressResponse])
def list_all_progress(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return db.query(Progress).filter(Progress.user_id == user.id).all()


@router.get("/course/{course_id}", response_model=list[ProgressResponse])
def list_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user.id, Enrollment.course_id == course_id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enrolled in this course")

    lesson_ids = [l.id for l in db.query(Lesson).filter(Lesson.course_id == course_id).all()]
    return db.query(Progress).filter(
        Progress.user_id == user.id, Progress.lesson_id.in_(lesson_ids)
    ).all()


@router.put("/{progress_id}", response_model=ProgressResponse)
def update_progress(
    progress_id: int,
    req: ProgressUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    valid_statuses = {"not_started", "in_progress", "completed"}
    if req.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
        )

    prog = db.query(Progress).filter(Progress.id == progress_id).first()
    if not prog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress not found")
    if prog.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your progress")

    prog.status = req.status
    if req.notes is not None:
        prog.notes = req.notes
    if req.status == "completed":
        prog.completed_at = datetime.now(timezone.utc)
    else:
        prog.completed_at = None

    db.commit()
    db.refresh(prog)
    return prog
