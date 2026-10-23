/**
 * CyberArt — inline SVG art used instead of the template's PNG renders.
 *   HeroEmblem — layered CSS-3D shield: extruded body, floating keyhole, orbit rings in 3D space
 *   ShieldIcon, GamepadIcon, LockIcon, KeycapIcon — About-section corner decorations
 * Depth comes from stacking flat SVG layers along the Z axis; no WebGL, no external assets.
 * Monochrome palette: shading is done with greys only, no glows.
 */
import { Tilt } from './primitives';

const SHIELD = 'M200 62 L318 112 L318 214 C318 284 266 330 200 356 C134 330 82 284 82 214 L82 112 Z';
const SIDE_LAYERS = 16;
const SIDE_STEP = 5;
const PERSP = 1100;

/**
 * One full-size SVG layer at a given depth. Layers behind the face are scaled up
 * to cancel perspective shrink, so the stack reads as a solid extrusion.
 */
function Layer({ z, className, style, children }) {
  const scale = z < 0 ? 1 - z / PERSP : 1;
  return (
    <svg viewBox="0 0 400 400" className={`he-layer ${className ?? ''}`} style={{ transform: `translateZ(${z}px) scale(${scale})`, ...style }}>
      {children}
    </svg>
  );
}

export function HeroEmblem({ className }) {
  return (
    <div className={`hero-emblem ${className ?? ''}`} aria-hidden="true">
      {/* Shared gradients/filters, referenced by every layer below */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="he-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E1E1E" />
            <stop offset="100%" stopColor="#0B0B0B" />
          </linearGradient>
          <linearGradient id="he-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F2F2F2" />
            <stop offset="100%" stopColor="#5A5A5A" />
          </linearGradient>
        </defs>
      </svg>

      <Tilt global max={36} perspective={PERSP} className="he-stage">
        <div className="he-sway">
          {/* Orbit rings — tilted planes that cut through the shield */}
          <div className="he-orbit he-orbit--a">
            <svg viewBox="0 0 400 400" className="he-layer">
              <g className="he-ring he-ring--a">
                <circle cx="200" cy="200" r="185" fill="none" stroke="#EDEDED" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 8" />
                <circle cx="200" cy="15" r="4" fill="#EDEDED" />
              </g>
            </svg>
          </div>
          <div className="he-orbit he-orbit--b">
            <svg viewBox="0 0 400 400" className="he-layer">
              <g className="he-ring he-ring--b">
                <circle cx="200" cy="200" r="168" fill="none" stroke="#EDEDED" strokeOpacity="0.12" strokeWidth="1" />
                <circle cx="368" cy="200" r="3" fill="#8C8C8C" />
              </g>
            </svg>
          </div>

          {/* Shield body — stacked slices form the side walls */}
          {Array.from({ length: SIDE_LAYERS }, (_, i) => (
            <Layer key={i} z={-(SIDE_LAYERS - i) * SIDE_STEP} style={{ filter: `brightness(${0.2 + (i / SIDE_LAYERS) * 0.45})` }}>
              <path d={SHIELD} fill="url(#he-edge)" stroke="url(#he-edge)" strokeWidth="4" />
            </Layer>
          ))}

          {/* Shield face */}
          <Layer z={0}>
            <path d={SHIELD} fill="url(#he-face)" stroke="url(#he-edge)" strokeWidth="2" />
          </Layer>

          {/* Inner bevel + circuit traces, raised off the face */}
          <Layer z={10}>
            <path d="M200 86 L296 127 L296 212 C296 268 255 306 200 330 C145 306 104 268 104 212 L104 127 Z"
              fill="none" stroke="#EDEDED" strokeOpacity="0.12" strokeWidth="1" />
            <g stroke="#EDEDED" strokeOpacity="0.3" strokeWidth="1" fill="none">
              <path d="M130 150 H160 L172 162" />
              <path d="M270 150 H240 L228 162" />
              <path d="M130 250 H158 L170 238" />
              <path d="M270 250 H242 L230 238" />
            </g>
            <g fill="#EDEDED" fillOpacity="0.5">
              <circle cx="130" cy="150" r="3" /><circle cx="270" cy="150" r="3" />
              <circle cx="130" cy="250" r="3" /><circle cx="270" cy="250" r="3" />
            </g>
          </Layer>


          {/* Keyhole — floats furthest forward, with its own short extrusion */}
          {[34, 37, 40].map((z, i) => (
            <Layer key={z} z={z}>
              <g fill={i < 2 ? '#5A5A5A' : '#EDEDED'}>
                <circle cx="200" cy="186" r="22" />
                <path d="M190 196 L210 196 L216 246 L184 246 Z" />
              </g>
              {i === 2 && <circle cx="200" cy="186" r="9" fill="#0B0B0B" />}
            </Layer>
          ))}
        </div>
      </Tilt>
    </div>
  );
}

const SHADOW = { filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.7))' };

export function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={SHADOW} aria-hidden="true">
      <defs>
        <linearGradient id="si-f" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2F2F2" /><stop offset="100%" stopColor="#8C8C8C" />
        </linearGradient>
      </defs>
      <path d="M60 14 L98 30 V62 C98 84 82 100 60 108 C38 100 22 84 22 62 V30 Z" fill="url(#si-f)" />
      <path d="M44 60 L56 72 L78 48" fill="none" stroke="#0C0C0C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GamepadIcon({ className }) {
  return (
    <svg viewBox="0 0 140 100" className={className} style={SHADOW} aria-hidden="true">
      <defs>
        <linearGradient id="gp-f" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2F2F2" /><stop offset="100%" stopColor="#8C8C8C" />
        </linearGradient>
      </defs>
      <path d="M38 22 H102 C122 22 134 44 134 66 C134 84 122 92 112 86 L96 72 H44 L28 86 C18 92 6 84 6 66 C6 44 18 22 38 22 Z" fill="url(#gp-f)" />
      <rect x="30" y="42" width="24" height="8" rx="2" fill="#0C0C0C" />
      <rect x="38" y="34" width="8" height="24" rx="2" fill="#0C0C0C" />
      <circle cx="98" cy="38" r="5" fill="#0B0B0B" />
      <circle cx="110" cy="50" r="5" fill="#0B0B0B" />
      <circle cx="86" cy="50" r="5" fill="#0B0B0B" />
      <circle cx="98" cy="62" r="5" fill="#0B0B0B" />
    </svg>
  );
}

export function LockIcon({ className }) {
  return (
    <svg viewBox="0 0 110 130" className={className} style={SHADOW} aria-hidden="true">
      <defs>
        <linearGradient id="lk-f" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2F2F2" /><stop offset="100%" stopColor="#8C8C8C" />
        </linearGradient>
      </defs>
      <path d="M30 58 V40 C30 14 80 14 80 40 V58" fill="none" stroke="#6B6B6B" strokeWidth="11" strokeLinecap="round" />
      <rect x="16" y="56" width="78" height="64" rx="14" fill="url(#lk-f)" />
      <circle cx="55" cy="82" r="8" fill="#0C0C0C" />
      <rect x="51" y="84" width="8" height="18" rx="3" fill="#0C0C0C" />
    </svg>
  );
}

export function KeycapIcon({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={SHADOW} aria-hidden="true">
      <path d="M14 34 L60 12 L106 34 L106 82 L60 108 L14 82 Z" fill="#8C8C8C" />
      <path d="M14 34 L60 56 L60 108 L14 82 Z" fill="#6B6B6B" />
      <path d="M60 56 L106 34 L106 82 L60 108 Z" fill="#A8A8A8" />
      <path d="M14 34 L60 12 L106 34 L60 56 Z" fill="#EDEDED" />
      <text x="60" y="40" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="20" fontWeight="500" fill="#0B0B0B"
        transform="translate(0 -6) scale(1 0.85)">&gt;_</text>
    </svg>
  );
}
