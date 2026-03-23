/**
 * About — two-column layout with framer-motion scroll-driven parallax.
 * Left column (bio) and right column (terminal block) move at different depths
 * creating a layered parallax separation as the section scrolls.
 */
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const BIO = `I am a Computer Science student at Herald College Kathmandu, passionate about
programming and cybersecurity. I enjoy building web applications using the MERN
stack and Python, while actively exploring ethical hacking and network security.
I am eager to grow my skills and build a career at the intersection of software
development and cybersecurity.`;

const STATS = [
  { key: 'education',      val: 'BSc Computer Science — Herald College KTM' },
  { key: 'focus',          val: 'Cybersecurity · Web Development' },
  { key: 'languages',      val: 'Python · JavaScript · HTML · CSS' },
  { key: 'stack',          val: 'MERN · React · Node.js · MongoDB' },
  { key: 'learning',       val: 'Ethical Hacking · Network Security' },
  { key: 'tools',          val: 'Git · VS Code · Burp Suite (beginner)' },
  { key: 'availability',   val: 'Open to internships & opportunities' },
];

const SPRING = { stiffness: 60, damping: 20, mass: 1 };

export default function About() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Section label — fastest layer
  const rawLabelY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [50, -30]);
  const labelY    = useSpring(rawLabelY, SPRING);
  const labelOp   = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.5]);

  // Heading — slightly slower
  const rawHeadY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [70, -45]);
  const headY    = useSpring(rawHeadY, SPRING);
  const headOp   = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.5]);

  // Left column (bio) — medium depth
  const rawLeftY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [90, -50]);
  const leftY    = useSpring(rawLeftY, SPRING);
  const leftOp   = useTransform(scrollYProgress, [0, 0.25, 0.9, 1], [0, 1, 1, 0.6]);

  // Right column (terminal) — faster depth → separates from left as you scroll
  const rawRightY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [130, -30]);
  const rightY    = useSpring(rawRightY, { stiffness: 50, damping: 18, mass: 1 });
  const rightOp   = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0, 1, 1, 0.6]);

  return (
    <section
      id="about"
      aria-label="About Aasim Khan"
      ref={containerRef}
      className="section-wrapper py-28 px-6"
      style={{ maxWidth: '1100px', margin: '0 auto' }}
    >
      {/* Section label */}
      <motion.p
        className="section-label"
        style={{ y: labelY, opacity: labelOp }}
      >
        // 01 — About
      </motion.p>

      {/* Section heading */}
      <motion.h2
        className="font-mono"
        style={{
          y: headY,
          opacity: headOp,
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          color: 'var(--text)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          marginBottom: '3rem',
        }}
      >
        Who am I<span style={{ color: 'var(--accent)' }}>.</span>
      </motion.h2>

      {/* Two-column grid */}
      <div
        className="grid gap-12"
        style={{ gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)' }}
      >
        {/* Left — bio */}
        <motion.div style={{ y: leftY, opacity: leftOp }}>
          <p
            className="font-body leading-relaxed"
            style={{
              fontSize: '1rem',
              color: 'var(--text)',
              opacity: 0.85,
              lineHeight: 1.85,
            }}
          >
            {BIO}
          </p>

          <p
            className="font-mono mt-8"
            style={{ fontSize: '0.75rem', color: 'var(--warning)', letterSpacing: '0.1em' }}
            aria-label="Warning: authorized use only"
          >
            ⚠ ALWAYS LEARNING · ALWAYS BUILDING · ETHICALLY
          </p>
        </motion.div>

        {/* Right — terminal block */}
        <motion.div
          className="terminal-block"
          style={{ y: rightY, opacity: rightOp, alignSelf: 'start' }}
          role="region"
          aria-label="Credentials and skills summary"
        >
          <p className="prompt" aria-hidden="true">
            user@aasim:~$ whoami
          </p>

          <dl>
            {STATS.map(({ key, val }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
                style={{ marginBottom: '0.55rem', display: 'flex', flexWrap: 'wrap', gap: '0 0.5rem' }}
              >
                <dt className="kv-key">{key}</dt>
                <dd
                  className="kv-val"
                  style={{ color: key === 'clearance' ? 'var(--warning)' : 'var(--text)' }}
                >
                  <span style={{ color: 'var(--muted)', marginRight: '0.4rem' }}>:</span>
                  {val}
                </dd>
              </motion.div>
            ))}
          </dl>

          <p className="prompt mt-3" aria-hidden="true">
            <span className="cursor-blink">█</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

