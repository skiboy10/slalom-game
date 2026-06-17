// One other skier cruising the mountain, seen from above/behind.
// Lightweight inline SVG — ~10 of these render every frame, so keep it cheap
// (no per-frame JS/timers; all motion comes from transforms derived from props).

const SKIN_TONES = ['#f1c27d', '#e0ac69', '#c68642', '#ffdbac']
// Deterministic per-skier look, keyed off the jacket color so a crowd doesn't
// look identical. Cached at module scope so we don't re-hash/allocate every frame
// (position changes re-render all instances at ~60fps).
const varietyCache = {}
function getSkierVariety(color) {
  if (varietyCache[color]) return varietyCache[color]
  let hash = 7
  for (let i = 0; i < color.length; i++) {
    hash = (hash * 31 + color.charCodeAt(i)) >>> 0
  }
  const helmetHue = hash % 360
  const variety = {
    skin: SKIN_TONES[hash % SKIN_TONES.length],
    hasPoles: (hash >> 3) % 4 !== 0, // ~75% carry poles
    helmet: `hsl(${helmetHue}, 55%, 42%)`,
    helmetShine: `hsl(${helmetHue}, 60%, 62%)`,
  }
  varietyCache[color] = variety
  return variety
}

export default function NPCSkier({ screenX, screenY, color = '#3b82f6', lean = 0, fallen = false, nightMode = false }) {
  const { skin, hasPoles, helmet, helmetShine } = getSkierVariety(color)

  // --- Pose ---
  const tilt = fallen ? 78 : lean * 22        // lean tilts whole body + skis
  const skew = fallen ? 0 : lean * -10        // skis fan out as they carve
  const armSwing = fallen ? 0 : lean * 10
  const opacity = nightMode ? 0.9 : 1
  const outline = nightMode ? '#0b1220' : '#1f2937'

  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        // Static centering transform only — keeps position rock-steady while
        // the camera scrolls; the tilt is animated on the <svg> below.
        transform: 'translate(-50%, -50%)',
        width: 36,
        height: 50,
        pointerEvents: 'none',
        opacity,
      }}
    >
      <svg
        viewBox="0 0 36 50"
        width="36"
        height="50"
        style={{
          overflow: 'visible',
          transform: `rotate(${tilt}deg)`,
          transformOrigin: '50% 50%',
          transition: 'transform 0.12s ease-out',
        }}
      >
        {/* soft shadow on the snow */}
        <ellipse cx="18" cy="44" rx="11" ry="3" fill="rgba(0,0,0,0.16)" />

        {/* skis (fan out slightly with lean) */}
        <g transform={`skewX(${skew})`}>
          <rect x="9" y="30" width="3.4" height="16" rx="1.7" fill="#111827" />
          <rect x="9.4" y="31" width="2.6" height="13" rx="1.3" fill={helmet} opacity="0.55" />
          <rect x="23.6" y="30" width="3.4" height="16" rx="1.7" fill="#111827" />
          <rect x="24" y="31" width="2.6" height="13" rx="1.3" fill={helmet} opacity="0.55" />
        </g>

        {/* poles (optional, behind the body) */}
        {hasPoles && (
          <g stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round">
            <line x1="7" y1="22" x2={4 - armSwing} y2="40" />
            <line x1="29" y1="22" x2={32 + armSwing} y2="40" />
          </g>
        )}

        {/* arms */}
        <g fill={color} stroke={outline} strokeWidth="0.5">
          <path d={`M11 22 Q ${7 - armSwing} 26 ${8 - armSwing} 32 L ${11 - armSwing} 32 Q ${11} 27 13 24 Z`} />
          <path d={`M25 22 Q ${29 + armSwing} 26 ${28 + armSwing} 32 L ${25 + armSwing} 32 Q ${25} 27 23 24 Z`} />
        </g>

        {/* jacket / torso (uses color) */}
        <path
          d="M11 18 Q11 13 18 13 Q25 13 25 18 L25 28 Q25 31 18 31 Q11 31 11 28 Z"
          fill={color}
          stroke={outline}
          strokeWidth="0.7"
        />
        {/* zipper / shading down the back */}
        <line x1="18" y1="14" x2="18" y2="30" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />

        {/* neck */}
        <rect x="15.5" y="9.5" width="5" height="4" rx="1.5" fill={skin} />

        {/* head + helmet (variety in helmet hue) */}
        <circle cx="18" cy="8" r="6" fill={helmet} stroke={outline} strokeWidth="0.7" />
        <ellipse cx="15.5" cy="5.5" rx="2.4" ry="1.6" fill={helmetShine} opacity="0.6" />
        {/* peek of face below the helmet (seen from behind/above) */}
        <path d="M13.5 9.5 Q18 13 22.5 9.5 Q18 11.5 13.5 9.5 Z" fill={skin} />

        {/* fallen: little stars above the wiped-out skier */}
        {fallen && (
          <text x="18" y="0" fontSize="9" textAnchor="middle">💫</text>
        )}
      </svg>
    </div>
  )
}
