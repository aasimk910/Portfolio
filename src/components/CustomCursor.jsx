/**
 * CustomCursor — replaces the default OS cursor with a green "+" crosshair.
 * Uses a JS position-update loop with 80ms lag to create the trailing feel.
 * Hidden on touch/coarse-pointer devices via CSS.
 */
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  // Actual mouse position
  const mousePos  = useRef({ x: -100, y: -100 });
  // Rendered (lagged) position
  const renderPos = useRef({ x: -100, y: -100 });
  const rafId     = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Lerp the rendered position toward the real mouse position each frame
    const lerp = (a, b, t) => a + (b - a) * t;
    const LAG = 0.18; // lower = more lag

    const loop = () => {
      renderPos.current.x = lerp(renderPos.current.x, mousePos.current.x, LAG);
      renderPos.current.y = lerp(renderPos.current.y, mousePos.current.y, LAG);

      if (cursorRef.current) {
        cursorRef.current.style.left = `${renderPos.current.x}px`;
        cursorRef.current.style.top  = `${renderPos.current.y}px`;
      }
      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
    >
      +
    </div>
  );
}
