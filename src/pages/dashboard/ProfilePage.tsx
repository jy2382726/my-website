import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { fetchApi, ApiError } from '../../services/api'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.display_name ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Password change
  const [showPwForm, setShowPwForm] = useState(false)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const handleSaveProfile = async () => {
    if (saving) return
    setSaving(true)
    setMsg(null)
    try {
      const updated = await fetchApi<{ display_name: string }>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({ display_name: displayName }),
      })
      if (user) {
        setUser({ ...user, display_name: updated.display_name })
      }
      setEditing(false)
      setMsg({ type: 'ok', text: '更新成功' })
    } catch (err) {
      if (err instanceof ApiError) {
        setMsg({ type: 'err', text: err.detail })
      } else {
        setMsg({ type: 'err', text: '更新失败' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (pwSaving) return
    if (newPw.length < 8) {
      setPwMsg({ type: 'err', text: '新密码至少 8 个字符' })
      return
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'err', text: '两次密码输入不一致' })
      return
    }
    setPwSaving(true)
    setPwMsg(null)
    try {
      await fetchApi('/auth/me/password', {
        method: 'PUT',
        body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
      })
      setPwMsg({ type: 'ok', text: '密码修改成功' })
      setOldPw('')
      setNewPw('')
      setConfirmPw('')
      setShowPwForm(false)
    } catch (err) {
      if (err instanceof ApiError) {
        setPwMsg({ type: 'err', text: err.detail })
      } else {
        setPwMsg({ type: 'err', text: '密码修改失败' })
      }
    } finally {
      setPwSaving(false)
    }
  }

  const roleLabel: Record<string, string> = { student: '学生', admin: '管理员' }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
        个人设置
      </h1>

      {/* Profile info */}
      <div className="max-w-md rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              邮箱
            </label>
            <p className="text-neutral-900 dark:text-neutral-50">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              显示名称
            </label>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="输入显示名称"
                />
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm transition-colors"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setDisplayName(user?.display_name ?? '')
                  }}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-neutral-900 dark:text-neutral-50">
                  {user?.display_name || '未设置'}
                </p>
                <button
                  onClick={() => {
                    setDisplayName(user?.display_name ?? '')
                    setEditing(true)
                  }}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                >
                  编辑
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              角色
            </label>
            <p className="text-neutral-900 dark:text-neutral-50">{roleLabel[user?.role ?? 'student'] ?? user?.role}</p>
          </div>
        </div>

        {msg && (
          <p
            className={`mt-3 text-sm ${msg.type === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {msg.text}
          </p>
        )}
      </div>

      {/* Password change */}
      <div className="max-w-md">
        {!showPwForm ? (
          <button
            onClick={() => setShowPwForm(true)}
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
          >
            修改密码
          </button>
        ) : (
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-3">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              修改密码
            </h3>
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              placeholder="当前密码"
              className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="新密码（至少 8 个字符）"
              className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="确认新密码"
              className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleChangePassword}
                disabled={pwSaving}
                className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm transition-colors"
              >
                {pwSaving ? '修改中...' : '确认修改'}
              </button>
              <button
                onClick={() => {
                  setShowPwForm(false)
                  setOldPw('')
                  setNewPw('')
                  setConfirmPw('')
                  setPwMsg(null)
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                取消
              </button>
            </div>
            {pwMsg && (
              <p
                className={`text-sm ${pwMsg.type === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {pwMsg.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
