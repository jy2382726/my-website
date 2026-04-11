import { ThemeProvider } from './hooks/useTheme'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/hero/HeroSection'
import AboutSection from './components/about/AboutSection'
import ProjectShowcase from './components/projects/ProjectShowcase'
import Footer from './components/layout/Footer'

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <HeroSection />
        <div className="mx-auto max-w-6xl px-4">
          <AboutSection />
          <ProjectShowcase />
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  )
}
