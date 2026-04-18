import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  adminListCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  type AdminCourse,
} from '../../services/admin'

export default function CoursesAdmin() {
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formDifficulty, setFormDifficulty] = useState('')
  const [formPublished, setFormPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    adminListCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormTitle('')
    setFormDesc('')
    setFormCategory('')
    setFormDifficulty('')
    setFormPublished(false)
    setFormError('')
  }

  const openCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (c: AdminCourse) => {
    setEditingId(c.id)
    setFormTitle(c.title)
    setFormDesc(c.description ?? '')
    setFormCategory(c.category ?? '')
    setFormDifficulty(c.difficulty ?? '')
    setFormPublished(c.is_published)
    setShowForm(true)
    setFormError('')
  }

  const handleSubmit = async () => {
    if (saving || !formTitle.trim()) return
    setSaving(true)
    setFormError('')
    try {
      const data = {
        title: formTitle.trim(),
        description: formDesc || undefined,
        category: formCategory || undefined,
        difficulty: formDifficulty || undefined,
        is_published: formPublished,
      }
      if (editingId) {
        await adminUpdateCourse(editingId, data)
      } else {
        await adminCreateCourse(data)
      }
      resetForm()
      load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此课程？')) return
    try {
      await adminDeleteCourse(id)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  const difficulties = ['', 'beginner', 'intermediate', 'advanced']
  const diffLabel: Record<string, string> = { beginner: '入门', intermediate: '进阶', advanced: '高级' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">课程管理</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
        >
          新建课程
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              {editingId ? '编辑课程' : '新建课程'}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="课程标题 *"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="课程描述"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="分类（如 AI基础）"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100"
              >
                <option value="">选择难度</option>
                {difficulties.filter(Boolean).map((d) => (
                  <option key={d} value={d}>{diffLabel[d]}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="rounded border-neutral-300"
                />
                发布
              </label>
            </div>
            {formError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formError}</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !formTitle.trim()}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm transition-colors"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-center py-8 text-neutral-500">加载中...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left">
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">ID</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">标题</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">分类</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">难度</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">状态</th>
                <th className="py-3 px-4 font-medium text-neutral-500 dark:text-neutral-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 dark:border-neutral-800/50">
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{c.id}</td>
                  <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">
                    <Link
                      to={`/admin/lessons?courseId=${c.id}`}
                      className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      {c.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{c.category ?? '-'}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{diffLabel[c.difficulty ?? ''] ?? c.difficulty ?? '-'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md ${
                        c.is_published
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {c.is_published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                    暂无课程
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
