// Chairlift running up the left edge of the mountain.
// A visible cable, support towers, and chairs (each with a seated skier) that
// scroll smoothly with the camera as camY changes. SVG + derived geometry only.
import { VIEW_H } from '../../config/freeRideSettings'

export default function Chairlift({ screenX = 40, camY = 0, nightMode = false }) {
  const cable   = nightMode ? '#64748b' : '#1e293b'
  const towerC  = nightMode ? '#475569' : '#334155'
  const towerHi = nightMode ? '#64748b' : '#64748b'
  const chairBar = nightMode ? '#94a3b8' : '#475569'
  const seat    = nightMode ? '#334155' : '#64748b'
  const skierBody = nightMode ? '#2563eb' : '#3b82f6'
  const skierHead = nightMode ? '#fbbf24' : '#fcd34d'

  // --- chairs: spaced down the cable, scrolling up as the camera moves down ---
  const spacing = 150
  const chairOffset = ((camY * 0.6) % spacing + spacing) % spacing
  const chairs = []
  for (let i = -1; i < Math.ceil(VIEW_H / spacing) + 1; i++) {
    const y = i * spacing - chairOffset
    chairs.push(
      <g key={`c${i}`} transform={`translate(${screenX}, ${y})`}>
        {/* hanger from cable to chair */}
        <line x1="0" y1="-14" x2="0" y2="-2" stroke={chairBar} strokeWidth="1.5" />
        {/* back rest */}
        <rect x="-9" y="-4" width="18" height="4" rx="1.5" fill={seat} />
        {/* seat */}
        <rect x="-9" y="2" width="18" height="4" rx="1.5" fill={seat} />
        {/* foot bar */}
        <line x1="-7" y1="9" x2="7" y2="9" stroke={chairBar} strokeWidth="1.5" />
        {/* seated skier */}
        <circle cx="0" cy="-7" r="3" fill={skierHead} />
        <rect x="-4" y="-4" width="8" height="7" rx="2" fill={skierBody} />
        {/* dangling skis */}
        <line x1="-3" y1="9" x2="-3" y2="13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="9" x2="3" y2="13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      </g>
    )
  }

  // --- towers: planted at fixed WORLD positions, so they scroll with the slope ---
  const towerSpacing = 300
  const towerOffset = ((camY) % towerSpacing + towerSpacing) % towerSpacing
  const towers = []
  for (let i = -1; i < Math.ceil(VIEW_H / towerSpacing) + 1; i++) {
    const y = i * towerSpacing - towerOffset
    towers.push(
      <g key={`t${i}`}>
        {/* pole */}
        <rect x={screenX - 2.5} y={y} width="5" height="34" rx="1.5" fill={towerC} />
        {/* cross-arm holding the cable */}
        <rect x={screenX - 13} y={y - 3} width="26" height="4" rx="2" fill={towerHi} />
        {/* sheave wheels at the arm ends */}
        <circle cx={screenX - 11} cy={y - 1} r="2.5" fill={cable} />
        <circle cx={screenX + 11} cy={y - 1} r="2.5" fill={cable} />
        {/* small snow cap on top */}
        <ellipse cx={screenX} cy={y - 1} rx="6" ry="2" fill="#ffffff" opacity={nightMode ? 0.25 : 0.6} />
      </g>
    )
  }

  return (
    <svg className="absolute top-0 left-0 pointer-events-none" style={{ width: 90, height: VIEW_H, overflow: 'visible' }}>
      {/* shadow of the cable on the snow */}
      <line x1={screenX + 4} y1="0" x2={screenX + 4} y2={VIEW_H} stroke="#000000" strokeWidth="1.5" opacity={nightMode ? 0.12 : 0.08} />
      {/* the cable */}
      <line x1={screenX} y1="0" x2={screenX} y2={VIEW_H} stroke={cable} strokeWidth="2.5" />
      {towers}
      {chairs}
    </svg>
  )
}
