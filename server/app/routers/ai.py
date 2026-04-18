import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.chat_message import ChatMessage
from app.models.enrollment import Enrollment
from app.models.lesson import Lesson
from app.models.user import User
from app.middleware.auth import get_current_user
from app.schemas.chat import ChatRequest, ExerciseRequest, ExerciseResponse, ExerciseQuestion, ExerciseOption
from app.services.ai_service import stream_chat, generate_exercise

router = APIRouter(prefix="/api/ai", tags=["ai"])


def _check_enrollment(user: User, lesson: Lesson, db: Session):
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user.id, Enrollment.course_id == lesson.course_id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enrolled in this course")


@router.post("/chat")
async def chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == req.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    _check_enrollment(user, lesson, db)

    # Save user message
    user_msg = ChatMessage(user_id=user.id, lesson_id=req.lesson_id, role="user", content=req.message)
    db.add(user_msg)
    db.commit()

    # Load recent chat history
    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id, ChatMessage.lesson_id == req.lesson_id
    ).order_by(ChatMessage.created_at).all()[-20:]

    messages = [{"role": "assistant" if m.role == "ai" else m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": req.message})

    system_prompt = lesson.ai_prompt or f"You are a helpful AI tutor. The student is studying: {lesson.title}"

    async def event_stream():
        full_response = []
        try:
            async for sse_data in stream_chat(system_prompt, messages):
                yield sse_data
                if sse_data.startswith("data: ") and "token" in sse_data:
                    try:
                        token = json.loads(sse_data[6:])["token"]
                        full_response.append(token)
                    except (json.JSONDecodeError, KeyError):
                        pass
        finally:
            # Save AI response
            if full_response:
                ai_msg = ChatMessage(
                    user_id=user.id, lesson_id=req.lesson_id, role="ai",
                    content="".join(full_response),
                )
                db.add(ai_msg)
                db.commit()

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/exercise", response_model=ExerciseResponse)
async def generate_exercise_endpoint(
    req: ExerciseRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == req.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    _check_enrollment(user, lesson, db)

    difficulty = req.difficulty or lesson.course.difficulty or "intermediate"

    try:
        raw = await generate_exercise(
            system_prompt=lesson.ai_prompt or "",
            lesson_content=lesson.content or "",
            difficulty=difficulty,
        )
        # Parse JSON from LLM response
        # Handle potential markdown code block wrapping
        text = raw.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
        questions_data = json.loads(text)
        questions = [ExerciseQuestion(**q) for q in questions_data]
        return ExerciseResponse(questions=questions)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse exercise response from AI")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"AI service unavailable: {str(e)}")


@router.get("/chat/{lesson_id}")
def get_chat_history(
    lesson_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    _check_enrollment(user, lesson, db)

    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id, ChatMessage.lesson_id == lesson_id
    ).order_by(ChatMessage.created_at).all()
    return [{"role": m.role, "content": m.content, "created_at": m.created_at.isoformat()} for m in messages]
