// Cozy A-frame mountain lodge: snowy roof, glowing windows, smoking chimney.
// Pure SVG with <animate> for smoke (no JS timers). Day + night variants.
export default function Lodge({ screenX, screenY, nightMode = false }) {
  const wall      = nightMode ? '#6b3318' : '#a0522d'
  const wallDark  = nightMode ? '#522612' : '#8a461f'
  const roof      = nightMode ? '#2e1c0c' : '#5d3a1a'
  const roofTrim  = nightMode ? '#3b2410' : '#704321'
  const snow      = nightMode ? '#cdd9f0' : '#ffffff'
  const windowGlow = nightMode ? '#fde68a' : '#fcd34d'
  const windowFrame = nightMode ? '#3b2410' : '#5d3a1a'
  const door      = nightMode ? '#3b2410' : '#4a2d12'
  const smoke     = nightMode ? '#94a3b8' : '#e5e7eb'

  return (
    <div style={{ position: 'absolute', left: screenX, top: screenY, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
      <svg viewBox="0 0 130 100" width="130" height="100">
        <defs>
          {nightMode && (
            <radialGradient id="lodgeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {/* warm glow halo at night */}
        {nightMode && <ellipse cx="65" cy="60" rx="58" ry="42" fill="url(#lodgeGlow)" />}

        {/* ground shadow */}
        <ellipse cx="65" cy="92" rx="50" ry="7" fill="#000000" opacity={nightMode ? 0.22 : 0.12} />

        {/* chimney smoke */}
        <g opacity="0.6">
          <circle cx="92" cy="16" r="5" fill={smoke}>
            <animate attributeName="cy" values="16;-6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="r" values="4;7" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="94" cy="22" r="4" fill={smoke}>
            <animate attributeName="cy" values="22;2" dur="3s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;6" dur="3s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="3s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="91" cy="20" r="3.5" fill={smoke}>
            <animate attributeName="cy" values="20;0" dur="3s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="3s" begin="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* chimney */}
        <rect x="86" y="24" width="11" height="20" fill={roofTrim} />
        <rect x="84" y="22" width="15" height="5" rx="1.5" fill={snow} opacity={nightMode ? 0.7 : 1} />

        {/* lodge body */}
        <rect x="22" y="46" width="86" height="44" fill={wall} />
        {/* shaded right wall for depth */}
        <rect x="88" y="46" width="20" height="44" fill={wallDark} opacity="0.6" />
        {/* log seams */}
        <line x1="22" y1="58" x2="108" y2="58" stroke={wallDark} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="70" x2="108" y2="70" stroke={wallDark} strokeWidth="1" opacity="0.5" />

        {/* steep A-frame roof */}
        <polygon points="14,50 65,16 116,50" fill={roof} />
        {/* roof trim line */}
        <polygon points="14,50 65,16 116,50" fill="none" stroke={roofTrim} strokeWidth="1.5" />
        {/* snow blanket on roof */}
        <polygon points="14,50 65,16 116,50 110,50 65,22 20,50" fill={snow} opacity={nightMode ? 0.55 : 0.85} />
        {/* roof eaves snow lumps */}
        <ellipse cx="20" cy="50" rx="8" ry="3" fill={snow} opacity={nightMode ? 0.5 : 0.85} />
        <ellipse cx="110" cy="50" rx="8" ry="3" fill={snow} opacity={nightMode ? 0.5 : 0.85} />

        {/* door */}
        <rect x="57" y="66" width="16" height="24" rx="1.5" fill={door} />
        <circle cx="69" cy="78" r="1.3" fill={windowGlow} />

        {/* glowing windows with frames */}
        <g>
          <rect x="31" y="56" width="16" height="14" rx="1.5" fill={windowFrame} />
          <rect x="33" y="58" width="12" height="10" fill={windowGlow} />
          <line x1="39" y1="58" x2="39" y2="68" stroke={windowFrame} strokeWidth="1" />
          <line x1="33" y1="63" x2="45" y2="63" stroke={windowFrame} strokeWidth="1" />
        </g>
        <g>
          <rect x="83" y="56" width="16" height="14" rx="1.5" fill={windowFrame} />
          <rect x="85" y="58" width="12" height="10" fill={windowGlow} />
          <line x1="91" y1="58" x2="91" y2="68" stroke={windowFrame} strokeWidth="1" />
          <line x1="85" y1="63" x2="97" y2="63" stroke={windowFrame} strokeWidth="1" />
        </g>
      </svg>
    </div>
  )
}
