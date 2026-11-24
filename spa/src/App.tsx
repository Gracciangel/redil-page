import './App.css'
import { Congregations } from './components/Congregations'
import { Footer } from './components/Footer'
import { Features } from './components/Features'
import { Hero } from './components/Hero'
import { InstallCta } from './components/InstallCta'
import { InstallProvider } from './components/InstallManager'
import { Nav } from './components/Nav'
import { Problem } from './components/Problem'
import { Progress } from './components/Progress'
import { Solution } from './components/Solution'
import { usePageMotion } from './hooks/useMotion'

function Landing() {
  usePageMotion()

  return (
    <div className="landing">
      <div className="background-orbs" aria-hidden="true">
        <span className="orb orb--one" />
        <span className="orb orb--two" />
        <span className="orb orb--three" />
      </div>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Congregations />
        <Features />
        <Progress />
        <InstallCta />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <InstallProvider>
      <Landing />
    </InstallProvider>
  )
}
