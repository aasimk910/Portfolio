/**
 * FloatingStatusHUD — fixed bottom-right HUD badge.
 * Shows system status, threat level, and uptime ticker.
 * The threat level randomly "bumps" to ELEVATED occasionally
 * then returns to LOW — keeps it feeling alive.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const THREAT_SEQUENCE = [
  { level: 'LEARNING', color: 'var(--accent)',  delay: 0     },
  { level: 'BUILDING', color: 'var(--accent)',  delay: 10000 },
  { level: 'GRINDING', color: '#FFB547',        delay: 22000 },
  { level: 'LEARNING', color: 'var(--accent)',  delay: 30000 },
  { level: 'SHIPPING',  color: '#FFB547',       delay: 44000 },
  { level: 'LEARNING', color: 'var(--accent)',  delay: 52000 },
];

function useUptime() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function FloatingStatusHUD() {
  const shouldReduce = useReducedMotion();
  const uptime = useUptime();
  const [threatIdx, setThreatIdx] = useState(0);

  useEffect(() => {
    if (shouldReduce) return;
    const timers = THREAT_SEQUENCE.slice(1).map(({ delay }, i) =>
      setTimeout(() => setThreatIdx(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [shouldReduce]);

  const threat = THREAT_SEQUENCE[threatIdx] ?? THREAT_SEQUENCE[0];

  return (
    <motion.aside
      className="status-hud"
      aria-label="System status HUD"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Pulsing dot */}
      <span
        className="hud-pulse-dot"
        style={{ background: threat.color }}
        aria-hidden="true"
      />

      <div className="hud-rows">
        {/* Threat level */}
        <div className="hud-row">
          <span className="hud-key">THREAT</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={threat.level}
              className="hud-val"
              style={{ color: threat.color }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
            >
              {threat.level}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* System status */}
        <div className="hud-row">
          <span className="hud-key">SYS</span>
          <span className="hud-val" style={{ color: 'var(--accent)' }}>ACTIVE</span>
        </div>

        {/* Uptime */}
        <div className="hud-row">
          <span className="hud-key">UPTIME</span>
          <span className="hud-val" style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
            {uptime}
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
