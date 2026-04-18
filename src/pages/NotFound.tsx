import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">404</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          页面不存在
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-teal-500 dark:bg-teal-400 text-white dark:text-neutral-900 font-medium hover:bg-teal-600 dark:hover:bg-teal-500 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}
