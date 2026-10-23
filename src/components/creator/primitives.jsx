/**
 * Reusable primitives for the 3D-creator layout:
 *   FadeIn        — whileInView fade/slide wrapper
 *   Magnet        — mouse-following magnetic hover
 *   Tilt          — pointer-driven 3D tilt with optional glare
 *   Extrude       — stacks Z-offset copies of an SVG to give it thickness
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

/**
 * Tilt — pointer-driven 3D rotation. Children can sit at different depths with
 * `transform: translateZ(...)` because the element keeps `preserve-3d`.
 *   global — track the pointer across the whole window instead of only over the element
 *   glare  — moving light highlight (needs a positioned element with no ::after of its own)
 */
export function Tilt({ as = 'div', max = 12, perspective = 900, global = false, glare = false, className, style, children, ...rest }) {
  const Comp = as;
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldReduce || !window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    const set = (px, py) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${-py * max}deg`);
        el.style.setProperty('--ry', `${px * max}deg`);
        el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
        el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
      });
    };
    const clamp = (v) => Math.max(-0.5, Math.min(0.5, v));

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      if (global) {
        set(
          clamp((e.clientX - (r.left + r.width / 2)) / window.innerWidth),
          clamp((e.clientY - (r.top + r.height / 2)) / window.innerHeight),
        );
      } else {
        set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      }
    };
    const onLeave = () => set(0, 0);

    const target = global ? window : el;
    target.addEventListener('pointermove', onMove, { passive: true });
    if (!global) el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max, global, shouldReduce]);

  return (
    <Comp
      ref={ref}
      className={`tilt${glare ? ' tilt--glare' : ''} ${className ?? ''}`}
      style={{ '--persp': `${perspective}px`, ...style }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Extrude — gives a flat SVG real thickness by stacking darkened copies behind it
 * along the Z axis. Only the front copy is exposed to layout and keeps its glow.
 */
export function Extrude({ depth = 18, layers = 8, className, children }) {
  const step = depth / layers;
  return (
    <div className={`extrude ${className ?? ''}`}>
      {Array.from({ length: layers }, (_, i) => (
        <div
          key={i}
          className="extrude__layer"
          style={{ transform: `translateZ(${-(layers - i) * step}px)`, filter: `brightness(${0.18 + (i / layers) * 0.3})` }}
        >
          {children}
        </div>
      ))}
      <div className="extrude__front">{children}</div>
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
