/**
 * Navbar — minimal fixed top nav.
 * Parallax: slides down into view on load (motion.nav initial/animate).
 * On scroll: background opacity & blur intensify as the user leaves the hero,
 * and a subtle y-offset nudges the bar upward slightly for depth.
 */
import { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

const LINKS = [
  { label: 'About',    href: '#about'   },
  { label: 'Projects', href: '#projects' },
  { label: 'GitHub',   href: '#github'   },
  { label: 'Contact',  href: '#contact'  },
];

export default function Navbar() {
  const shouldReduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  const { scrollYProgress } = useScroll();

  // Navbar slides very slightly upward as page scrolls — gives it a floating feel
  const navY = useTransform(
    scrollYProgress,
    [0, 0.1],
    shouldReduce ? [0, 0] : [-6, 0]
  );

  // Background darkens / blur deepens as hero leaves viewport
  const bgOpacity = useTransform(scrollYProgress, [0, 0.08], [0.5, 0.92]);

  return (
    <motion.nav
      aria-label="Main navigation"
      className="section-wrapper fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-5"
      style={{ y: navY }}
      initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: -16 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Animated background layer */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,12,15,1)',
          opacity: bgOpacity,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(0,255,136,0.08)',
          zIndex: -1,
        }}
      />

      {/* Logo */}
      <motion.span
        className="font-mono"
        style={{ color: 'var(--accent)', fontSize: '0.78rem', letterSpacing: '0.15em' }}
        aria-label="Aasim Khan — root"
        whileHover={shouldReduce ? {} : { letterSpacing: '0.22em' }}
        transition={{ duration: 0.3 }}
      >
        root@aasimk910<span style={{ color: 'var(--muted)' }}>:~#</span>
      </motion.span>

      {/* Navigation links */}
      <ul className="flex gap-8 list-none" role="list">
        {LINKS.map(({ label, href }, i) => (
          <motion.li
            key={href}
            initial={shouldReduce ? {} : { opacity: 0, y: -8 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 * i, ease: 'easeOut' }}
          >
            <motion.a
              href={href}
              className="nav-link"
              aria-label={`Navigate to ${label} section`}
              whileHover={shouldReduce ? {} : { color: 'var(--accent)', y: -2 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-block' }}
            >
              {label}
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
