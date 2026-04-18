import { useEffect, useState } from 'react'
import { listCourses, type Course } from '../../services/courses'
import CourseCard from '../../components/course/CourseCard'

const categories = ['', 'AI基础', '机器学习', '深度学习', '工具与框架']
const difficulties = ['', 'beginner', 'intermediate', 'advanced']
const difficultyLabels: Record<string, string> = { beginner: '入门', intermediate: '进阶', advanced: '高级' }

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    listCourses({ category: category || undefined, difficulty: difficulty || undefined })
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [category, difficulty])

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">课程列表</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300"
        >
          <option value="">全部分类</option>
          {categories.filter(Boolean).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300"
        >
          <option value="">全部难度</option>
          {difficulties.filter(Boolean).map((d) => (
            <option key={d} value={d}>{difficultyLabels[d]}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">加载中...</div>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {!loading && !error && courses.length === 0 && (
        <p className="text-center py-12 text-neutral-500 dark:text-neutral-400">暂无课程</p>
      )}
      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
