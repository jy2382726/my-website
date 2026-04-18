import { fetchApi } from './api'
import type { Course, Lesson } from './courses'

// Re-use Course + add admin-specific fields
export interface AdminCourse extends Course {}

export interface AdminLesson extends Lesson {}

export interface AdminUser {
  id: number
  email: string
  display_name: string | null
  avatar_url: string | null
  role: string
}

export interface AdminStats {
  total_users: number
  total_courses: number
  total_enrollments: number
  completion_rate: number
}

// Courses
export function adminListCourses(): Promise<AdminCourse[]> {
  return fetchApi<AdminCourse[]>('/admin/courses')
}

export function adminCreateCourse(data: {
  title: string
  description?: string
  category?: string
  difficulty?: string
  is_published?: boolean
}): Promise<AdminCourse> {
  return fetchApi<AdminCourse>('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateCourse(
  id: number,
  data: {
    title?: string
    description?: string
    category?: string
    difficulty?: string
    is_published?: boolean
  },
): Promise<AdminCourse> {
  return fetchApi<AdminCourse>(`/admin/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function adminDeleteCourse(id: number): Promise<void> {
  return fetchApi<void>(`/admin/courses/${id}`, { method: 'DELETE' })
}

// Lessons
export function adminListLessons(courseId: number): Promise<AdminLesson[]> {
  return fetchApi<AdminLesson[]>(`/admin/courses/${courseId}/lessons`)
}

export function adminCreateLesson(
  courseId: number,
  data: {
    title: string
    content?: string
    order?: number
    lesson_type?: string
    ai_prompt?: string
    is_published?: boolean
  },
): Promise<AdminLesson> {
  return fetchApi<AdminLesson>(`/admin/courses/${courseId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateLesson(
  id: number,
  data: {
    title?: string
    content?: string
    order?: number
    lesson_type?: string
    ai_prompt?: string
    is_published?: boolean
  },
): Promise<AdminLesson> {
  return fetchApi<AdminLesson>(`/admin/lessons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function adminDeleteLesson(id: number): Promise<void> {
  return fetchApi<void>(`/admin/lessons/${id}`, { method: 'DELETE' })
}

// Users
export function adminListUsers(): Promise<AdminUser[]> {
  return fetchApi<AdminUser[]>('/admin/users')
}

export function adminUpdateRole(userId: number, role: string): Promise<AdminUser> {
  return fetchApi<AdminUser>(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  })
}

// Stats
export function adminGetStats(): Promise<AdminStats> {
  return fetchApi<AdminStats>('/admin/stats')
}
