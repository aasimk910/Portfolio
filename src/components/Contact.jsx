/**
 * Contact — centered layout with framer-motion scroll-driven parallax.
 * Section label, heading, contact rows, and CTA each arrive at different
 * depths so they appear to stack and separate on scroll.
 */
import { useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const CONTACTS = [
  {
    label: 'Email',
    display: 'aasimkhan910@gmail.com',
    href: 'mailto:aasimkhan910@gmail.com',
  },
  {
    label: 'LinkedIn',
    display: 'linkedin.com/in/aasim-khan-a92756168',
    href: 'https://www.linkedin.com/in/aasim-khan-a92756168/',
  },
  {
    label: 'GitHub',
    display: 'github.com/aasimk910',
    href: 'https://github.com/aasimk910',
  },
];

/** Creates a ripple DOM node at click coordinates inside the button */
function spawnRipple(e) {
  const btn  = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-circle';
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top  = `${e.clientY - rect.top}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

const SPRING = { stiffness: 58, damping: 20, mass: 1 };

export default function Contact() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Section label
  const rawLabelY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [45, -25]);
  const labelY    = useSpring(rawLabelY, SPRING);
  const labelOp   = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.5]);

  // Heading — slightly deeper
  const rawHeadY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [70, -40]);
  const headY    = useSpring(rawHeadY, SPRING);
  const headOp   = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.5]);

  // Contact rows — medium depth
  const rawRowsY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [95, -50]);
  const rowsY    = useSpring(rawRowsY, SPRING);
  const rowsOp   = useTransform(scrollYProgress, [0, 0.25, 0.88, 1], [0, 1, 1, 0.6]);

  // Closing brace + CTA — deepest, arrives last
  const rawCtaY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [120, -30]);
  const ctaY    = useSpring(rawCtaY, { stiffness: 48, damping: 18, mass: 1 });
  const ctaOp   = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0, 1, 1, 0.6]);

  const handleCtaClick = useCallback((e) => {
    spawnRipple(e);
    window.location.href = 'mailto:aasimkhan910@gmail.com?subject=Hello%20Aasim';
  }, []);

  return (
    <section
      id="contact"
      aria-label="Contact Aasim Khan"
      ref={containerRef}
      className="section-wrapper py-28 px-6 flex flex-col items-center text-center"
      style={{ maxWidth: '640px', margin: '0 auto' }}
    >
      {/* Section label */}
      <motion.p className="section-label" style={{ y: labelY, opacity: labelOp }}>
        // 03 — Contact
      </motion.p>

      {/* Heading — styled as a function call */}
      <motion.h2
        className="font-mono"
        style={{
          y: headY,
          opacity: headOp,
          fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          marginBottom: '2.5rem',
        }}
      >
        <span style={{ color: 'var(--accent)' }}>connect</span>
        <span style={{ color: 'var(--muted)' }}>()</span>
        <span style={{ color: 'var(--accent)' }}> {'{'}</span>
      </motion.h2>

      {/* Contact rows */}
      <motion.div
        className="w-full flex flex-col gap-5 mb-12"
        style={{ y: rowsY, opacity: rowsOp }}
        role="list"
        aria-label="Contact information"
      >
        {CONTACTS.map(({ label, display, href }, i) => (
          <motion.div
            key={label}
            className="flex justify-between items-baseline gap-4 w-full"
            style={{
              borderBottom: '1px solid rgba(0,255,136,0.1)',
              paddingBottom: '0.75rem',
            }}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
            role="listitem"
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              {label}
            </span>

            <motion.a
              href={href}
              className="contact-link"
              style={{ fontSize: '0.9rem' }}
              aria-label={`${label}: ${display}`}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              whileHover={{ color: 'var(--accent)', transition: { duration: 0.15 } }}
            >
              {display}
            </motion.a>
          </motion.div>
        ))}
      </motion.div>

      {/* Closing brace */}
      <motion.p
        className="font-mono self-center mb-10"
        style={{ y: ctaY, opacity: ctaOp, color: 'var(--accent)', fontSize: '1.4rem' }}
        aria-hidden="true"
      >
        {'}'}
      </motion.p>

      {/* CTA Button */}
      <motion.div style={{ y: ctaY, opacity: ctaOp }}>
        <motion.button
          className="cta-btn"
          onClick={handleCtaClick}
          aria-label="Send a message to Aasim Khan"
          whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.97 }}
        >
          Send a Message
        </motion.button>
      </motion.div>

      {/* Footer note */}
      <motion.p
        className="font-mono mt-16"
        style={{ opacity: ctaOp, fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.08em' }}
      >
        © {new Date().getFullYear()} Aasim Khan · Herald College Kathmandu · Built with React
      </motion.p>
    </section>
  );
}

