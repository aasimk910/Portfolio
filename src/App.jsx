/**
 * App.jsx — Root component for Aasim Khan's portfolio.
 * Layout follows the 3D-creator template, re-skinned cyber/gamer.
 *
 * Component tree:
 *   App
 *   ├── CustomCursor      (fixed crosshair cursor)
 *   └── main
 *       ├── HeroSection     (gradient name + magnetic shield emblem)
 *       ├── MarqueeSection  (scroll-driven skill "item cards")
 *       ├── AboutSection    (char-by-char reveal + corner 3D icons)
 *       ├── LoadoutSection  (light services block)
 *       ├── ProjectsSection (sticky stacking cards)
 *       └── ContactSection  (footer)
 */
import './index.css';
import './creator.css';
import CustomCursor from './components/CustomCursor';
import {
  HeroSection,
  MarqueeSection,
  AboutSection,
  LoadoutSection,
  ProjectsSection,
  ContactSection,
} from './components/creator/Sections';

export default function App() {
  return (
    <>
      <CustomCursor />
      <main className="creator-main">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <LoadoutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
