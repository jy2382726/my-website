import { Link } from 'react-router'
import type { Course } from '../../services/courses'

interface CourseCardProps {
  course: Course
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

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/dashboard/courses/${course.id}`}
      className="block rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10 hover:border-teal-500/50 dark:hover:border-teal-400/50"
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {course.difficulty && (
            <span className={`text-xs px-2 py-0.5 rounded-md ${difficultyColor[course.difficulty] ?? ''}`}>
              {difficultyLabel[course.difficulty] ?? course.difficulty}
            </span>
          )}
          {course.category && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {course.category}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {course.description}
          </p>
        )}
      </div>
    </Link>
  )
}
