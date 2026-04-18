import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import {
  adminListLessons,
  adminCreateLesson,
  adminUpdateLesson,
  adminDeleteLesson,
  type AdminLesson,
} from '../../services/admin'

export default function LessonEditor() {
  const [params] = useSearchParams()
  const courseId = Number(params.get('courseId'))

  const [lessons, setLessons] = useState<AdminLesson[]>([])
  const [loading, setLoading] = useState(true)

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editOrder, setEditOrder] = useState(0)
  const [editType, setEditType] = useState('text')
  const [editPrompt, setEditPrompt] = useState('')
  const [editPublished, setEditPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Create state
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const load = () => {
    if (!courseId) return
    setLoading(true)
    adminListLessons(courseId)
      .then(setLessons)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [courseId])

  const openEdit = (l: AdminLesson) => {
    setEditingId(l.id)
    setEditTitle(l.title)
    setEditContent(l.content ?? '')
    setEditOrder(l.order)
    setEditType(l.lesson_type)
    setEditPrompt(l.ai_prompt ?? '')
    setEditPublished(l.is_published)
    setEditError('')
  }

  const closeEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleSave = async () => {
    if (saving || !editTitle.trim()) return
    setSaving(true)
    setEditError('')
    try {
      await adminUpdateLesson(editingId!, {
        title: editTitle.trim(),
        content: editContent || undefined,
        order: editOrder,
        lesson_type: editType,
        ai_prompt: editPrompt || undefined,
        is_published: editPublished,
      })
      closeEdit()
      load()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async () => {
    if (!newTitle.trim() || saving) return
    setSaving(true)
    try {
      await adminCreateLesson(courseId, {
        title: newTitle.trim(),
        order: lessons.length,
      })
      setNewTitle('')
      setShowCreate(false)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '创建失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此课时？关联的进度和对话记录也会被删除。')) return
    try {
      await adminDeleteLesson(id)
      if (editingId === id) closeEdit()
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  if (!courseId) {
    return (
      <div>
        <p className="text-neutral-500 dark:text-neutral-400 mb-4">请从课程管理页选择一个课程</p>
        <Link to="/admin/courses" className="text-orange-600 dark:text-orange-400 hover:underline text-sm">
          返回课程管理
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/courses" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          ← 课程管理
        </Link>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">课时管理</h1>
      </div>

      <div className="flex gap-6">
        {/* Left: lesson list */}
        <div className="w-72 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">课时列表</span>
            <button
              onClick={() => setShowCreate(true)}
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
            >
              + 新建
            </button>
          </div>

          {showCreate && (
            <div className="mb-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="课时标题"
                className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 mb-2"
              />
              <div className="flex gap-2">
                <button onClick={handleCreate} disabled={saving} className="text-xs text-orange-600 dark:text-orange-400">
                  {saving ? '...' : '创建'}
                </button>
                <button onClick={() => { setShowCreate(false); setNewTitle('') }} className="text-xs text-neutral-400">
                  取消
                </button>
              </div>
            </div>
          )}

          {loading && <p className="text-sm text-neutral-500">加载中...</p>}
          {!loading && (
            <div className="space-y-1">
              {lessons
                .sort((a, b) => a.order - b.order)
                .map((l) => (
                  <div
                    key={l.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                      editingId === l.id
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                    onClick={() => openEdit(l)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-neutral-400 text-xs font-mono">{l.order}</span>
                      <span className="truncate">{l.title}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(l.id) }}
                      className="text-xs text-red-500 hover:text-red-600 flex-shrink-0 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              {lessons.length === 0 && (
                <p className="text-sm text-neutral-400 py-4 text-center">暂无课时</p>
              )}
            </div>
          )}
        </div>

        {/* Right: edit panel */}
        <div className="flex-1">
          {editingId ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  课时标题
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-24">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    排序
                  </label>
                  <input
                    type="number"
                    value={editOrder}
                    onChange={(e) => setEditOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    类型
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="text">文本</option>
                    <option value="video">视频</option>
                    <option value="quiz">测验</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 pb-2">
                    <input
                      type="checkbox"
                      checked={editPublished}
                      onChange={(e) => setEditPublished(e.target.checked)}
                      className="rounded"
                    />
                    发布
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  课时内容（Markdown）
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={14}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                  placeholder="输入 Markdown 内容..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  AI Prompt（系统提示词，注入到 AI 对话上下文）
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                  placeholder="输入 AI 辅导的系统提示词..."
                />
              </div>
              {editError && (
                <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm transition-colors"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-neutral-400 dark:text-neutral-500">
              从左侧选择一个课时进行编辑
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
