import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { getCourse, enrollCourse, type CourseDetail } from '../../services/courses'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [enrollMsg, setEnrollMsg] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    getCourse(Number(id))
      .then((data) => setCourse(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleEnroll = async () => {
    if (!id || enrolling) return
    setEnrolling(true)
    setEnrollMsg('')
    try {
      const res = await enrollCourse(Number(id))
      setEnrolled(true)
      setEnrollMsg(res.detail)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '注册失败'
      setEnrollMsg(msg)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
        加载中...
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || '课程不存在'}</p>
        <Link
          to="/dashboard/courses"
          className="text-teal-600 dark:text-teal-400 hover:underline text-sm"
        >
          返回课程列表
        </Link>
      </div>
    )
  }

  const difficultyLabel: Record<string, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
  }
  const difficultyColor: Record<string, string> = {
    beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  }

  return (
    <div>
      <Link
        to="/dashboard/courses"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 mb-4 transition-colors"
      >
        ← 返回课程列表
      </Link>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          {course.difficulty && (
            <span
              className={`text-xs px-2 py-0.5 rounded-md ${difficultyColor[course.difficulty] ?? ''}`}
            >
              {difficultyLabel[course.difficulty] ?? course.difficulty}
            </span>
          )}
          {course.category && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {course.category}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          {course.title}
        </h1>

        {course.description && (
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">{course.description}</p>
        )}

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          共 {course.lessons.length} 个课时
        </p>

        {!enrolled ? (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {enrolling ? '注册中...' : '注册课程'}
          </button>
        ) : (
          <span className="inline-block px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
            已注册
          </span>
        )}

        {enrollMsg && (
          <p
            className={`mt-2 text-sm ${enrolled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {enrollMsg}
          </p>
        )}
      </div>

      {course.lessons.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
            课时目录
          </h2>
          <div className="space-y-2">
            {course.lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/dashboard/learn/${lesson.id}?courseId=${course.id}`}
                  className="block rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 hover:border-teal-500/50 dark:hover:border-teal-400/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono w-6 text-right">
                      {lesson.order}
                    </span>
                    <span className="text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {lesson.title}
                    </span>
                    {lesson.lesson_type && (
                      <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                        {lesson.lesson_type}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {course.lessons.length === 0 && (
        <p className="text-center py-8 text-neutral-500 dark:text-neutral-400">暂无课时</p>
      )}
    </div>
  )
}
