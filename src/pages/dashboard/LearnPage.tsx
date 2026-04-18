import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  getLesson,
  getCourse,
  listCourseProgress,
  updateProgress,
  generateExercise,
  type Lesson,
  type CourseDetail,
  type Progress,
  type ExerciseQuestion,
} from '../../services/courses'
import ChatPanel from '../../components/chat/ChatPanel'
import ProgressBar from '../../components/course/ProgressBar'

export default function LearnPage() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const courseId = params.get('courseId')

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [progressList, setProgressList] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Progress state
  const [currentProgress, setCurrentProgress] = useState<Progress | null>(null)
  const [markingDone, setMarkingDone] = useState(false)

  // Exercise state
  const [exercises, setExercises] = useState<ExerciseQuestion[]>([])
  const [exerciseLoading, setExerciseLoading] = useState(false)
  const [exerciseError, setExerciseError] = useState('')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (!id || !courseId) return
    setLoading(true)
    setError('')
    Promise.all([
      getLesson(Number(courseId), Number(id)),
      getCourse(Number(courseId)),
      listCourseProgress(Number(courseId)),
    ])
      .then(([les, crs, prog]) => {
        setLesson(les)
        setCourse(crs)
        setProgressList(prog)
        const cur = prog.find((p) => p.lesson_id === les.id)
        setCurrentProgress(cur ?? null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, courseId])

  // Auto-set to in_progress when viewing
  useEffect(() => {
    if (!currentProgress || currentProgress.status !== 'not_started') return
    updateProgress(currentProgress.id, { status: 'in_progress' })
      .then((updated) => setCurrentProgress(updated))
      .catch(() => {})
  }, [currentProgress])

  const handleMarkComplete = async () => {
    if (!currentProgress || markingDone) return
    setMarkingDone(true)
    try {
      const updated = await updateProgress(currentProgress.id, { status: 'completed' })
      setCurrentProgress(updated)
    } catch {
      // silent
    } finally {
      setMarkingDone(false)
    }
  }

  const handleGenerateExercise = async () => {
    if (!id || exerciseLoading) return
    setExerciseLoading(true)
    setExerciseError('')
    setExercises([])
    setSelectedAnswers({})
    setShowResults(false)
    try {
      const res = await generateExercise(Number(id))
      setExercises(res.questions)
    } catch (err) {
      setExerciseError(err instanceof Error ? err.message : '生成练习题失败')
    } finally {
      setExerciseLoading(false)
    }
  }

  const isCompleted = currentProgress?.status === 'completed'

  // Navigation: find prev/next lesson
  const lessons = course?.lessons.sort((a, b) => a.order - b.order) ?? []
  const currentIndex = lessons.findIndex((l) => l.id === Number(id))
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  // Course progress stats
  const completedCount = progressList.filter((p) => p.status === 'completed').length

  if (loading) {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
        加载中...
      </div>
    )
  }

  if (error || !lesson || !course) {
    return (
      <div className="py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || '课时不存在'}</p>
        <Link
          to={`/dashboard/courses/${courseId}`}
          className="text-teal-600 dark:text-teal-400 hover:underline text-sm"
        >
          返回课程
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left: content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <Link
            to={`/dashboard/courses/${course.id}`}
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            ← {course.title}
          </Link>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mt-1">
            {lesson.title}
          </h1>
          <div className="mt-2">
            <ProgressBar completed={completedCount} total={lessons.length} />
          </div>
        </div>

        {/* Markdown content */}
        <div className="flex-1 px-6 py-6">
          {lesson.content ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{lesson.content}</Markdown>
            </div>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400">暂无课时内容</p>
          )}

          {/* Exercise section */}
          {exercises.length > 0 && (
            <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                练习题
              </h2>
              <div className="space-y-6">
                {exercises.map((q, qi) => (
                  <div
                    key={qi}
                    className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
                  >
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                      {qi + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const selected = selectedAnswers[qi] === oi
                        const showCorrect = showResults
                        let optClass =
                          'block w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors '
                        if (showCorrect) {
                          if (opt.is_correct) {
                            optClass +=
                              'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          } else if (selected && !opt.is_correct) {
                            optClass +=
                              'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          } else {
                            optClass +=
                              'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400'
                          }
                        } else if (selected) {
                          optClass +=
                            'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                        } else {
                          optClass +=
                            'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                        }
                        return (
                          <button
                            key={oi}
                            onClick={() => {
                              if (!showResults) {
                                setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))
                              }
                            }}
                            className={optClass}
                          >
                            {opt.text}
                          </button>
                        )
                      })}
                    </div>
                    {showResults && q.explanation && (
                      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        解析：{q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {!showResults && Object.keys(selectedAnswers).length === exercises.length && (
                <button
                  onClick={() => setShowResults(true)}
                  className="mt-4 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm transition-colors"
                >
                  提交答案
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom: actions + navigation */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateExercise}
                disabled={exerciseLoading}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
              >
                {exerciseLoading ? '生成中...' : '生成练习题'}
              </button>
              {exerciseError && (
                <span className="text-xs text-red-600 dark:text-red-400">{exerciseError}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isCompleted ? (
                <button
                  onClick={handleMarkComplete}
                  disabled={markingDone}
                  className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm transition-colors"
                >
                  {markingDone ? '...' : '标记完成'}
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
                  已完成
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  to={`/dashboard/learn/${prevLesson.id}?courseId=${course.id}`}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  ← 上一课
                </Link>
              )}
              {nextLesson && (
                <Link
                  to={`/dashboard/learn/${nextLesson.id}?courseId=${course.id}`}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm transition-colors"
                >
                  下一课 →
                </Link>
              )}
              {!nextLesson && isCompleted && (
                <Link
                  to={`/dashboard/courses/${course.id}`}
                  className="px-3 py-1.5 rounded-lg border border-teal-500 text-teal-600 dark:text-teal-400 text-sm hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                >
                  返回课程
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: AI chat panel */}
      <div className="w-80 lg:w-96 border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex-shrink-0">
        <ChatPanel lessonId={Number(id)} />
      </div>
    </div>
  )
}
