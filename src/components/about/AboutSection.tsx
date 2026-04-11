import { aboutData } from '../../data/about'

export default function AboutSection() {
  const { bio, techStack } = aboutData

  return (
    <section id="about" className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-8 text-center">
        关于我
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto text-center mb-10">
        {bio}
      </p>
      {techStack.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 dark:border-teal-400/20"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
