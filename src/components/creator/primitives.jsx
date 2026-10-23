/**
 * Reusable primitives for the 3D-creator layout:
 *   FadeIn        — whileInView fade/slide wrapper
 *   Magnet        — mouse-following magnetic hover
 *   AnimatedText  — char-by-char scroll-driven reveal
 *   ContactButton — RGB gradient pill (gamer glow)
 *   GhostButton   — outline pill
 */
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1];

export function FadeIn({ as = 'div', delay = 0, duration = 0.7, x = 0, y = 30, className, style, children, ...rest }) {
  const shouldReduce = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: EASE }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Magnet({ padding = 150, strength = 3, className, children }) {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX > r.left - padding && e.clientX < r.right + padding &&
        e.clientY > r.top - padding && e.clientY < r.bottom + padding;

      if (inside) {
        const dx = (e.clientX - (r.left + r.width / 2)) / strength;
        const dy = (e.clientY - (r.top + r.height / 2)) / strength;
        el.style.transition = 'transform 0.3s ease-out';
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      } else {
        el.style.transition = 'transform 0.6s ease-in-out';
        el.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [padding, strength, shouldReduce]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

function Char({ char, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="opacity-0">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export function AnimatedText({ text, className, style }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const chars = text.split('');

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      <span aria-hidden="true">
        {chars.map((c, i) => (
          <Char
            key={i}
            char={c}
            progress={scrollYProgress}
            range={[i / chars.length, (i + 1) / chars.length]}
          />
        ))}
      </span>
    </p>
  );
}

export function ContactButton({ href = '#contact', label = 'Contact Me', ...rest }) {
  return (
    <a href={href} className="contact-btn" {...rest}>
      {label}
    </a>
  );
}

export function GhostButton({ href, label, ...rest }) {
  return (
    <a href={href} className="ghost-btn" target="_blank" rel="noopener noreferrer" {...rest}>
      {label}
    </a>
  );
}
