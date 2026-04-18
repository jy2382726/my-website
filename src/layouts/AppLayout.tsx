import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/layout/Sidebar'

export default function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-6">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {user.display_name ?? user.email}
          </span>
          <form action="/logout" onSubmit={(e) => { e.preventDefault(); }}>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('access_token')
                navigate('/login', { replace: true })
              }}
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
            >
              退出
            </button>
          </form>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
