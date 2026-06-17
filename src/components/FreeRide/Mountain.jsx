// The mountain terrain: snow, zones (forest/pond/jump), trees, lodge, chairlift.
// Renders the whole world relative to the camera (screen = world - cam).
import Tree from '../Tree'
import Lodge from './Lodge'
import Chairlift from './Chairlift'
import { ZONES, LODGE, LIFT_X, VIEW_W, VIEW_H } from '../../config/freeRideSettings'

export default function Mountain({ camX, camY, trees, nightMode = false }) {
  const slope = nightMode
    ? 'linear-gradient(180deg, #3b4a6b 0%, #314061 40%, #28344f 80%, #1c2740 100%)'
    : 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 45%, #dde5ee 80%, #cbd5e1 100%)'

  // Soft snow shading colors (used for grooming lines / corduroy)
  const groomLine = nightMode ? 'rgba(120,150,200,0.10)' : 'rgba(148,163,184,0.18)'
  const sheen = nightMode ? 'rgba(120,150,200,0.06)' : 'rgba(255,255,255,0.5)'

  const onScreen = (wx, wy, pad = 80) => {
    const sx = wx - camX, sy = wy - camY
    return sx > -pad && sx < VIEW_W + pad && sy > -pad && sy < VIEW_H + pad
  }

  // Vertical corduroy/grooming lines — derived from index (stable across frames).
  // We scroll them with the camera using a modulo so they tile the visible window.
  const groomSpacing = 46
  const groomScroll = ((camY * 0.5) % groomSpacing + groomSpacing) % groomSpacing
  const groomLines = []
  for (let i = -1; i <= Math.ceil(VIEW_H / groomSpacing) + 1; i++) {
    const gy = i * groomSpacing - groomScroll
    groomLines.push(
      <line key={`g${i}`} x1={0} y1={gy} x2={VIEW_W} y2={gy}
        stroke={groomLine} strokeWidth="1" />
    )
  }

  return (
    <>
      {/* base snow */}
      <div className="absolute inset-0" style={{ background: slope }} />

      {/* snow grooming / corduroy + gentle sheen */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="snowSheen" cx="50%" cy="22%" r="75%">
            <stop offset="0%" stopColor={sheen} />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="iceGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={nightMode ? 0.18 : 0.7} />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#snowSheen)" />
        {groomLines}
      </svg>

      {/* zone overlays */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {ZONES.map(z => {
          const sx = z.x - camX, sy = z.y - camY
          if (sy > VIEW_H + 40 || sy + z.h < -40) return null

          if (z.type === 'pond') {
            const cx = sx + z.w / 2
            const cy = sy + z.h / 2
            const rx = z.w / 2
            const ry = z.h / 2
            return (
              <g key={z.id}>
                {/* icy surface */}
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
                  fill={nightMode ? '#1e3a5f' : '#bae6fd'} opacity={nightMode ? 0.85 : 0.85}
                  stroke={nightMode ? '#3b6ea5' : '#7dd3fc'} strokeWidth="2.5" />
                {/* deeper inner tint */}
                <ellipse cx={cx} cy={cy} rx={rx * 0.82} ry={ry * 0.82}
                  fill={nightMode ? '#264a72' : '#7dd3fc'} opacity="0.35" />
                {/* glossy highlight streak */}
                <ellipse cx={cx - rx * 0.28} cy={cy - ry * 0.42} rx={rx * 0.5} ry={ry * 0.16}
                  fill="#ffffff" opacity={nightMode ? 0.22 : 0.7}
                  transform={`rotate(-18 ${cx - rx * 0.28} ${cy - ry * 0.42})`} />
                {/* small moon glint / sparkle */}
                <circle cx={cx + rx * 0.35} cy={cy + ry * 0.2} r="2.5"
                  fill="#ffffff" opacity={nightMode ? 0.55 : 0.85} />
              </g>
            )
          }

          if (z.type === 'jump') {
            // A built-up snow kicker ramp: a curved snow lip with a takeoff edge.
            const baseY = sy + z.h
            const lipH = 54
            const topY = baseY - lipH
            const lipColor = nightMode ? '#cdd9f0' : '#ffffff'
            const shadeColor = nightMode ? '#5b6b8c' : '#cbd5e1'
            return (
              <g key={z.id}>
                {/* cast shadow in front of the ramp */}
                <ellipse cx={sx + z.w / 2} cy={baseY + 6} rx={z.w / 2} ry="9"
                  fill="#000000" opacity={nightMode ? 0.18 : 0.1} />
                {/* ramp body (built-up snow, ramping up toward the takeoff) */}
                <path
                  d={`M ${sx} ${baseY}
                      Q ${sx + z.w * 0.55} ${baseY} ${sx + z.w * 0.8} ${topY + 8}
                      L ${sx + z.w} ${topY}
                      L ${sx + z.w} ${baseY} Z`}
                  fill={shadeColor} opacity={nightMode ? 0.9 : 0.95} />
                {/* snowy lit top surface */}
                <path
                  d={`M ${sx} ${baseY}
                      Q ${sx + z.w * 0.55} ${baseY - 4} ${sx + z.w * 0.8} ${topY + 6}
                      L ${sx + z.w} ${topY}
                      L ${sx + z.w * 0.8} ${topY + 2}
                      Q ${sx + z.w * 0.55} ${baseY - 10} ${sx} ${baseY - 6} Z`}
                  fill={lipColor} opacity={nightMode ? 0.85 : 0.95} />
                {/* crisp takeoff lip edge */}
                <line x1={sx + z.w} y1={topY} x2={sx + z.w} y2={topY + 14}
                  stroke={nightMode ? '#93c5fd' : '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" />
                {/* hint */}
                <text x={sx + z.w / 2} y={topY - 6} fontSize="18" textAnchor="middle">🚀</text>
              </g>
            )
          }

          if (z.type === 'forest') {
            // Subtle cool snow-shadow + faint evergreen dusting (NOT red/pink).
            return (
              <g key={z.id}>
                <rect x={sx} y={sy} width={z.w} height={z.h}
                  fill={nightMode ? '#1c3145' : '#c7d2dd'} opacity={nightMode ? 0.22 : 0.28} />
                {/* faint green dusting under the canopy */}
                <rect x={sx} y={sy} width={z.w} height={z.h}
                  fill={nightMode ? '#14532d' : '#86a98c'} opacity={nightMode ? 0.12 : 0.10} />
              </g>
            )
          }

          return null
        })}
      </svg>

      {/* chairlift on the left edge */}
      <Chairlift screenX={LIFT_X - camX} camY={camY} nightMode={nightMode} />

      {/* lodge landmark */}
      {onScreen(LODGE.x, LODGE.y, 120) && (
        <Lodge screenX={LODGE.x - camX} screenY={LODGE.y - camY} nightMode={nightMode} />
      )}

      {/* trees (forest zones) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        {trees.map(t => {
          if (!onScreen(t.worldX, t.worldY)) return null
          return <Tree key={t.id} x={t.worldX - camX} y={t.worldY - camY} size={t.size} flipped={t.flipped} nightMode={nightMode} />
        })}
      </svg>
    </>
  )
}
