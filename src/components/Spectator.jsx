export default function Spectator({ x, y, data, cheering, globalCheerPhase }) {
  const cheerAmount = cheering ? Math.sin(globalCheerPhase + data.cheerOffset) * 0.5 + 0.5 : 0
  const armAngle = cheering ? -45 - cheerAmount * data.armRaise * 60 : -20
  const bodyBob = cheering ? Math.sin(globalCheerPhase * 2 + data.cheerOffset) * 2 : 0

  return (
    <g transform={`translate(${x + data.xOffset}, ${y + bodyBob}) scale(${data.height})`}>
      <ellipse cx="0" cy="32" rx="6" ry="2" fill="rgba(0,0,0,0.15)" />
      <rect x="-4" y="18" width="3" height="12" rx="1" fill="#1f2937" />
      <rect x="1" y="18" width="3" height="12" rx="1" fill="#1f2937" />
      <path
        d="M -6 5 Q -8 12 -6 18 L 6 18 Q 8 12 6 5 Q 3 2 0 2 Q -3 2 -6 5 Z"
        fill={data.jacketColor}
      />
      {data.hasScarf && (
        <ellipse cx="0" cy="3" rx="5" ry="2" fill={data.scarfColor} />
      )}
      <circle cx="0" cy="-2" r="5" fill="#FDBF94" />
      <circle cx="-1.5" cy="-3" r="0.8" fill="#1f2937" />
      <circle cx="1.5" cy="-3" r="0.8" fill="#1f2937" />
      {cheering ? (
        <ellipse cx="0" cy="1" rx="1.5" ry="1.5" fill="#1f2937" />
      ) : (
        <path d="M -1.5 1 Q 0 2 1.5 1" fill="none" stroke="#1f2937" strokeWidth="0.8" />
      )}
      {data.hasHat && (
        <>
          <ellipse cx="0" cy="-5" rx="6" ry="2" fill={data.hatColor} />
          <path d="M -5 -5 Q -5 -10 0 -11 Q 5 -10 5 -5" fill={data.hatColor} />
          <circle cx="0" cy="-12" r="2" fill="white" />
        </>
      )}
      <g transform={`rotate(${armAngle}, -6, 8)`}>
        <rect x="-9" y="6" width="4" height="10" rx="2" fill={data.jacketColor} />
      </g>
      <g transform={`rotate(${-armAngle}, 6, 8) scale(-1, 1)`}>
        <rect x="-9" y="6" width="4" height="10" rx="2" fill={data.jacketColor} />
      </g>
    </g>
  )
}
