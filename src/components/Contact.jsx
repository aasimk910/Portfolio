/**
 * Contact — centered layout with framer-motion scroll-driven parallax.
 * Includes contact rows, social media card grid, and a CTA button.
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
];

const SOCIALS = [
  {
    platform: 'GitHub',
    handle: '@aasimk910',
    href: 'https://github.com/aasimk910',
    accent: '#00FF88',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    platform: 'LinkedIn',
    handle: 'aasim-khan-a92756168',
    href: 'https://www.linkedin.com/in/aasim-khan-a92756168/',
    accent: '#0A66C2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    platform: 'Instagram',
    handle: '_.aasimkhan',
    href: 'https://www.instagram.com/_.aasimkhan/',
    accent: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    platform: 'Twitter / X',
    handle: '@aasim____khan',
    href: 'https://x.com/Aasim____khan',
    accent: '#1DA1F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    platform: 'Facebook',
    handle: 'aasimk910',
    href: 'https://www.facebook.com/aasimk910',
    accent: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    platform: 'Discord',
    handle: 'aasimk910',
    href: 'https://discord.gg/h6MEbkp7Nw',
    accent: '#5865F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
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

  // Social cards grid
  const rawSocialsY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [110, -55]);
  const socialsY    = useSpring(rawSocialsY, SPRING);
  const socialsOp   = useTransform(scrollYProgress, [0, 0.28, 0.9, 1], [0, 1, 1, 0.6]);

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
      className="section-wrapper py-28 px-4 flex flex-col items-center text-center"
      style={{ maxWidth: '860px', margin: '0 auto', width: '100%' }}
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
              style={{ fontSize: 'clamp(0.75rem, 3vw, 0.9rem)', wordBreak: 'break-all' }}
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

      {/* Social media grid */}
      <motion.div
        style={{
          y: socialsY,
          opacity: socialsOp,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
          gap: '0.65rem',
          width: '100%',
          marginBottom: '3rem',
        }}
        role="list"
        aria-label="Social media handles"
      >
        {SOCIALS.map(({ platform, handle, href, accent, icon }, i) => (
          <motion.a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${platform}: ${handle}`}
            role="listitem"
            className="glass-card p-4 flex items-center gap-3"
            style={{ textDecoration: 'none', cursor: 'none', color: 'var(--text)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
            whileHover={{
              scale: 1.03,
              borderColor: `${accent}66`,
              boxShadow: `0 0 20px ${accent}22`,
              transition: { duration: 0.2 },
            }}
          >
            <span style={{ color: accent, flexShrink: 0 }}>{icon}</span>
            <div className="flex flex-col gap-0.5 min-w-0 text-left">
              <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {platform}
              </span>
              <span className="font-body" style={{ fontSize: '0.82rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {handle}
              </span>
            </div>
            <span style={{ marginLeft: 'auto', color: accent, fontSize: '0.9rem', flexShrink: 0, opacity: 0.7 }} aria-hidden="true">↗</span>
          </motion.a>
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

