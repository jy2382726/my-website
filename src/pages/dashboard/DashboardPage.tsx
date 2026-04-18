import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { listProgress, listEnrollments, type Progress, type Enrollment } from '../../services/courses'

export default function DashboardPage() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<Progress[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listProgress(), listEnrollments()])
      .then(([prog, enr]) => {
        setProgress(prog)
        setEnrollments(enr)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const enrolledCourseCount = enrollments.length
  const completedLessonCount = progress.filter((p) => p.status === 'completed').length
  const totalLessons = progress.length
  const completionRate = totalLessons > 0 ? Math.round((completedLessonCount / totalLessons) * 100) : 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
        欢迎回来{user?.display_name ? `，${user.display_name}` : ''}
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-2" />
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">已注册课程</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">
              {enrolledCourseCount}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">已完成课时</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {completedLessonCount}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">总课时数</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-1">
              {totalLessons}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">完成率</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-1">
              {completionRate}%
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/dashboard/courses"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors"
        >
          浏览课程
        </Link>
      </div>
    </div>
  )
}
