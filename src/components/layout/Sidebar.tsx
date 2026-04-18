import { NavLink } from 'react-router'

const links = [
  { to: '/dashboard', label: '学习概览', end: true },
  { to: '/dashboard/courses', label: '课程列表', end: false },
  { to: '/dashboard/profile', label: '个人设置', end: false },
]

export default function Sidebar() {
  return (
    <aside className="w-56 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
      <div className="h-14 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-lg font-bold text-teal-500 dark:text-teal-400">
          AI 学习平台
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
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
