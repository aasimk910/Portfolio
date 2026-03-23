/**
 * FloatingBinaryRain — two narrow columns of falling 0/1 characters on the
 * far left and far right edges of the viewport. Very subtle (low opacity)
 * so it doesn't distract from content. Rendered purely in React/CSS — no canvas.
 *
 * Each column is a fixed-position strip; characters cycle through random
 * binary digits on a staggered interval, creating a "data rain" feel.
 */
import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const ROWS   = 28;
const COLS_L = 3;   // columns on the left strip
const COLS_R = 3;   // columns on the right strip

/** Generate a 2-D array of random '0'/'1' strings */
function makeGrid(cols, rows) {
  return Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => (Math.random() > 0.5 ? '1' : '0'))
  );
}

/** Single strip — positioned fixed on one side */
function BinaryStrip({ side }) {
  const shouldReduce = useReducedMotion();
  const COLS = side === 'left' ? COLS_L : COLS_R;
  const [grid, setGrid] = useState(() => makeGrid(COLS, ROWS));
  const frameRef = useRef(null);
  const lastRef  = useRef(0);

  useEffect(() => {
    if (shouldReduce) return;

    function tick(ts) {
      if (ts - lastRef.current > 120) {
        lastRef.current = ts;
        setGrid((prev) =>
          prev.map((col) =>
            col.map((cell) => (Math.random() < 0.18 ? (cell === '0' ? '1' : '0') : cell))
          )
        );
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [shouldReduce]);

  const posStyle =
    side === 'left'
      ? { left: 0, top: 0, bottom: 0 }
      : { right: 0, top: 0, bottom: 0 };

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        ...posStyle,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '4px',
        gap: '2px',
        opacity: 0.07,
      }}
    >
      {grid.map((col, ci) => (
        <div
          key={ci}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          {col.map((bit, ri) => (
            <span
              key={ri}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                lineHeight: 1,
                color: bit === '1' ? 'var(--accent)' : 'var(--muted)',
                transition: 'color 200ms ease, opacity 200ms ease',
                opacity: bit === '1' ? 1 : 0.45,
              }}
            >
              {bit}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function FloatingBinaryRain() {
  return (
    <>
      <BinaryStrip side="left"  />
      <BinaryStrip side="right" />
    </>
  );
}
