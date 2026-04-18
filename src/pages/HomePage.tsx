import HeroSection from '../components/hero/HeroSection'
import AboutSection from '../components/about/AboutSection'
import ProjectShowcase from '../components/projects/ProjectShowcase'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="mx-auto max-w-6xl px-4">
        <AboutSection />
        <ProjectShowcase />
      </div>
    </>
  )
}
