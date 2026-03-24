/**
 * Navbar — minimal fixed top nav.
 * Parallax: slides down into view on load (motion.nav initial/animate).
 * On scroll: background opacity & blur intensify as the user leaves the hero,
 * and a subtle y-offset nudges the bar upward slightly for depth.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
    <>
      <motion.nav
        aria-label="Main navigation"
        className="section-wrapper fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4"
        style={{ y: navY, zIndex: 100 }}
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
        <motion.a
          href="#hero"
          className="font-mono"
          style={{ color: 'var(--accent)', fontSize: '0.78rem', letterSpacing: '0.15em', textDecoration: 'none', cursor: 'none' }}
          aria-label="Aasim Khan — root"
          whileHover={shouldReduce ? {} : { letterSpacing: '0.22em' }}
          transition={{ duration: 0.3 }}
        >
          root@aasimk910<span style={{ color: 'var(--muted)' }}>:~#</span>
        </motion.a>

        {/* Desktop nav links */}
        <ul className="hidden sm:flex gap-8 list-none" role="list">
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

        {/* Mobile hamburger button */}
        <button
          className="sm:hidden flex flex-col justify-center items-center gap-1.5 p-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 110 }}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'block', width: '22px', height: '2px', background: 'var(--accent)', borderRadius: '2px' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'block', width: '22px', height: '2px', background: 'var(--accent)', borderRadius: '2px' }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'block', width: '22px', height: '2px', background: 'var(--accent)', borderRadius: '2px' }}
          />
        </button>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              zIndex: 99,
              background: 'rgba(8,12,15,0.97)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(0,255,136,0.1)',
              padding: '1.5rem 1.5rem 2rem',
            }}
          >
            <ul className="flex flex-col gap-5 list-none" role="list">
              {LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="nav-link"
                    onClick={closeMenu}
                    aria-label={`Navigate to ${label} section`}
                    style={{ fontSize: '1rem', letterSpacing: '0.08em', display: 'block' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
