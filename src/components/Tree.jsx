export default function Tree({ x, y, size, flipped, nightMode = false }) {
  const trunk = nightMode ? '#2a1a0a' : '#5D4037'
  const dark  = nightMode ? '#0f2818' : '#2E7D32'
  const mid   = nightMode ? '#163821' : '#388E3C'
  const light = nightMode ? '#1a4028' : '#43A047'
  const snowOp = nightMode ? 0.12 : 0.25

  return (
    <g transform={`translate(${x}, ${y}) scale(${flipped ? -size : size}, ${size})`}>
      <ellipse cx="0" cy="40" rx="10" ry="3" fill="rgba(0,0,0,0.1)" />
      <rect x="-2" y="25" width="4" height="12" fill={trunk} />
      <polygon points="0,-18 -15,8 15,8" fill={dark} />
      <polygon points="0,-18 -11,4 11,4" fill="white" opacity={nightMode ? 0.15 : 0.35} />
      <polygon points="0,-2 -18,22 18,22" fill={mid} />
      <polygon points="0,-2 -13,16 13,16" fill="white" opacity={snowOp} />
      <polygon points="0,12 -20,35 20,35" fill={light} />
    </g>
  )
}
