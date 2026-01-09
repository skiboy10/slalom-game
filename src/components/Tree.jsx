export default function Tree({ x, y, size, flipped }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${flipped ? -size : size}, ${size})`}>
      <ellipse cx="0" cy="40" rx="10" ry="3" fill="rgba(0,0,0,0.1)" />
      <rect x="-2" y="25" width="4" height="12" fill="#5D4037" />
      <polygon points="0,-18 -15,8 15,8" fill="#2E7D32" />
      <polygon points="0,-18 -11,4 11,4" fill="white" opacity="0.35" />
      <polygon points="0,-2 -18,22 18,22" fill="#388E3C" />
      <polygon points="0,-2 -13,16 13,16" fill="white" opacity="0.25" />
      <polygon points="0,12 -20,35 20,35" fill="#43A047" />
    </g>
  )
}
