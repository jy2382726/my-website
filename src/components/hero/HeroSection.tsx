import { useRef } from 'react'
import ParticleCanvas from './ParticleCanvas'
import { useParticles } from '../../hooks/useParticles'

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useParticles(canvasRef, containerRef)

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleCanvas ref={canvasRef} />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
          Your Name
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto">
          独立开发者 · 专注构建高质量的 Web 应用
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:email@example.com"
            className="px-6 py-3 rounded-lg bg-teal-500 dark:bg-teal-400 text-white dark:text-neutral-900 font-medium hover:bg-teal-600 dark:hover:bg-teal-500 transition-colors"
          >
            联系我
          </a>
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg border border-teal-500 dark:border-teal-400 text-teal-500 dark:text-teal-400 font-medium hover:bg-teal-500/10 dark:hover:bg-teal-400/10 transition-colors"
          >
            查看项目
          </a>
        </div>
      </div>
    </section>
  )
}
