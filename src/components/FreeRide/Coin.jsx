// A collectible gold coin scattered on the mountain.
// Cheap: tiny inline SVG + pure-CSS animation, no JS timers, no Math.random in render.

// Inject the keyframes once for ALL coins (many instances mount/unmount).
let coinStylesInjected = false
function ensureCoinStyles() {
  if (coinStylesInjected || typeof document === 'undefined') return
  coinStylesInjected = true
  const style = document.createElement('style')
  style.setAttribute('data-coin-styles', '')
  style.textContent = `
    @keyframes coinBob {
      0%, 100% { transform: translate(-50%, -50%) translateY(0); }
      50%      { transform: translate(-50%, -50%) translateY(-3px); }
    }
    @keyframes coinFlip {
      0%, 100% { transform: scaleX(1); }
      45%      { transform: scaleX(0.15); }
      55%      { transform: scaleX(0.15); }
    }
  `
  document.head.appendChild(style)
}

export default function Coin({ screenX, screenY }) {
  ensureCoinStyles()
  return (
    <div style={{
      position: 'absolute', left: screenX, top: screenY,
      width: 22, height: 22, pointerEvents: 'none',
      // Bob handles the centering transform so it can layer with the flip below.
      animation: 'coinBob 1.6s ease-in-out infinite',
      filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.7))',
    }}>
      <div style={{ animation: 'coinFlip 2.2s ease-in-out infinite' }}>
        <svg viewBox="0 0 22 22" width="22" height="22">
          <circle cx="11" cy="11" r="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          {/* lighter inner rim highlight */}
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="#fde68a" strokeWidth="1.5" />
          {/* soft top-left shine */}
          <ellipse cx="7.5" cy="7" rx="2.4" ry="1.4" fill="#fffbeb" opacity="0.8" />
          {/* coin emboss */}
          <text x="11" y="15" fontSize="10" textAnchor="middle" fill="#b45309" fontWeight="700">$</text>
        </svg>
      </div>
    </div>
  )
}
