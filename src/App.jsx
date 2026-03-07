import { AboutPage } from "./components/pages/about";
import { ContactPage } from "./components/pages/contact";
import { Hero } from "./components/pages/hero";
import { ProjectsPage } from "./components/pages/projects";
import { SkillsPage } from "./components/pages/skills";
import Preloader from "./components/Preloader";
import { SmoothScroll } from "./components/SmoothScroll";
import { ScrollProgress } from "./components/ScrollProgress";
import { ScrollTransitionSVG } from "./components/ScrollTransitionSVG";

function App() {

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <SmoothScroll>
        <Hero />
        <ProjectsPage />
        <SkillsPage />
        <AboutPage />
        <ScrollTransitionSVG />
        <ContactPage />
      </SmoothScroll>
    </>
  )
}

export default App

