import { SKIER_Y } from '../config/gameSettings'

/**
 * GhostSkier — semi-transparent replay silhouette of the player's personal best run.
 * Renders a simple cyan-tinted skier outline at the given x position and lean angle.
 */
export default function GhostSkier({ x, lean = 0, opacity = 0.3 }) {
  const bodyTilt = lean * 22

  return (
    <div
      style={{
        position: 'absolute',
        top: SKIER_Y,
        left: x,
        transform: 'translateX(-50%)',
        width: 80,
        height: 90,
        pointerEvents: 'none',
        opacity,
      }}
    >
      {/* "PB" label above ghost */}
      <div
        style={{
          position: 'absolute',
          top: -18,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9,
          fontWeight: 800,
          color: '#22d3ee',
          textShadow: '0 0 4px rgba(34,211,238,0.6)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
        }}
      >
        PB
      </div>

      <svg
        style={{ width: 80, height: 90, overflow: 'visible' }}
        viewBox="-40 -75 80 90"
      >
        <defs>
          <linearGradient id="ghostBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        {/* Shadow on snow */}
        <ellipse cx={lean * 3} cy="12" rx={14} ry="3" fill="rgba(34,211,238,0.15)" />

        <g transform={`rotate(${bodyTilt})`}>
          {/* Skis — simple rectangles */}
          <g transform={`skewX(${lean * -8})`}>
            <rect x="-28" y="2" width="56" height="4" rx="2" fill="#0891b2" opacity="0.7" />
          </g>

          {/* Boots */}
          <rect x="-8" y="-12" width="6" height="12" rx="2" fill="#0891b2" opacity="0.6" />
          <rect x="2" y="-12" width="6" height="12" rx="2" fill="#0891b2" opacity="0.6" />

          {/* Legs */}
          <rect x="-7" y="-26" width="6" height="16" rx="2" fill="url(#ghostBody)" opacity="0.5" />
          <rect x="1" y="-26" width="6" height="16" rx="2" fill="url(#ghostBody)" opacity="0.5" />

          {/* Torso */}
          <path
            d="M -9 -18 Q -12 -28 -8 -36 Q -4 -42 0 -44 Q 4 -42 8 -36 Q 12 -28 9 -18 Q 5 -16 0 -16 Q -5 -16 -9 -18 Z"
            fill="url(#ghostBody)"
            opacity="0.6"
          />

          {/* Arms + poles */}
          <line x1="-10" y1="-38" x2="-22" y2="-10" stroke="#22d3ee" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
          <line x1="10" y1="-38" x2="22" y2="-10" stroke="#22d3ee" strokeWidth="2" opacity="0.5" strokeLinecap="round" />

          {/* Poles */}
          <line x1="-22" y1="-10" x2="-18" y2="40" stroke="#67e8f9" strokeWidth="1.2" opacity="0.4" />
          <line x1="22" y1="-10" x2="18" y2="40" stroke="#67e8f9" strokeWidth="1.2" opacity="0.4" />

          {/* Head / helmet */}
          <ellipse cx="0" cy="-50" rx="8" ry="7" fill="#22d3ee" opacity="0.6" />

          {/* Goggles band */}
          <path
            d="M -7 -51 Q 0 -54 7 -51 Q 7 -48 0 -47 Q -7 -48 -7 -51 Z"
            fill="#0e7490"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  )
}
