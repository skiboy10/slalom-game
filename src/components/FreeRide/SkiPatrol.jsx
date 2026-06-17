// Ski patrol rescuer — red jacket with a bold white cross (the key read).
// States: 'cruise' (skiing, tilts by lean), 'warn' (waving + "Slow down!" bubble),
// 'rescue' (stopped/hunched with a red-cross medic pack + 🚑 marker, pulsing cross).
// Lightweight: inline SVG + CSS animations only, no per-frame JS, no Math.random.
export default function SkiPatrol({ screenX, screenY, state = 'cruise', lean = 0, nightMode = false }) {
  const isWarn = state === 'warn'
  const isRescue = state === 'rescue'

  // Only tilt while cruising; warn/rescue stand upright.
  const tilt = state === 'cruise' ? lean * 16 : 0
  const opacity = nightMode ? 0.9 : 1

  // Slight dimming overlay for night mode (keeps the red/white readable but cooler).
  const nightFilter = nightMode ? 'brightness(0.82) saturate(0.92)' : 'none'

  // Cross pulse only in rescue state.
  const crossClass = isRescue ? 'patrol-cross-pulse' : ''
  // Waving arm only in warn state.
  const armClass = isWarn ? 'patrol-arm-wave' : ''

  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        transform: 'translate(-50%, -50%)',
        width: 50,
        height: 54,
        pointerEvents: 'none',
        opacity,
      }}
    >
      <style>{`
        @keyframes patrolCrossPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.12); }
        }
        @keyframes patrolArmWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-22deg); }
        }
        @keyframes patrolBubblePop {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-2px); }
        }
        .patrol-cross-pulse { animation: patrolCrossPulse 1.4s ease-in-out infinite; transform-origin: center; }
        .patrol-arm-wave { animation: patrolArmWave 0.7s ease-in-out infinite; transform-origin: 33px 26px; }
        .patrol-bubble { animation: patrolBubblePop 1.1s ease-in-out infinite; }
      `}</style>

      {/* Warning speech bubble (warn state only) */}
      {isWarn && (
        <div
          className="patrol-bubble"
          style={{
            position: 'absolute',
            left: '50%',
            top: -20,
            transform: 'translateX(-50%)',
            background: '#fde047',
            color: '#7c2d12',
            fontSize: 9,
            fontWeight: 800,
            padding: '3px 7px',
            borderRadius: 8,
            whiteSpace: 'nowrap',
            border: '1.5px solid #f59e0b',
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
            lineHeight: 1,
          }}
        >
          {'⚠️'} Slow down!
          {/* little tail pointing down at the patroller */}
          <span
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -5,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '5px solid #fde047',
            }}
          />
        </div>
      )}

      {/* Rescue marker badge (rescue state only) */}
      {isRescue && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -16,
            transform: 'translateX(-50%)',
            background: '#fff',
            border: '1.5px solid #dc2626',
            borderRadius: 8,
            padding: '1px 5px',
            fontSize: 11,
            lineHeight: 1.1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
          }}
        >
          {'🚑'}
        </div>
      )}

      <svg
        viewBox="0 0 50 54"
        width="50"
        height="54"
        style={{ overflow: 'visible', filter: nightFilter }}
      >
        {/* shadow on snow */}
        <ellipse cx="25" cy="50" rx="14" ry="3.5" fill="rgba(0,0,0,0.16)" />

        <g transform={`rotate(${tilt} 25 30)`}>
          {/* SKIS — splayed/stopped in rescue, parallel otherwise */}
          {isRescue ? (
            <>
              <rect x="9" y="44" width="4" height="9" rx="2" fill="#1f2937" transform="rotate(-14 11 48)" />
              <rect x="37" y="44" width="4" height="9" rx="2" fill="#1f2937" transform="rotate(14 39 48)" />
            </>
          ) : (
            <>
              <rect x="14" y="44" width="4" height="9" rx="2" fill="#1f2937" />
              <rect x="32" y="44" width="4" height="9" rx="2" fill="#1f2937" />
            </>
          )}

          {/* BOOTS */}
          <rect x="14" y="40" width="6" height="6" rx="1.5" fill="#111827" />
          <rect x="30" y="40" width="6" height="6" rx="1.5" fill="#111827" />

          {/* LEGS (dark snow pants) */}
          <rect x="15" y="30" width="6" height="12" rx="2.5" fill="#1e293b" />
          <rect x="29" y="30" width="6" height="12" rx="2.5" fill="#1e293b" />

          {/* MEDIC BACKPACK (rescue only) — peeks behind the torso */}
          {isRescue && (
            <g>
              <rect x="11" y="18" width="8" height="14" rx="2.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.8" />
              <rect x="14" y="22" width="2" height="7" fill="#fff" />
              <rect x="11.5" y="24.5" width="7" height="2" fill="#fff" />
            </g>
          )}

          {/* TORSO — red patrol jacket */}
          <path
            d="M16 19 Q15 16 18 14 L32 14 Q35 16 34 19 L34 38 Q34 41 31 41 L19 41 Q16 41 16 38 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="0.8"
          />
          {/* jacket zipper highlight */}
          <rect x="24.4" y="15" width="1.2" height="25" fill="#b91c1c" opacity="0.8" />

          {/* BOLD WHITE CROSS — the key read */}
          <g className={crossClass}>
            <rect x="23" y="20" width="4" height="15" rx="0.8" fill="#fff" />
            <rect x="18" y="25" width="14" height="4" rx="0.8" fill="#fff" />
          </g>

          {/* LEFT ARM — tucked (relaxed) */}
          <rect x="11" y="20" width="5" height="13" rx="2.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.6" />
          <circle cx="13.5" cy="34" r="2.4" fill="#1f2937" />

          {/* RIGHT ARM — raised & waving in warn, tucked otherwise */}
          {isWarn ? (
            <g className={armClass}>
              {/* upper + forearm raised up to the side */}
              <rect x="33" y="9" width="5" height="14" rx="2.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.6" />
              <circle cx="35.5" cy="8" r="2.8" fill="#f1c27d" stroke="#c77b48" strokeWidth="0.5" />
            </g>
          ) : (
            <g>
              <rect x="34" y="20" width="5" height="13" rx="2.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.6" />
              <circle cx="36.5" cy="34" r="2.4" fill="#1f2937" />
            </g>
          )}

          {/* HEAD — friendly face + red patrol helmet/beanie */}
          <g>
            <circle cx="25" cy="9" r="6.5" fill="#f1c27d" />
            {/* helmet cap */}
            <path d="M18 8 a7 7 0 0 1 14 0 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.6" />
            {/* small white cross on the helmet for extra read */}
            <rect x="24.2" y="3.2" width="1.6" height="4.2" fill="#fff" />
            <rect x="22.6" y="4.6" width="4.8" height="1.6" fill="#fff" />
            {/* goggles */}
            <rect x="20.5" y="8.5" width="9" height="3.2" rx="1.6" fill="#1f2937" opacity="0.85" />
            {/* friendly smile */}
            <path d="M22 13.5 Q25 16 28 13.5" fill="none" stroke="#7c4a2d" strokeWidth="0.9" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  )
}
