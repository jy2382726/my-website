import { useEffect, useState } from 'react'
import { adminListUsers, adminUpdateRole, type AdminUser } from '../../services/admin'

export default function UsersAdmin() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    adminListUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (updatingId) return
    setUpdatingId(userId)
    try {
      await adminUpdateRole(userId, newRole)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新失败')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">用户管理</h1>

      {loading && <p className="text-center py-8 text-neutral-500">加载中...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left">
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">ID</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">邮箱</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">显示名称</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">角色</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-neutral-100 dark:border-neutral-800/50">
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{u.id}</td>
                  <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">{u.email}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{u.display_name ?? '-'}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={updatingId === u.id}
                      className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <option value="student">学生</option>
                      <option value="admin">管理员</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
