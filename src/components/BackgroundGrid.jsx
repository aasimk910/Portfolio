/**
 * BackgroundGrid — fixed SVG dot-matrix.
 * Parallax: the grid itself drifts upward slowly as you scroll down the page,
 * creating depth separation between it and the foreground content.
 */
import { useScroll, useTransform, useSpring, motion, useReducedMotion } from 'framer-motion';

export default function BackgroundGrid() {
  const shouldReduce = useReducedMotion();

  // Track total page scroll progress
  const { scrollYProgress } = useScroll();

  // Grid moves at 25% of the scroll speed → slow parallax drift
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [0, 0] : [0, -180]
  );
  const y = useSpring(yRaw, { stiffness: 40, damping: 18, mass: 1 });

  // Subtle opacity pulse synced to scroll position
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.04, 0.07, 0.04]
  );

  return (
    <motion.svg
      style={{ y, opacity }}
      className="bg-grid"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dot-grid"
          x="0" y="0"
          width="28" height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="#00FF88" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </motion.svg>
  );
}
