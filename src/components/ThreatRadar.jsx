/**
 * ThreatRadar — animated radar sweep SVG.
 * Fixed top-right corner of the hero section area.
 * Rotating sweep line, concentric rings, random blip dots that appear
 * briefly as the sweep passes them.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const SIZE    = 120;
const CX      = SIZE / 2;
const R1      = SIZE * 0.38;
const R2      = SIZE * 0.25;
const R3      = SIZE * 0.12;

/** Static blip positions (polar) — converted to cartesian */
const BLIP_DEFS = [
  { angle: 35,  dist: 0.72 },
  { angle: 110, dist: 0.55 },
  { angle: 200, dist: 0.80 },
  { angle: 270, dist: 0.40 },
  { angle: 320, dist: 0.65 },
];

function polarToXY(angleDeg, normDist) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + Math.cos(rad) * normDist * R1,
    y: CX + Math.sin(rad) * normDist * R1,
  };
}

export default function ThreatRadar() {
  const shouldReduce = useReducedMotion();
  const sweepRef     = useRef(0); // current sweep angle in degrees
  const [sweepAngle, setSweepAngle] = useState(0);
  const [blips, setBlips] = useState(
    BLIP_DEFS.map((b) => ({ ...b, visible: false, ...polarToXY(b.angle, b.dist) }))
  );
  const rafRef = useRef(null);
  const lastTs = useRef(null);

  useEffect(() => {
    if (shouldReduce) return;

    function tick(ts) {
      if (!lastTs.current) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;

      sweepRef.current = (sweepRef.current + delta * 0.07) % 360;
      const sa = sweepRef.current;
      setSweepAngle(sa);

      // Show blip if sweep just passed its angle (within 6°)
      setBlips((prev) =>
        prev.map((b) => {
          const diff = ((sa - b.angle + 360) % 360);
          const justPassed = diff < 6;
          return { ...b, visible: justPassed ? true : b.visible && diff < 60 ? true : false };
        })
      );

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shouldReduce]);

  // Sweep line endpoint
  const sweepRad = (sweepAngle * Math.PI) / 180;
  const sx = CX + Math.cos(sweepRad) * R1;
  const sy = CX + Math.sin(sweepRad) * R1;

  return (
    <motion.div
      aria-hidden="true"
      className="threat-radar-wrap"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.8, duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: '5.5rem',
        right: '1.5rem',
        zIndex: 2,
        pointerEvents: 'none',
        width: SIZE,
        height: SIZE,
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial fade mask so edges are soft */}
          <radialGradient id="radar-mask" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="radar-fade">
            <rect width={SIZE} height={SIZE} fill="url(#radar-mask)" />
          </mask>
          {/* Sweep gradient — fades behind the line */}
          <radialGradient id="sweep-grad" cx={CX} cy={CX} r={R1} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="rgba(0,255,136,0.0)" />
            <stop offset="100%" stopColor="rgba(0,255,136,0.18)" />
          </radialGradient>
        </defs>

        <g mask="url(#radar-fade)">
          {/* Background circle fill */}
          <circle cx={CX} cy={CX} r={R1} fill="rgba(0,0,0,0.45)" />

          {/* Concentric rings */}
          {[R1, R2 * 1.52, R2, R3].map((r, i) => (
            <circle
              key={i}
              cx={CX}
              cy={CX}
              r={r}
              stroke="rgba(0,255,136,0.18)"
              strokeWidth="0.6"
            />
          ))}

          {/* Cross-hair lines */}
          <line x1={CX} y1={CX - R1} x2={CX} y2={CX + R1} stroke="rgba(0,255,136,0.12)" strokeWidth="0.5" />
          <line x1={CX - R1} y1={CX} x2={CX + R1} y2={CX} stroke="rgba(0,255,136,0.12)" strokeWidth="0.5" />

          {/* Sweep sector fill (trailing glow) */}
          {!shouldReduce && (
            <path
              d={`M ${CX} ${CX} L ${sx} ${sy} A ${R1} ${R1} 0 0 0 ${CX + Math.cos(sweepRad - 1.1) * R1} ${CX + Math.sin(sweepRad - 1.1) * R1} Z`}
              fill="rgba(0,255,136,0.06)"
            />
          )}

          {/* Sweep line */}
          {!shouldReduce && (
            <line
              x1={CX}
              y1={CX}
              x2={sx}
              y2={sy}
              stroke="rgba(0,255,136,0.75)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          )}

          {/* Blip dots */}
          {blips.map((b, i) =>
            b.visible ? (
              <circle
                key={i}
                cx={b.x}
                cy={b.y}
                r={2}
                fill="var(--warning)"
                opacity={0.85}
              />
            ) : null
          )}

          {/* Center dot */}
          <circle cx={CX} cy={CX} r={2.5} fill="rgba(0,255,136,0.6)" />
        </g>
      </svg>

      {/* Label below radar */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'rgba(0,255,136,0.45)',
          letterSpacing: '0.1em',
          textAlign: 'center',
          marginTop: '4px',
        }}
      >
        THREAT_RADAR
      </p>
    </motion.div>
  );
}
