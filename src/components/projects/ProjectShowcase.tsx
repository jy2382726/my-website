import { projects } from '../../data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectShowcase() {
  return (
    <section id="projects" className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-12 text-center">
        项目展示
      </h2>

      {projects.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400 py-12">
          暂无项目
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
