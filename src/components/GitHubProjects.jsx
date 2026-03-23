/**
 * GitHubProjects — scroll-driven parallax showcase of GitHub repositories.
 *
 * Animation architecture (Framer Motion):
 * ─────────────────────────────────────────
 * • useScroll()         — tracks scroll progress through the section container.
 * • useTransform()      — maps scroll progress → y / opacity / scale / rotate values.
 * • Each card gets its own parallax depth multiplier so cards move at different
 *   speeds, creating a true 3-D layering effect as you scroll.
 * • The section heading has a slow upward drift (negative parallax).
 * • A floating "scanline" bar also moves at its own speed.
 * • whileHover / whileTap for interactive card micro-animations.
 * • Respects prefers-reduced-motion by zeroing all offsets.
 */

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

/* ── GitHub repos data ── */
const GITHUB_PROJECTS = [
  {
    id: 1,
    name: 'weather-app',
    fullName: 'aasimk910/weather-app',
    description:
      'Full-stack weather application using HTML, CSS, JavaScript, and PHP. Fetches live weather data via API and stores search history in a MySQL database.',
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    languageColor: '#F7DF1E',
    topics: ['javascript', 'php', 'mysql', 'weather-api'],
    href: 'https://github.com/aasimk910/weather-app',
    depth: 1.0,
    accentColor: 'var(--accent)',
  },
  {
    id: 2,
    name: 'Purano_Bhudimau',
    fullName: 'aasimk910/Purano_Bhudimau',
    description:
      'Unity 3D horror/exploration game set in a Nepali village. Collaborative project with interactive environments, scripted events, and immersive atmospheric design.',
    stars: 0,
    forks: 1,
    language: 'C#',
    languageColor: '#178600',
    topics: ['unity', 'game-dev', 'csharp', '3d'],
    href: 'https://github.com/aasimk910/Purano_Bhudimau',
    depth: 1.6,
    accentColor: 'var(--warning)',
  },
  {
    id: 3,
    name: 'A-customer-pickup-game',
    fullName: 'aasimk910/A-customer-pickup-game',
    description:
      'Unity delivery simulation implementing A* pathfinding and Ant Colony Optimisation (ACO) for intelligent NPC routing in a city road network.',
    stars: 0,
    forks: 0,
    language: 'C#',
    languageColor: '#178600',
    topics: ['unity', 'a-star', 'aco', 'ai', 'game-dev'],
    href: 'https://github.com/aasimk910/A-customer-pickup-game',
    depth: 0.6,
    accentColor: 'var(--accent)',
  },
  {
    id: 4,
    name: 'Travel-Buddy',
    fullName: 'aasimk910/Travel-Buddy',
    description:
      'MERN stack travel planning app for discovering destinations, building itineraries, and connecting with fellow travellers.',
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    languageColor: '#F7DF1E',
    topics: ['react', 'nodejs', 'mongodb', 'mern'],
    href: 'https://github.com/aasimk910/Travel-Buddy',
    depth: 1.3,
    accentColor: 'var(--accent)',
  },
];

/* ── Stat badge (stars / forks) ── */
function StatBadge({ icon, value, label }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'var(--muted)',
      }}
      aria-label={`${value} ${label}`}
    >
      <span aria-hidden="true">{icon}</span>
      {value.toLocaleString()}
    </span>
  );
}

/* ── Language dot ── */
function LangDot({ color, name }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--muted)',
        }}
      >
        {name}
      </span>
    </span>
  );
}

/* ── Single parallax card ── */
function ParallaxCard({ project, scrollYProgress, index }) {
  const shouldReduce = useReducedMotion();

  // Each card has its own depth multiplier so they move at different speeds
  const depthFactor = shouldReduce ? 0 : project.depth;

  // Map overall section scroll [0,1] → per-card vertical offset
  // Cards with higher depth move more, creating the layering illusion
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [60 * depthFactor, -60 * depthFactor]
  );

  // Opacity: fade in as section enters, stay visible through mid-scroll, fade at end
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.8, 1],
    [0, 1, 1, 0.4]
  );

  // Smooth spring on the y so motion feels physical, not mechanical
  const y = useSpring(yRaw, { stiffness: 80, damping: 20, mass: 0.5 });

  // Subtle rotation based on card index (alternates left/right)
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      shouldReduce ? 0 : (index % 2 === 0 ? 1.5 : -1.5),
      0,
      shouldReduce ? 0 : (index % 2 === 0 ? -0.8 : 0.8),
    ]
  );

  return (
    <motion.article
      style={{ y, opacity, rotateZ }}
      whileHover={shouldReduce ? {} : {
        scale: 1.03,
        rotateZ: 0,
        transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
      }}
      whileTap={shouldReduce ? {} : { scale: 0.98 }}
      className="glass-card p-6 flex flex-col gap-4"
      aria-label={`GitHub repository: ${project.fullName}`}
    >
      {/* Repo name + external link icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3
          className="font-mono"
          style={{
            fontSize: '1rem',
            fontWeight: 500,
            color: project.accentColor,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}
        >
          {/* Dimmed owner prefix */}
          <span style={{ color: 'var(--muted)', fontWeight: 400 }}>
            aasimk910/
          </span>
          {project.name}
        </h3>

        {/* GitHub link arrow */}
        <motion.a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.fullName} on GitHub`}
          style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
            flexShrink: 0,
            textDecoration: 'none',
            cursor: 'none',
          }}
          whileHover={{ color: 'var(--accent)', scale: 1.2 }}
          transition={{ duration: 0.15 }}
        >
          ↗
        </motion.a>
      </div>

      {/* Description */}
      <p
        className="font-body"
        style={{
          fontSize: '0.85rem',
          color: 'var(--text)',
          opacity: 0.72,
          lineHeight: 1.7,
          flexGrow: 1,
        }}
      >
        {project.description}
      </p>

      {/* Topics */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} role="list" aria-label="Repository topics">
        {project.topics.map((topic) => (
          <motion.span
            key={topic}
            className="tag-chip"
            role="listitem"
            whileHover={shouldReduce ? {} : { borderColor: project.accentColor, scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            {topic}
          </motion.span>
        ))}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(0,255,136,0.08)',
          flexWrap: 'wrap',
        }}
      >
        <LangDot color={project.languageColor} name={project.language} />
        <StatBadge icon="★" value={project.stars} label="stars" />
        <StatBadge icon="⑂" value={project.forks} label="forks" />
      </div>
    </motion.article>
  );
}

/* ── Section heading with its own parallax drift ── */
function ParallaxHeading({ scrollYProgress }) {
  const shouldReduce = useReducedMotion();

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduce ? 0 : 0, shouldReduce ? 0 : -40]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div style={{ y, opacity }}>
      <p className="section-label">// 03 — GitHub</p>
      <h2
        className="font-mono"
        style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          color: 'var(--text)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          marginBottom: '3rem',
          marginTop: '0.5rem',
        }}
      >
        Open source<span style={{ color: 'var(--accent)' }}>.</span>
      </h2>
    </motion.div>
  );
}

/* ── Decorative floating scanline bar (pure parallax ornament) ── */
function FloatingScanline({ scrollYProgress }) {
  const shouldReduce = useReducedMotion();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduce ? 0 : -120, shouldReduce ? 0 : 120]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.06, 0.06, 0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '40%',
        height: '1px',
        background: 'var(--accent)',
        y,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ── Main export ── */
export default function GitHubProjects() {
  // The container ref tells useScroll where to track scroll progress
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // start counting when top of section hits bottom of viewport,
    // end when bottom of section leaves top of viewport
    offset: ['start end', 'end start'],
  });

  return (
    <section
      id="github"
      ref={containerRef}
      aria-label="GitHub projects with parallax"
      className="section-wrapper py-32 px-6"
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating ornament line */}
      <FloatingScanline scrollYProgress={scrollYProgress} />

      {/* Heading */}
      <ParallaxHeading scrollYProgress={scrollYProgress} />

      {/* Cards grid — 3-col on large screens, 2-col mid, 1-col mobile */}
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
        }}
      >
        {GITHUB_PROJECTS.map((project, index) => (
          <ParallaxCard
            key={project.id}
            project={project}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* "View all on GitHub" footer link */}
      <motion.div
        style={{
          marginTop: '3rem',
          textAlign: 'center',
          opacity: useTransform(scrollYProgress, [0.5, 0.7], [0, 1]),
          y: useTransform(scrollYProgress, [0.5, 0.7], [20, 0]),
        }}
      >
        <motion.a
          href="https://github.com/aasimk910?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View all repositories on GitHub"
          className="font-mono"
          style={{
            fontSize: '0.8rem',
            color: 'var(--muted)',
            textDecoration: 'none',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          whileHover={{ color: 'var(--accent)', gap: '0.9rem' }}
          transition={{ duration: 0.2 }}
        >
          View all repositories ↗
        </motion.a>
      </motion.div>
    </section>
  );
}
