/**
 * SlalomGate
 *
 * Props:
 *  x         - inner pole X position (screen coords)
 *  outerX    - outer pole X (optional, for GS two-pole rendering)
 *  openStart - left edge of the gate opening (screen X)
 *  openEnd   - right edge of the gate opening (screen X)
 *  y         - vertical position (scrolling, in screen coords)
 *  side      - 'left' | 'right'
 *  hit       - bool
 *  hitTime   - timestamp when hit
 *  discipline - 'sl' | 'gs'
 */
export default function SlalomGate({ x, outerX, y, side, hit, hitTime, discipline = 'sl' }) {
  const isLeft = side === 'left'
  const poleColor = isLeft ? '#1d4ed8' : '#dc2626'
  const poleColorLight = isLeft ? '#3b82f6' : '#ef4444'
  const panelFill = isLeft ? '#bfdbfe' : '#fecaca'

  const timeSinceHit = hit ? Date.now() - hitTime : 0
  const bendPhase = Math.min(timeSinceHit / 250, 1)

  let bendAngle = 0
  if (hit) {
    if (bendPhase < 0.3) {
      bendAngle = (bendPhase / 0.3) * (isLeft ? -45 : 45)
    } else if (bendPhase < 0.5) {
      bendAngle = isLeft ? -45 : 45
    } else {
      const returnPhase = (bendPhase - 0.5) / 0.5
      const overshoot = Math.sin(returnPhase * Math.PI * 2) * (1 - returnPhase) * 10
      bendAngle = (isLeft ? -45 : 45) * (1 - returnPhase) + overshoot
    }
  }

  if (discipline === 'gs') {
    // Giant Slalom: two poles connected by a wide banner
    // x = inner pole, outerX = outer pole
    // Compute relative positions for the SVG viewBox (centered on inner pole)
    const outerRelX = outerX !== undefined ? (outerX - x) : (isLeft ? -65 : 65)
    const bannerLeft = Math.min(0, outerRelX) - 3
    const bannerRight = Math.max(0, outerRelX) + 3
    const bannerWidth = bannerRight - bannerLeft

    return (
      <svg
        style={{
          position: 'absolute',
          top: y,
          left: x,
          transform: 'translate(-50%, -100%)',
          overflow: 'visible',
          width: 10,  // nominal — overflow: visible handles the rest
          height: 90,
        }}
        viewBox="-5 -82 10 90"
      >
        {/* Shadow under both poles */}
        <ellipse cx="0" cy="6" rx="8" ry="3" fill="rgba(0,0,0,0.1)" />
        <ellipse cx={outerRelX} cy="6" rx="8" ry="3" fill="rgba(0,0,0,0.1)" />

        {/* Inner pole base */}
        <ellipse cx="0" cy="1" rx="6" ry="2.5" fill="#6b7280" />
        <rect x="-2.5" y="-4" width="5" height="5" rx="1" fill="#374151" />

        {/* Outer pole base */}
        <ellipse cx={outerRelX} cy="1" rx="6" ry="2.5" fill="#6b7280" />
        <rect x={outerRelX - 2.5} y="-4" width="5" height="5" rx="1" fill="#374151" />

        {/* Banner connecting both poles */}
        <g style={{ transformOrigin: '0px -60px', transform: `rotate(${bendAngle * 0.3}deg)` }}>
          <rect x={bannerLeft} y="-74" width={bannerWidth} height="22" rx="2" fill={poleColorLight} />
          <rect x={bannerLeft + 1} y="-73" width={bannerWidth - 2} height="20" rx="1" fill={panelFill} />
          {/* Diagonal stripes */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={bannerLeft + 2 + i * 12}
              y1="-73"
              x2={bannerLeft + i * 12}
              y2="-53"
              stroke={poleColorLight}
              strokeWidth="2"
              opacity="0.4"
            />
          ))}
        </g>

        {/* Inner pole (bends on hit) */}
        <g style={{ transformOrigin: '0px -2px', transform: `rotate(${bendAngle}deg)` }}>
          <rect x="-2.5" y="-75" width="5" height="73" rx="2.5" fill={poleColor} />
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x="-2.5" y={-75 + i * 18} width="5" height="7" fill="white" opacity="0.9" />
          ))}
        </g>

        {/* Outer pole (slight bend) */}
        <g style={{ transformOrigin: `${outerRelX}px -2px`, transform: `rotate(${bendAngle * 0.4}deg)` }}>
          <rect x={outerRelX - 2.5} y="-75" width="5" height="73" rx="2.5" fill={poleColor} />
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={outerRelX - 2.5} y={-75 + i * 18} width="5" height="7" fill="white" opacity="0.9" />
          ))}
        </g>
      </svg>
    )
  }

  // Default: Slalom — single pole with flag panel
  return (
    <svg
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -100%)',
        overflow: 'visible',
        width: 80,
        height: 85,
      }}
      viewBox="-40 -80 80 85"
    >
      <ellipse cx={bendAngle * 0.2} cy={6} rx={12} ry={4} fill="rgba(0,0,0,0.15)" />

      <g>
        <ellipse cx="0" cy="1" rx="8" ry="3" fill="#6b7280" />
        <rect x="-3" y="-5" width="6" height="6" rx="1" fill="#374151" />
      </g>

      <g style={{ transformOrigin: '0px -2px', transform: `rotate(${bendAngle}deg)` }}>
        <rect x="-2.5" y="-75" width="5" height="73" rx="2.5" fill={poleColor} />
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x="-2.5" y={-75 + i * 18} width="5" height="7" fill="white" opacity="0.9" />
        ))}

        {/* Flag panel — on the inside of the gate (toward center) */}
        <g transform={`translate(${isLeft ? 4 : -28}, -70)`}>
          <rect x="0" y="0" width="24" height="16" rx="2" fill={poleColorLight} />
          <rect x="1" y="1" width="22" height="14" rx="1" fill={panelFill} />
        </g>
      </g>
    </svg>
  )
}
