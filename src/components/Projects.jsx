/**
 * Projects — 2-col desktop / 1-col mobile CSS grid.
 * Each card is a motion.article driven by the section's scrollYProgress.
 * Cards alternate between two parallax depths, so they visually separate
 * and re-converge as the user scrolls through the section.
 */
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const PROJECTS = [
  {
    name: 'Weather App',
    description:
      'A full-stack weather application built with HTML, CSS, JavaScript, and PHP. Fetches live weather data via API and stores search history in a MySQL database.',
    tags: ['JavaScript', 'PHP', 'HTML/CSS', 'MySQL'],
    href: 'https://github.com/aasimk910/weather-app',
    accent: 'var(--accent)',
  },
  {
    name: 'Purano Bhudimau',
    description:
      'A Unity 3D horror/exploration game set in a Nepali village. Collaborative project featuring interactive environments, scripted events, and atmospheric design.',
    tags: ['Unity', 'C#', 'Game Dev', '3D'],
    href: 'https://github.com/aasimk910/Purano_Bhudimau',
    accent: 'var(--warning)',
  },
  {
    name: 'Customer Pickup Game',
    description:
      'A Unity-based delivery simulation game implementing A* pathfinding and Ant Colony Optimisation (ACO) algorithms for intelligent NPC routing.',
    tags: ['Unity', 'C#', 'A*', 'ACO', 'AI'],
    href: 'https://github.com/aasimk910/A-customer-pickup-game',
    accent: 'var(--accent)',
  },
  {
    name: 'Travel Buddy',
    description:
      'A travel planning web application built with the MERN stack. Helps users discover destinations, plan itineraries, and connect with fellow travellers.',
    tags: ['React', 'Node.js', 'MongoDB', 'MERN'],
    href: 'https://github.com/aasimk910/Travel-Buddy',
    accent: 'var(--accent)',
  },
];

/** Single project card with its own parallax offset driven by parent scrollYProgress */
function ProjectCard({ project, scrollYProgress, depth, shouldReduce }) {
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [0, 0] : [depth * 60, depth * -40]
  );
  const y      = useSpring(rawY, { stiffness: 55, damping: 18, mass: 1 });
  const cardOp = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 1, 1, 0.7]);

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-7 flex flex-col gap-5"
      style={{ y, opacity: cardOp, textDecoration: 'none', cursor: 'none', display: 'flex' }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 28px rgba(0,255,136,0.18)`,
        borderColor: 'rgba(0,255,136,0.45)',
        transition: { duration: 0.2 },
      }}
      aria-label={`View ${project.name} on GitHub`}
    >
      {/* Project name */}
      <h3
        className="font-mono font-medium"
        style={{
          fontSize: '1.05rem',
          color: project.accent,
          letterSpacing: '-0.01em',
        }}
      >
        {project.name}
      </h3>

      {/* Description */}
      <p
        className="font-body leading-relaxed flex-1"
        style={{
          fontSize: '0.875rem',
          color: 'var(--text)',
          opacity: 0.75,
          lineHeight: 1.7,
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2" role="list" aria-label="Project tags">
        {project.tags.map((tag) => (
          <span key={tag} className="tag-chip" role="listitem">
            {tag}
          </span>
        ))}
      </div>

      {/* Arrow link */}
      <span
        className="font-mono self-start"
        style={{
          fontSize: '0.78rem',
          color: 'var(--accent)',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        VIEW_PROJECT <span aria-hidden="true">→</span>
      </span>
    </motion.a>
  );
}

export default function Projects() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Section label
  const rawLabelY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [40, -25]);
  const labelY    = useSpring(rawLabelY, { stiffness: 60, damping: 20 });
  const labelOp   = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.5]);

  // Heading
  const rawHeadY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [60, -35]);
  const headY    = useSpring(rawHeadY, { stiffness: 60, damping: 20 });
  const headOp   = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.5]);

  // Alternating card depths: even index = depth 1, odd = depth 1.6
  const depths = PROJECTS.map((_, i) => (i % 2 === 0 ? 1 : 1.6));

  return (
    <section
      id="projects"
      aria-label="Projects"
      ref={containerRef}
      className="section-wrapper py-28 px-6"
      style={{ maxWidth: '1100px', margin: '0 auto' }}
    >
      {/* Section label */}
      <motion.p className="section-label" style={{ y: labelY, opacity: labelOp }}>
        // 02 — Projects
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
        Selected work<span style={{ color: 'var(--accent)' }}>.</span>
      </motion.h2>

      {/* Card grid */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
        }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.name}
            project={project}
            scrollYProgress={scrollYProgress}
            depth={depths[i]}
            shouldReduce={shouldReduce}
          />
        ))}
      </div>
    </section>
  );
}

