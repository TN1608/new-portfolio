import { Hero } from "./components/pages/hero";
import Preloader from "./components/Preloader";
import { SmoothScroll } from "./components/SmoothScroll";

function App() {

  return (
    <>
      <Preloader />
      <SmoothScroll>
        <Hero />
      </SmoothScroll>
    </>
  )
}

export default App
