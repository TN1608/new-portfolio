import { AboutPage } from "./components/pages/about";
import { ContactPage } from "./components/pages/contact";
import { Hero } from "./components/pages/hero";
import { ProjectsPage } from "./components/pages/projects";
import { SkillsPage } from "./components/pages/skills";
import Preloader from "./components/Preloader";
import { SmoothScroll } from "./components/SmoothScroll";
import { ScrollProgress } from "./components/ScrollProgress";
import { ScrollTransitionSVG } from "./components/ScrollTransitionSVG";
import { Navbar } from "./components/fragments/navbar";

function App() {

  return (
    <>
      <Preloader />
      <Navbar />
      <ScrollProgress />
      <SmoothScroll>
        <Hero />
        <ProjectsPage />
        <SkillsPage />
        <AboutPage />
        <ScrollTransitionSVG />
        <ContactPage />
      </SmoothScroll>

      {/* ── 3D PERFORMANCE WARNING ── */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none text-right hidden md:flex flex-col items-end gap-1 px-4 opacity-50 transition-opacity duration-300">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          WebGL 3D
        </div>
        <p className="text-[10px] text-muted-foreground max-w-[220px] leading-tight font-sans">
          Enable <strong className="text-muted-foreground">Hardware Acceleration</strong> in your browser settings for a smooth 60FPS experience.
        </p>
      </div>
    </>
  )
}

export default App

