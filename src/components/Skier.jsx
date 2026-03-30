import { SKIER_Y } from '../config/gameSettings'
import { darkenColor } from '../utils/colorUtils'

export default function Skier({ lean, x, style = {}, combo = 0 }) {
  const bodyTilt = lean * 22
  const hipShift = lean * 5
  const armBalance = lean * 20
  const kneeBend = 4 + Math.abs(lean) * 3

  // Custom colors with defaults
  const helmet = style.helmet || '#ef4444'
  const helmetDark = darkenColor(helmet, 40)
  const suit = style.suit || '#3b82f6'
  const suitDark = darkenColor(suit, 40)
  const goggles = style.goggles || '#fbbf24'
  const gogglesDark = darkenColor(goggles, 30)
  const skiAccent = style.skiAccent || '#ef4444'
  const bibNumber = style.bibNumber ?? 42

  // Combo glow tiers
  const isOnFire = combo >= 10 && combo < 20
  const isLegendary = combo >= 20

  // Glow class for the wrapper
  const glowClass = isLegendary ? 'skier-glow-legendary' : isOnFire ? 'skier-glow-fire' : ''

  return (
    <div
      className={glowClass}
      style={{
        position: 'absolute',
        top: SKIER_Y,
        left: x,
        transform: 'translateX(-50%)',
        width: 80,
        height: 90,
        pointerEvents: 'none',
      }}
    >
      {/* Sparkle particles for LEGENDARY combo */}
      {isLegendary && (
        <div className="skier-sparkle-container">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="skier-sparkle"
              style={{
                left: `${20 + Math.sin(i * 0.785) * 35}px`,
                top: `${30 + Math.cos(i * 0.785) * 30}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
    <svg
      style={{
        width: 80,
        height: 90,
        overflow: 'visible',
      }}
      viewBox="-40 -75 80 90"
    >
      <defs>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDBF94" />
          <stop offset="100%" stopColor="#D4956B" />
        </linearGradient>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={helmet} />
          <stop offset="100%" stopColor={helmetDark} />
        </linearGradient>
        <linearGradient id="goggleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={goggles} />
          <stop offset="60%" stopColor={gogglesDark} />
          <stop offset="100%" stopColor={gogglesDark} />
        </linearGradient>
        <linearGradient id="suitTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={suit} />
          <stop offset="100%" stopColor={suitDark} />
        </linearGradient>
        <linearGradient id="suitBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="skiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="50%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="poleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
      </defs>

      {/* Shadow on snow */}
      <ellipse cx={lean * 3} cy="12" rx={16 + Math.abs(lean) * 3} ry="4" fill="rgba(0,0,0,0.15)" />

      <g transform={`rotate(${bodyTilt})`}>

        {/* Two parallel skis */}
        <g transform={`skewX(${lean * -8})`}>
          {/* Left ski */}
          <g transform="translate(-5, 0)">
            <path d="M -24 -2 Q -26 -3 -25 -5 Q -23 -7 -21 -5 L -22 -2 L 22 -2 Q 24 -2 24 0 L 24 4 Q 24 6 22 6 L -22 6 Q -24 6 -25 4 Q -26 2 -24 -2 Z"
              fill="#1a1a2e" stroke="#111" strokeWidth="0.3" />
            <rect x="-18" y="-0.5" width="38" height="1.8" rx="0.5" fill={skiAccent} />
            <rect x="-18" y="1.8" width="38" height="0.8" rx="0.3" fill="#fbbf24" />
            <rect x="-6" y="-1.5" width="10" height="3.5" rx="0.8" fill={skiAccent} opacity="0.8" />
            <text x="-1" y="1" textAnchor="middle" fontSize="2.5" fontWeight="bold" fill="white" fontFamily="Arial">RACE</text>
            <path d="M -22 6 L 22 6" stroke="#c0c0c0" strokeWidth="0.7" />
            <path d="M 22 6 Q 25 6 25 4 Q 26 2 24 1 L 24 4 Z" fill="#1a1a2e" stroke="#111" strokeWidth="0.3" />
          </g>

          {/* Right ski */}
          <g transform="translate(5, 0)">
            <path d="M -24 -2 Q -26 -3 -25 -5 Q -23 -7 -21 -5 L -22 -2 L 22 -2 Q 24 -2 24 0 L 24 4 Q 24 6 22 6 L -22 6 Q -24 6 -25 4 Q -26 2 -24 -2 Z"
              fill="#1a1a2e" stroke="#111" strokeWidth="0.3" />
            <rect x="-18" y="-0.5" width="38" height="1.8" rx="0.5" fill={skiAccent} />
            <rect x="-18" y="1.8" width="38" height="0.8" rx="0.3" fill="#fbbf24" />
            <rect x="-6" y="-1.5" width="10" height="3.5" rx="0.8" fill={skiAccent} opacity="0.8" />
            <text x="-1" y="1" textAnchor="middle" fontSize="2.5" fontWeight="bold" fill="white" fontFamily="Arial">RACE</text>
            <path d="M -22 6 L 22 6" stroke="#c0c0c0" strokeWidth="0.7" />
            <path d="M 22 6 Q 25 6 25 4 Q 26 2 24 1 L 24 4 Z" fill="#1a1a2e" stroke="#111" strokeWidth="0.3" />
          </g>
        </g>

        {/* Bindings */}
        <g transform={`skewX(${lean * -8})`}>
          <g transform="translate(-5, 0)">
            <path d="M -4 -3 L -4 -7 Q -3 -8 -1 -8 L 2 -8 Q 4 -8 4 -7 L 4 -3 Z" fill="#374151" stroke="#222" strokeWidth="0.3" />
            <rect x="-3" y="-7.5" width="5" height="1.2" rx="0.4" fill="#555" />
            <rect x="-3" y="3" width="7" height="4" rx="1" fill="#374151" stroke="#222" strokeWidth="0.3" />
          </g>
          <g transform="translate(5, 0)">
            <path d="M -4 -3 L -4 -7 Q -3 -8 -1 -8 L 2 -8 Q 4 -8 4 -7 L 4 -3 Z" fill="#374151" stroke="#222" strokeWidth="0.3" />
            <rect x="-3" y="-7.5" width="5" height="1.2" rx="0.4" fill="#555" />
            <rect x="-3" y="3" width="7" height="4" rx="1" fill="#374151" stroke="#222" strokeWidth="0.3" />
          </g>
        </g>

        {/* Boots */}
        <path d="M -9 -3 L -9 -13 Q -9 -15 -7 -15 L -1 -15 Q 1 -15 1 -13 L 1 -3 Z"
          fill="#1f2937" stroke="#111" strokeWidth="0.5" />
        <path d="M 1 -3 L 1 -13 Q 1 -15 3 -15 L 9 -15 Q 11 -15 11 -13 L 11 -3 Z"
          fill="#1f2937" stroke="#111" strokeWidth="0.5" />
        <rect x="-8" y="-11" width="8" height="1.5" rx="0.5" fill="#9ca3af" />
        <rect x="2" y="-11" width="8" height="1.5" rx="0.5" fill="#9ca3af" />

        {/* Legs */}
        <g transform={`translate(${hipShift * 0.5}, 0)`}>
          <path d={`M -7 -14 Q -9 ${-14 - kneeBend} -6 ${-22 - kneeBend} L -1 ${-22 - kneeBend} Q 2 ${-14 - kneeBend} -1 -14 Z`}
            fill="url(#suitBottomGrad)" />
          <path d={`M 7 -14 Q 5 ${-14 - kneeBend} 8 ${-22 - kneeBend} L 13 ${-22 - kneeBend} Q 16 ${-14 - kneeBend} 13 -14 Z`}
            fill="url(#suitBottomGrad)" />
          <ellipse cx={-4} cy={-22 - kneeBend} rx="4" ry="2.5" fill="#374151" />
          <ellipse cx={10} cy={-22 - kneeBend} rx="4" ry="2.5" fill="#374151" />
        </g>

        {/* Torso */}
        <g transform={`translate(${hipShift}, ${-30 - kneeBend})`}>
          <path
            d="M -9 18 Q -12 10 -9 2 Q -6 -5 0 -8 Q 6 -5 9 2 Q 12 10 9 18 Q 5 20 0 20 Q -5 20 -9 18 Z"
            fill="url(#suitTopGrad)"
          />
          <path d="M -3 -6 L -4 20 L 4 20 L 3 -6 Z" fill="white" opacity="0.3" />
          <rect x="-7" y="2" width="14" height="12" rx="1" fill="white" />
          <rect x="-6" y="3" width="12" height="10" rx="0.5" fill="white" stroke="#e5e7eb" strokeWidth="0.3" />
          <text x="0" y="11" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#111" fontFamily="Arial">{bibNumber}</text>
          <rect x="-4" y="4" width="8" height="2" rx="0.5" fill={helmet} opacity="0.6" />
          <path d="M -4 -6 Q 0 -8 4 -6 Q 3 -4 0 -4 Q -3 -4 -4 -6 Z" fill={suitDark} />
        </g>

        {/* Left arm + pole */}
        <g transform={`translate(${-10 + hipShift}, ${-38 - kneeBend}) rotate(${-30 + armBalance})`}>
          <path d="M -2 0 Q -4 4 -3 8 L 3 8 Q 4 4 2 0 Z" fill="url(#suitTopGrad)" />
          <path d="M -3 8 Q -4 12 -2 16 L 4 16 Q 5 12 3 8 Z" fill="url(#suitTopGrad)" />
          <ellipse cx="1" cy="17" rx="3.5" ry="3" fill="#1f2937" />
          <line x1="1" y1="16" x2="8" y2="52" stroke="url(#poleGrad)" strokeWidth="1.8" />
          <circle cx="8" cy="48" r="4" fill="none" stroke="#9ca3af" strokeWidth="1" />
          <line x1="8" y1="48" x2="8" y2="52" stroke="#9ca3af" strokeWidth="1" />
          <rect x="-1" y="14" width="4" height="5" rx="1" fill="#111" />
        </g>

        {/* Right arm + pole */}
        <g transform={`translate(${10 + hipShift}, ${-38 - kneeBend}) rotate(${30 + armBalance})`}>
          <path d="M -2 0 Q -4 4 -3 8 L 3 8 Q 4 4 2 0 Z" fill="url(#suitTopGrad)" />
          <path d="M -3 8 Q -4 12 -2 16 L 4 16 Q 5 12 3 8 Z" fill="url(#suitTopGrad)" />
          <ellipse cx="-1" cy="17" rx="3.5" ry="3" fill="#1f2937" />
          <line x1="-1" y1="16" x2="-8" y2="52" stroke="url(#poleGrad)" strokeWidth="1.8" />
          <circle cx="-8" cy="48" r="4" fill="none" stroke="#9ca3af" strokeWidth="1" />
          <line x1="-8" y1="48" x2="-8" y2="52" stroke="#9ca3af" strokeWidth="1" />
          <rect x="-3" y="14" width="4" height="5" rx="1" fill="#111" />
        </g>

        {/* Head */}
        <g transform={`translate(${hipShift * 0.3}, ${-50 - kneeBend})`}>
          <rect x="-2.5" y="4" width="5" height="4" rx="1" fill="url(#skinGrad)" />
          <ellipse cx="0" cy="0" rx="9" ry="8" fill="url(#helmetGrad)" />
          <ellipse cx="-3" cy="-3" rx="4" ry="2.5" fill="white" opacity="0.2" />
          <rect x="-2" y="-7" width="4" height="1.5" rx="0.75" fill={helmetDark} />
          <path d="M -8 -1 Q -9 -3 -7 -4 Q 0 -6 7 -4 Q 9 -3 8 -1 Q 7 2 0 3 Q -7 2 -8 -1 Z"
            fill="url(#goggleGrad)" stroke="#92400e" strokeWidth="0.6" />
          <path d="M -5 -2 Q -3 -4 2 -3 Q 0 -1 -5 -2 Z" fill="white" opacity="0.4" />
          <path d="M -4 3 Q 0 6 4 3" fill="url(#skinGrad)" />
        </g>
      </g>
    </svg>
    </div>
  )
}
