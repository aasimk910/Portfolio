/**
 * CyberArt — inline SVG "3D" art used instead of the template's PNG renders.
 *   HeroEmblem — hex shield + keyhole with orbiting HUD rings
 *   ShieldIcon, GamepadIcon, LockIcon, KeycapIcon — About-section corner decorations
 * All shapes use gradients + drop-shadows to fake depth; no external assets.
 */

export function HeroEmblem({ className }) {
  return (
    <div className={`hero-emblem ${className ?? ''}`} aria-hidden="true">
      <svg viewBox="0 0 400 400" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="he-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1B2A24" />
            <stop offset="55%" stopColor="#0E1512" />
            <stop offset="100%" stopColor="#050807" />
          </linearGradient>
          <linearGradient id="he-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="50%" stopColor="#7621B0" />
            <stop offset="100%" stopColor="#B600A8" />
          </linearGradient>
          <linearGradient id="he-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7621B0" />
            <stop offset="100%" stopColor="#18011F" />
          </linearGradient>
          <radialGradient id="he-core" cx="0.5" cy="0.45" r="0.5">
            <stop offset="0%" stopColor="#B8FFE0" />
            <stop offset="40%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
          </radialGradient>
          <filter id="he-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        <g className="he-ring he-ring--a">
          <circle cx="200" cy="200" r="185" fill="none" stroke="#00FF88" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 10" />
          <circle cx="200" cy="15" r="5" fill="#00FF88" filter="url(#he-glow)" />
        </g>
        <g className="he-ring he-ring--b">
          <circle cx="200" cy="200" r="160" fill="none" stroke="#B600A8" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="60 20 4 20" />
          <circle cx="360" cy="200" r="4" fill="#B600A8" filter="url(#he-glow)" />
        </g>

        {/* Shield extrusion (side) */}
        <path d="M200 62 L318 112 L318 214 C318 284 266 330 200 356 C134 330 82 284 82 214 L82 112 Z"
          transform="translate(0 14)" fill="url(#he-side)" />
        {/* Shield face */}
        <path d="M200 62 L318 112 L318 214 C318 284 266 330 200 356 C134 330 82 284 82 214 L82 112 Z"
          fill="url(#he-face)" stroke="url(#he-edge)" strokeWidth="4" filter="url(#he-glow)" />
        {/* Inner bevel */}
        <path d="M200 86 L296 127 L296 212 C296 268 255 306 200 330 C145 306 104 268 104 212 L104 127 Z"
          fill="none" stroke="#00FF88" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* Circuit traces */}
        <g stroke="#00FF88" strokeOpacity="0.45" strokeWidth="1.5" fill="none">
          <path d="M130 150 H160 L172 162" />
          <path d="M270 150 H240 L228 162" />
          <path d="M130 250 H158 L170 238" />
          <path d="M270 250 H242 L230 238" />
        </g>
        <g fill="#00FF88">
          <circle cx="130" cy="150" r="3" /><circle cx="270" cy="150" r="3" />
          <circle cx="130" cy="250" r="3" /><circle cx="270" cy="250" r="3" />
        </g>

        {/* Core glow + keyhole */}
        <circle cx="200" cy="200" r="70" fill="url(#he-core)" opacity="0.35" className="he-pulse" />
        <circle cx="200" cy="186" r="22" fill="#00FF88" filter="url(#he-glow)" />
        <path d="M190 196 L210 196 L216 246 L184 246 Z" fill="#00FF88" filter="url(#he-glow)" />
        <circle cx="200" cy="186" r="9" fill="#0E1512" />
      </svg>
    </div>
  );
}

const glow = (c) => ({ filter: `drop-shadow(0 0 18px ${c}66) drop-shadow(0 12px 24px #000)` });

export function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={glow('#00FF88')} aria-hidden="true">
      <defs>
        <linearGradient id="si-f" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5BFFB5" /><stop offset="100%" stopColor="#00894A" />
        </linearGradient>
      </defs>
      <path d="M60 14 L98 30 V62 C98 84 82 100 60 108 C38 100 22 84 22 62 V30 Z" transform="translate(4 6)" fill="#003D21" />
      <path d="M60 14 L98 30 V62 C98 84 82 100 60 108 C38 100 22 84 22 62 V30 Z" fill="url(#si-f)" />
      <path d="M44 60 L56 72 L78 48" fill="none" stroke="#0C0C0C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GamepadIcon({ className }) {
  return (
    <svg viewBox="0 0 140 100" className={className} style={glow('#B600A8')} aria-hidden="true">
      <defs>
        <linearGradient id="gp-f" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D04BFF" /><stop offset="100%" stopColor="#5A0F86" />
        </linearGradient>
      </defs>
      <path d="M38 22 H102 C122 22 134 44 134 66 C134 84 122 92 112 86 L96 72 H44 L28 86 C18 92 6 84 6 66 C6 44 18 22 38 22 Z" transform="translate(3 6)" fill="#2A0640" />
      <path d="M38 22 H102 C122 22 134 44 134 66 C134 84 122 92 112 86 L96 72 H44 L28 86 C18 92 6 84 6 66 C6 44 18 22 38 22 Z" fill="url(#gp-f)" />
      <rect x="30" y="42" width="24" height="8" rx="2" fill="#0C0C0C" />
      <rect x="38" y="34" width="8" height="24" rx="2" fill="#0C0C0C" />
      <circle cx="98" cy="38" r="5" fill="#00FF88" />
      <circle cx="110" cy="50" r="5" fill="#FF2442" />
      <circle cx="86" cy="50" r="5" fill="#FFD84A" />
      <circle cx="98" cy="62" r="5" fill="#4AB8FF" />
    </svg>
  );
}

export function LockIcon({ className }) {
  return (
    <svg viewBox="0 0 110 130" className={className} style={glow('#BE4C00')} aria-hidden="true">
      <defs>
        <linearGradient id="lk-f" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9A4A" /><stop offset="100%" stopColor="#8A2A00" />
        </linearGradient>
      </defs>
      <path d="M30 58 V40 C30 14 80 14 80 40 V58" fill="none" stroke="#C9D3DA" strokeWidth="11" strokeLinecap="round" />
      <rect x="16" y="56" width="78" height="64" rx="14" transform="translate(4 6)" fill="#3E1300" />
      <rect x="16" y="56" width="78" height="64" rx="14" fill="url(#lk-f)" />
      <circle cx="55" cy="82" r="8" fill="#0C0C0C" />
      <rect x="51" y="84" width="8" height="18" rx="3" fill="#0C0C0C" />
    </svg>
  );
}

export function KeycapIcon({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={glow('#00FF88')} aria-hidden="true">
      <path d="M14 34 L60 12 L106 34 L106 82 L60 108 L14 82 Z" fill="#141A17" />
      <path d="M14 34 L60 56 L60 108 L14 82 Z" fill="#0A0F0C" />
      <path d="M60 56 L106 34 L106 82 L60 108 Z" fill="#1E2823" />
      <path d="M14 34 L60 12 L106 34 L60 56 Z" fill="#2B3A33" stroke="#00FF88" strokeWidth="2" />
      <text x="60" y="40" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="20" fontWeight="500" fill="#00FF88"
        transform="translate(0 -6) scale(1 0.85)">&gt;_</text>
    </svg>
  );
}
