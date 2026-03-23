/**
 * App.jsx — Root component for Aasim Khan's cybersecurity portfolio.
 *
 * Component tree:
 *   App
 *   ├── CustomCursor   (fixed, follows mouse with lag)
 *   ├── BackgroundGrid (fixed SVG dot-matrix)
 *   ├── Navbar         (fixed top nav)
 *   ├── Hero           (full-viewport, typewriter + scan-line)
 *   ├── About          (bio + terminal stat block)
 *   ├── Projects        (glassmorphism card grid)
 *   ├── GitHubProjects  (scroll-driven parallax repos — Framer Motion)
 *   └── Contact         (contact rows + CTA)
 */
import './index.css';
import CustomCursor         from './components/CustomCursor';
import BackgroundGrid       from './components/BackgroundGrid';
import Navbar               from './components/Navbar';
import Hero                 from './components/Hero';
import About                from './components/About';
import Projects             from './components/Projects';
import GitHubProjects       from './components/GitHubProjects';
import Contact              from './components/Contact';
import FloatingTerminal     from './components/FloatingTerminal';
import FloatingBinaryRain   from './components/FloatingBinaryRain';
import FloatingStatusHUD    from './components/FloatingStatusHUD';
import ThreatRadar          from './components/ThreatRadar';

export default function App() {
  return (
    <>
      {/* Global overlays — sit above everything */}
      <CustomCursor />
      <BackgroundGrid />

      {/* Floating ambient components */}
      <FloatingBinaryRain />
      <ThreatRadar />
      <FloatingTerminal />
      <FloatingStatusHUD />

      {/* Fixed navigation */}
      <Navbar />

      {/* Page sections */}
      <main>
        <Hero />

        {/* Divider */}
        <hr
          aria-hidden="true"
          style={{
            border: 'none',
            borderTop: '1px solid rgba(0,255,136,0.08)',
            margin: '0 2rem',
          }}
        />

        <About />

        <hr
          aria-hidden="true"
          style={{
            border: 'none',
            borderTop: '1px solid rgba(0,255,136,0.08)',
            margin: '0 2rem',
          }}
        />

        <Projects />

        <hr
          aria-hidden="true"
          style={{
            border: 'none',
            borderTop: '1px solid rgba(0,255,136,0.08)',
            margin: '0 2rem',
          }}
        />

        <GitHubProjects />

        <hr
          aria-hidden="true"
          style={{
            border: 'none',
            borderTop: '1px solid rgba(0,255,136,0.08)',
            margin: '0 2rem',
          }}
        />

        <Contact />
      </main>
    </>
  );
}

