export default function SlalomGate({ x, y, side, hit, hitTime }) {
  const isLeft = side === 'left'
  const poleColor = isLeft ? '#dc2626' : '#1d4ed8'
  const poleColorLight = isLeft ? '#ef4444' : '#3b82f6'

  const timeSinceHit = hit ? Date.now() - hitTime : 0
  const bendPhase = Math.min(timeSinceHit / 250, 1)

  let bendAngle = 0
  if (hit) {
    if (bendPhase < 0.3) {
      bendAngle = (bendPhase / 0.3) * (isLeft ? 50 : -50)
    } else if (bendPhase < 0.5) {
      bendAngle = isLeft ? 50 : -50
    } else {
      const returnPhase = (bendPhase - 0.5) / 0.5
      const overshoot = Math.sin(returnPhase * Math.PI * 2) * (1 - returnPhase) * 12
      bendAngle = (isLeft ? 50 : -50) * (1 - returnPhase) + overshoot
    }
  }

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

        <g transform={`translate(${isLeft ? 4 : -28}, -70)`}>
          <rect x="0" y="0" width="24" height="16" rx="2" fill={poleColorLight} />
          <rect x="1" y="1" width="22" height="14" rx="1" fill={isLeft ? '#fecaca' : '#bfdbfe'} />
        </g>
      </g>
    </svg>
  )
}
