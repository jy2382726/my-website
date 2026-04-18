import { useState, useCallback, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export interface ChatMsg {
  role: 'user' | 'ai'
  content: string
}

export function useChat(lessonId: number) {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const loadHistory = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    const res = await fetch(`${API_BASE}/ai/chat/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return
    const data: { role: string; content: string }[] = await res.json()
    setMessages(
      data.map((m) => ({
        role: m.role === 'user' ? 'user' : 'ai',
        content: m.content,
      })),
    )
  }, [lessonId])

  const send = useCallback(
    async (message: string) => {
      if (streaming) return
      const token = localStorage.getItem('access_token')
      if (!token) return

      setMessages((prev) => [...prev, { role: 'user', content: message }])
      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(`${API_BASE}/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lesson_id: lessonId, message }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({}))
          setMessages((prev) => [
            ...prev,
            { role: 'ai', content: `Error: ${err.detail ?? res.statusText}` },
          ])
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let aiContent = ''
        let buffer = ''

        setMessages((prev) => [...prev, { role: 'ai', content: '' }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.token) {
                aiContent += parsed.token
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { role: 'ai', content: aiContent }
                  return updated
                })
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: '网络错误，请重试' },
        ])
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [lessonId, streaming],
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { messages, streaming, send, abort, loadHistory }
}
