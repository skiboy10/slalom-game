import { SKIER_Y } from '../config/gameSettings'

export default function Skier({ lean, x, speed = 2.5, frame = 0 }) {
  const bodyTilt = lean * 24
  const hipShift = lean * 5
  const armBalance = lean * 20
  const bob = Math.sin(frame * 0.7) * Math.min(2.6, speed * 0.4)
  const edgeGlow = Math.min(0.65, Math.abs(lean) * 0.5 + speed * 0.04)

  return (
    <svg
      style={{
        position: 'absolute',
        top: SKIER_Y + bob,
        left: x,
        transform: 'translateX(-50%)',
        overflow: 'visible',
        width: 78,
        height: 92,
      }}
      viewBox="-40 -70 80 92"
    >
      <defs>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD2A8" />
          <stop offset="100%" stopColor="#D99E71" />
        </linearGradient>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      {/* Dynamic shadow */}
      <ellipse
        cx={lean * 3}
        cy="14"
        rx={16 + Math.abs(lean) * 4 + speed * 0.4}
        ry={4.4 + speed * 0.1}
        fill="rgba(0,0,0,0.22)"
      />

      <g transform={`rotate(${bodyTilt})`}>
        <g transform={`skewX(${lean * -9})`}>
          <rect x="-30" y="4" width="52" height="4" rx="2" fill="#0f172a" />
          <rect x="4" y="4" width="52" height="4" rx="2" fill="#0f172a" />
          <rect x="-30" y="3" width="52" height="1" fill={`rgba(56,189,248,${edgeGlow})`} />
          <rect x="4" y="3" width="52" height="1" fill={`rgba(56,189,248,${edgeGlow})`} />
        </g>

        <rect x="-8" y="-9" width="7" height="11" rx="2" fill="#334155" />
        <rect x="1" y="-9" width="7" height="11" rx="2" fill="#334155" />

        <g transform={`translate(${hipShift * 0.6}, 0)`}>
          <rect x="-7" y="-24" width="6" height="16" rx="2" fill="url(#pantsGrad)" />
          <rect x="1" y="-24" width="6" height="16" rx="2" fill="url(#pantsGrad)" />
        </g>

        <g transform={`translate(${hipShift}, -32)`}>
          <path
            d="M -9 17 Q -11 8 -7 0 Q -4 -7 0 -9 Q 4 -7 7 0 Q 11 8 9 17 Q 4 19 0 19 Q -4 19 -9 17 Z"
            fill="url(#suitGrad)"
          />
          <rect x="-5.5" y="1" width="11" height="11" rx="1" fill="white" />
          <text x="0" y="9.4" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#111827" fontFamily="Arial">42</text>
        </g>

        <g transform={`translate(-8, -39) rotate(${-35 + armBalance})`}>
          <rect x="-2" y="0" width="4" height="11" rx="2" fill="url(#suitGrad)" />
          <line x1="0" y1="10" x2="6" y2="46" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="6" cy="43" r="3" fill="none" stroke="#64748b" strokeWidth="1" />
        </g>
        <g transform={`translate(8, -39) rotate(${35 + armBalance})`}>
          <rect x="-2" y="0" width="4" height="11" rx="2" fill="url(#suitGrad)" />
          <line x1="0" y1="10" x2="-6" y2="46" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="-6" cy="43" r="3" fill="none" stroke="#64748b" strokeWidth="1" />
        </g>

        <g transform={`translate(${hipShift * 0.2}, -47)`}>
          <ellipse cx="0" cy="0" rx="8" ry="7" fill="url(#helmetGrad)" />
          <path d="M -7 1 Q -8 -1 -6 -3 Q 0 -5 6 -3 Q 8 -1 7 1 Q 6 3 0 4 Q -6 3 -7 1 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
        </g>
      </g>
    </svg>
  )
}
