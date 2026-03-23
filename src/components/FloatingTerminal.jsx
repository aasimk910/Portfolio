/**
 * FloatingTerminal — a draggable, minimizable terminal window fixed to the
 * bottom-left corner. Displays a scrolling fake "threat feed" log in real time.
 * Cybersecurity aesthetic: dark glass, green mono text, blinking cursor.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const LOG_LINES = [
  '> Booting dev environment...',
  '> [OK] Node.js v20.11.0 detected',
  '> [OK] Python 3.12 detected',
  '> [INFO] Loading MERN stack modules...',
  '> [OK] React 18 — ready',
  '> [INFO] Studying: Network Security fundamentals',
  '> [OK] Lab: Burp Suite intercepting traffic',
  '> [INFO] CTF practice session started',
  '> [WARN] Challenge difficulty: MEDIUM — persisting',
  '> [OK] Git commit pushed — streak maintained',
  '> [INFO] Reading: OWASP Top 10 2025',
  '> [OK] MongoDB connection established',
  '> [INFO] Building Travel-Buddy API endpoints...',
  '> [OK] REST API tests passing (4/4)',
  '> [INFO] Nmap scan — lab environment only',
  '> [WARN] Coffee level: LOW — refilling',
  '> [OK] Portfolio deployed successfully',
  '> [INFO] Status: Learning · Building · Growing',
];

const INTERVAL_MS = 1800;
const MAX_VISIBLE  = 7;

export default function FloatingTerminal() {
  const shouldReduce = useReducedMotion();
  const [lines, setLines]       = useState([LOG_LINES[0]]);
  const [minimised, setMinimised] = useState(false);
  const [lineIdx, setLineIdx]   = useState(1);
  const bodyRef = useRef(null);

  // Feed new log lines on an interval
  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => {
      setLineIdx((prev) => {
        const next = (prev + 1) % LOG_LINES.length;
        setLines((l) => [...l.slice(-MAX_VISIBLE + 1), LOG_LINES[next]]);
        return next;
      });
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduce]);

  // Auto-scroll body to bottom when new line arrives
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <motion.div
      className="floating-terminal"
      aria-label="Live threat feed terminal"
      drag
      dragMomentum={false}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.5, ease: 'easeOut' }}
      style={{ position: 'fixed', bottom: '5rem', left: '1.5rem', zIndex: 50, width: '320px' }}
    >
      {/* Title bar */}
      <div className="ft-titlebar">
        {/* Traffic-light dots */}
        <div className="ft-dots" aria-hidden="true">
          <span className="ft-dot ft-dot--close"    onClick={() => setMinimised(!minimised)} title="Minimise" />
          <span className="ft-dot ft-dot--minimise" />
          <span className="ft-dot ft-dot--expand"   />
        </div>
        <span className="ft-title">threat_feed.sh</span>
        <button
          className="ft-toggle"
          onClick={() => setMinimised((m) => !m)}
          aria-label={minimised ? 'Expand terminal' : 'Minimise terminal'}
        >
          {minimised ? '▲' : '▼'}
        </button>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {!minimised && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="ft-body" ref={bodyRef}>
              {lines.map((line, i) => {
                const isAlert   = line.includes('[ALERT]');
                const isWarn    = line.includes('[WARN]');
                const isOk      = line.includes('[OK]');
                const color = isAlert
                  ? 'var(--warning)'
                  : isWarn
                  ? '#FFB547'
                  : isOk
                  ? 'var(--accent)'
                  : 'rgba(232,234,230,0.65)';
                return (
                  <motion.p
                    key={`${i}-${line}`}
                    className="ft-line"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color }}
                  >
                    {line}
                  </motion.p>
                );
              })}
              {/* Blinking cursor at bottom */}
              <span className="cursor-blink" style={{ fontSize: '0.7rem' }} aria-hidden="true">█</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
