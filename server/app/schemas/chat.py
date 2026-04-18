from pydantic import BaseModel


class ChatRequest(BaseModel):
    lesson_id: int
    message: str


class ExerciseRequest(BaseModel):
    lesson_id: int
    difficulty: str | None = None


class ExerciseOption(BaseModel):
    text: str
    is_correct: bool


class ExerciseQuestion(BaseModel):
    question: str
    options: list[ExerciseOption]
    explanation: str | None = None


class ExerciseResponse(BaseModel):
    questions: list[ExerciseQuestion]
