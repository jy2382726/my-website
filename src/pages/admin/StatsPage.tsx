import { useEffect, useState } from 'react'
import { adminGetStats, type AdminStats } from '../../services/admin'

export default function StatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const cards = stats
    ? [
        { label: '总用户数', value: stats.total_users, color: 'text-orange-600 dark:text-orange-400' },
        { label: '总课程数', value: stats.total_courses, color: 'text-teal-600 dark:text-teal-400' },
        { label: '总注册数', value: stats.total_enrollments, color: 'text-blue-600 dark:text-blue-400' },
        { label: '完成率', value: `${stats.completion_rate}%`, color: 'text-green-600 dark:text-green-400' },
      ]
    : []

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">数据统计</h1>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mb-2" />
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-10" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
            >
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
