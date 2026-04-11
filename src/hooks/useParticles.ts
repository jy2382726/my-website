import { useCallback, useEffect, useRef } from 'react'
import { useTheme } from './useTheme'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const DESKTOP_COUNT = 80
const MOBILE_COUNT = 30
const CONNECTION_DISTANCE = 120
const SPEED = 0.3

function getParticleCount(): number {
  return window.innerWidth < 768 ? MOBILE_COUNT : DESKTOP_COUNT
}

function getAccentRGB(): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
  // Parse hex like #14b8a6 or #2dd4bf
  if (raw.startsWith('#') && raw.length === 7) {
    const r = parseInt(raw.slice(1, 3), 16)
    const g = parseInt(raw.slice(3, 5), 16)
    const b = parseInt(raw.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
  }
  // Fallback
  return '20, 184, 166'
}

export function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  useTheme() // subscribe to theme changes to trigger re-render and re-read CSS vars
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  const initParticles = useCallback((width: number, height: number, existing?: Particle[]) => {
    const count = getParticleCount()
    if (existing && existing.length === count) {
      // Resize: clamp existing particles into new bounds
      particlesRef.current = existing.map((p) => ({
        ...p,
        x: Math.min(p.x, width),
        y: Math.min(p.y, height),
      }))
    } else {
      // Fresh init
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        radius: Math.random() * 2 + 1,
      }))
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    const rgb = getAccentRGB()
    const particles = particlesRef.current

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > width) p.vx *= -1
      if (p.y < 0 || p.y > height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb}, 0.4)`
      ctx.fill()

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECTION_DISTANCE) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.strokeStyle = `rgba(${rgb}, ${0.15 * (1 - dist / CONNECTION_DISTANCE)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [canvasRef])

  // Draw reads getAccentRGB() each frame, so theme change takes effect automatically
  // without needing `theme` in the dependency array (avoiding re-creation on theme toggle)

  const start = useCallback(() => {
    if (animationRef.current) return
    animationRef.current = requestAnimationFrame(draw)
  }, [draw])

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = 0
    }
  }, [])

  // Initialize and resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const container = containerRef.current
      if (!container) return
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
      initParticles(canvas.width, canvas.height, particlesRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [canvasRef, containerRef, initParticles])

  // IntersectionObserver: pause when out of viewport
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start()
        } else {
          stop()
        }
      },
      { threshold: 0 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, start, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
}
