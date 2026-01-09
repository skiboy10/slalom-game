import { SKIER_Y } from '../config/gameSettings'

export default function Skier({ lean, x }) {
  const bodyTilt = lean * 25
  const hipShift = lean * 4
  const armBalance = lean * 18

  return (
    <svg
      style={{
        position: 'absolute',
        top: SKIER_Y,
        left: x,
        transform: `translateX(-50%)`,
        overflow: 'visible',
        width: 70,
        height: 80,
      }}
      viewBox="-35 -65 70 80"
    >
      <defs>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDBF94" />
          <stop offset="100%" stopColor="#E8A878" />
        </linearGradient>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      <ellipse cx={lean * 2} cy="10" rx={14 + Math.abs(lean) * 2} ry="4" fill="rgba(0,0,0,0.2)" />

      <g transform={`rotate(${bodyTilt})`}>
        {/* Skis */}
        <g transform={`skewX(${lean * -10})`}>
          <rect x="-28" y="2" width="48" height="4" rx="2" fill="#1f2937" />
          <rect x="4" y="2" width="48" height="4" rx="2" fill="#1f2937" />
        </g>

        {/* Boots */}
        <rect x="-8" y="-8" width="7" height="10" rx="2" fill="#374151" />
        <rect x="1" y="-8" width="7" height="10" rx="2" fill="#374151" />

        {/* Legs */}
        <g transform={`translate(${hipShift * 0.5}, 0)`}>
          <rect x="-7" y="-22" width="6" height="16" rx="2" fill="url(#pantsGrad)" />
          <rect x="1" y="-22" width="6" height="16" rx="2" fill="url(#pantsGrad)" />
        </g>

        {/* Torso */}
        <g transform={`translate(${hipShift}, -28)`}>
          <path
            d="M -8 16 Q -10 8 -7 0 Q -4 -6 0 -8 Q 4 -6 7 0 Q 10 8 8 16 Q 4 18 0 18 Q -4 18 -8 16 Z"
            fill="url(#suitGrad)"
          />
          <rect x="-5" y="2" width="10" height="10" rx="1" fill="white" />
          <text x="0" y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#111" fontFamily="Arial">42</text>
        </g>

        {/* Arms/Poles */}
        <g transform={`translate(-8, -36) rotate(${-35 + armBalance})`}>
          <rect x="-2" y="0" width="4" height="10" rx="2" fill="url(#suitGrad)" />
          <line x1="0" y1="10" x2="6" y2="45" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="6" cy="42" r="3" fill="none" stroke="#666" strokeWidth="1" />
        </g>
        <g transform={`translate(8, -36) rotate(${35 + armBalance})`}>
          <rect x="-2" y="0" width="4" height="10" rx="2" fill="url(#suitGrad)" />
          <line x1="0" y1="10" x2="-6" y2="45" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="-6" cy="42" r="3" fill="none" stroke="#666" strokeWidth="1" />
        </g>

        {/* Head */}
        <g transform={`translate(${hipShift * 0.2}, -44)`}>
          <ellipse cx="0" cy="0" rx="8" ry="7" fill="url(#helmetGrad)" />
          <path d="M -7 1 Q -8 -1 -6 -3 Q 0 -5 6 -3 Q 8 -1 7 1 Q 6 3 0 4 Q -6 3 -7 1 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5" />
        </g>
      </g>
    </svg>
  )
}
