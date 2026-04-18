import { Navigate, Outlet, useLocation } from 'react-router'
import { NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const links = [
  { to: '/admin/courses', label: '课程管理', end: false },
  { to: '/admin/users', label: '用户管理', end: false },
  { to: '/admin/stats', label: '数据统计', end: false },
]

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-neutral-300 dark:text-neutral-700 mb-2">403</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">禁止访问：需要管理员权限</p>
          <a
            href="/dashboard"
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
          >
            返回 Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
      {/* AdminSidebar */}
      <aside className="w-56 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
        <div className="h-14 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-lg font-bold text-orange-500 dark:text-orange-400">
            管理后台
          </span>
        </div>
        <nav className="p-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-6">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {user.display_name ?? user.email}（管理员）
          </span>
          <button
            type="button"
            onClick={() => {
              logout()
              window.location.href = '/login'
            }}
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            退出
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
