import { fetchApi } from './api'

export interface Course {
  id: number
  title: string
  description: string | null
  category: string | null
  difficulty: string | null
  cover_url: string | null
  is_published: boolean
}

export interface LessonBrief {
  id: number
  title: string
  order: number
  lesson_type: string
  is_published: boolean
}

export interface CourseDetail extends Course {
  lessons: LessonBrief[]
}

export interface Lesson {
  id: number
  course_id: number
  title: string
  content: string | null
  order: number
  lesson_type: string
  ai_prompt: string | null
  is_published: boolean
}

export interface Progress {
  id: number
  user_id: number
  lesson_id: number
  status: 'not_started' | 'in_progress' | 'completed'
  notes: string | null
  completed_at: string | null
}

export interface Enrollment {
  course_id: number
  title: string
  enrolled_at: string
}

export function listCourses(params?: { category?: string; difficulty?: string }): Promise<Course[]> {
  const query = new URLSearchParams()
  if (params?.category) query.set('category', params.category)
  if (params?.difficulty) query.set('difficulty', params.difficulty)
  const qs = query.toString()
  return fetchApi<Course[]>(`/courses${qs ? `?${qs}` : ''}`)
}

export function getCourse(id: number): Promise<CourseDetail> {
  return fetchApi<CourseDetail>(`/courses/${id}`)
}

export function enrollCourse(id: number): Promise<{ detail: string }> {
  return fetchApi<{ detail: string }>(`/courses/${id}/enroll`, { method: 'POST' })
}

export function getLesson(courseId: number, lessonId: number): Promise<Lesson> {
  return fetchApi<Lesson>(`/courses/${courseId}/lessons/${lessonId}`)
}

export function listProgress(): Promise<Progress[]> {
  return fetchApi<Progress[]>('/progress')
}

export function listEnrollments(): Promise<Enrollment[]> {
  return fetchApi<Enrollment[]>('/courses/enrollments/list')
}

export function listCourseProgress(courseId: number): Promise<Progress[]> {
  return fetchApi<Progress[]>(`/progress/course/${courseId}`)
}

export function updateProgress(id: number, data: { status: string; notes?: string }): Promise<Progress> {
  return fetchApi<Progress>(`/progress/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export interface ExerciseOption {
  text: string
  is_correct: boolean
}

export interface ExerciseQuestion {
  question: string
  options: ExerciseOption[]
  explanation: string
}

export interface ExerciseResponse {
  questions: ExerciseQuestion[]
}

export function generateExercise(
  lessonId: number,
  difficulty?: string,
): Promise<ExerciseResponse> {
  return fetchApi<ExerciseResponse>('/ai/exercise', {
    method: 'POST',
    body: JSON.stringify({ lesson_id: lessonId, difficulty }),
  })
}
