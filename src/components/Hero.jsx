/**
 * Hero — full-viewport section with multi-layer scroll parallax.
 *
 * Parallax layers (each moves at a different speed as hero scrolls out):
 *  1. Background glow        — drifts up slowly  (depth 0.2)
 *  2. Section label          — drifts up medium  (depth 0.4)
 *  3. Name heading           — drifts up standard(depth 0.6)
 *  4. Subtitle + cursor      — drifts up faster  (depth 0.8)
 *  5. Status line            — drifts up fastest (depth 1.0)
 *  6. Scroll chevron         — independent float animation + parallax
 *
 * All layers also fade out as the section leaves the viewport.
 * Typewriter + scan-line entrance effects are preserved.
 */
import { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const FULL_NAME     = 'Aasim Khan';
const SUBTITLE      = 'Cybersecurity Student · Ethical Hacking Enthusiast · MERN Stack Developer';
const TYPE_SPEED_MS = 80;

/** Returns scroll-driven y + opacity for a given depth multiplier */
function useParallaxLayer(scrollYProgress, depth, shouldReduce) {
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [0, 0] : [0, depth * -120]
  );
  const y = useSpring(yRaw, { stiffness: 60, damping: 20, mass: 0.6 });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 1 - depth * 0.3, 0]);
  return { y, opacity };
}

export default function Hero() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef(null);

  const [displayedName, setDisplayedName] = useState('');
  const [nameComplete, setNameComplete]   = useState(false);
  const [showScanline, setShowScanline]   = useState(true);

  // Track scroll within the hero section itself
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Individual parallax layers
  const glow     = useParallaxLayer(scrollYProgress, 0.2, shouldReduce);
  const label    = useParallaxLayer(scrollYProgress, 0.35, shouldReduce);
  const heading  = useParallaxLayer(scrollYProgress, 0.55, shouldReduce);
  const subtitle = useParallaxLayer(scrollYProgress, 0.75, shouldReduce);
  const status   = useParallaxLayer(scrollYProgress, 0.95, shouldReduce);

  // Chevron fades out quickly as soon as scroll starts
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const chevronY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [0, 0] : [0, -60]
  );

  // Typewriter
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedName(FULL_NAME.slice(0, i));
      if (i >= FULL_NAME.length) {
        clearInterval(interval);
        setNameComplete(true);
      }
    }, TYPE_SPEED_MS);
    return () => clearInterval(interval);
  }, []);

  // Remove scan-line after animation
  useEffect(() => {
    const t = setTimeout(() => setShowScanline(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label="Hero introduction"
      className="section-wrapper relative flex flex-col items-center justify-center"
      style={{ minHeight: '100vh' }}
    >
      {/* Scan-line sweep (CSS, entrance only) */}
      {showScanline && <div className="scanline" aria-hidden="true" />}

      {/* Layer 1 — radial glow (slowest parallax) */}
      <motion.div
        className="hero-glow"
        style={{ y: glow.y, opacity: glow.opacity }}
        aria-hidden="true"
      />

      {/* Text stack */}
      <div className="text-center px-6" style={{ maxWidth: '720px' }}>

        {/* Layer 2 — section label */}
        <motion.p
          className="section-label mb-6"
          style={{ y: label.y, opacity: label.opacity }}
          aria-hidden="true"
        >
          // initialising
        </motion.p>

        {/* Layer 3 — typewriter name */}
        <motion.h1
          className="font-mono font-medium"
          style={{
            y: heading.y,
            opacity: heading.opacity,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            lineHeight: 1.1,
            minHeight: '1.1em',
          }}
          aria-label={FULL_NAME}
        >
          {displayedName}
          {!nameComplete && (
            <span className="cursor-blink" aria-hidden="true">█</span>
          )}
        </motion.h1>

        {/* Layer 4 — subtitle */}
        <motion.p
          className="font-body mt-6"
          style={{
            y: subtitle.y,
            opacity: nameComplete ? subtitle.opacity : 0,
            fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
            color: 'var(--muted)',
            letterSpacing: '0.04em',
            transform: nameComplete ? undefined : 'translateY(8px)',
            transition: nameComplete
              ? 'none'
              : 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          {SUBTITLE}
          {nameComplete && (
            <span className="cursor-blink ml-2" aria-hidden="true">█</span>
          )}
        </motion.p>

        {/* Layer 5 — status line */}
        <motion.p
          className="font-mono mt-4"
          style={{
            y: status.y,
            opacity: nameComplete ? status.opacity : 0,
            fontSize: '0.75rem',
            color: 'var(--accent)',
            letterSpacing: '0.1em',
            transition: nameComplete ? 'none' : 'opacity 0.6s ease 0.5s',
          }}
          aria-hidden="true"
        >
          STATUS: <span style={{ color: 'var(--accent)' }}>LEARNING</span>
          <span style={{ color: 'var(--muted)', margin: '0 0.6em' }}>|</span>
          LOCATION: <span style={{ color: 'var(--warning)' }}>KATHMANDU, NP</span>
        </motion.p>
      </div>

      {/* Scroll chevron — fades out on scroll */}
      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-10 flex flex-col items-center gap-1"
        style={{
          color: 'var(--muted)',
          textDecoration: 'none',
          cursor: 'none',
          opacity: chevronOpacity,
          y: chevronY,
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        >
          scroll
        </span>
        <span
          className="chevron-bounce"
          style={{ fontSize: '1.1rem', color: 'var(--accent)' }}
          aria-hidden="true"
        >
          ↓
        </span>
      </motion.a>
    </section>
  );
}

