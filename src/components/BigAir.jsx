import { useState, useEffect, useRef, useCallback } from 'react'
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameSettings'
import { darkenColor } from '../utils/colorUtils'

const BIG_AIR_DURATION = 3000 // 3 seconds
const MAX_BONUS_GATES = 5
const DEGREES_PER_BONUS = 360
const MAX_SPIN = MAX_BONUS_GATES * DEGREES_PER_BONUS // 1800

// Parabolic arc: skier launches from bottom, peaks at ~30% height, lands at bottom
function getArcPosition(progress) {
  // progress: 0 -> 1 over the duration
  // y follows an inverted parabola: peaks at progress=0.5
  const x = GAME_WIDTH / 2
  const groundY = GAME_HEIGHT - 100
  const peakY = 80 // top of the arc
  const arcHeight = groundY - peakY
  // Parabola: y = groundY - arcHeight * 4 * p * (1 - p)
  const y = groundY - arcHeight * 4 * progress * (1 - progress)
  return { x, y }
}

export default function BigAir({ skierStyle = {}, onComplete }) {
  const [spinDegrees, setSpinDegrees] = useState(0)
  const [progress, setProgress] = useState(0)
  const [lastInputSide, setLastInputSide] = useState(null)
  const [showBonus, setShowBonus] = useState(false)
  const [landed, setLanded] = useState(false)
  const [snowSpray, setSnowSpray] = useState([])

  const startTimeRef = useRef(null)
  const animFrameRef = useRef(null)
  const spinRef = useRef(0)
  const completedRef = useRef(false)
  const lastInputSideRef = useRef(null)

  // Colors from skier style
  const helmet = skierStyle.helmet || '#ef4444'
  const helmetDark = darkenColor(helmet, 40)
  const suit = skierStyle.suit || '#3b82f6'
  const suitDark = darkenColor(suit, 40)
  const goggles = skierStyle.goggles || '#fbbf24'
  const gogglesDark = darkenColor(goggles, 30)
  const skiAccent = skierStyle.skiAccent || '#ef4444'
  const bibNumber = skierStyle.bibNumber ?? 42

  // Calculate bonus gates from spin
  const bonusGates = Math.min(MAX_BONUS_GATES, Math.floor(spinRef.current / DEGREES_PER_BONUS))

  // Handle keyboard input for spinning
  const handleKeyDown = useCallback((e) => {
    if (completedRef.current) return
    if (e.repeat) return

    let addSpin = false

    if (e.key === ' ') {
      // Space bar mash: always adds spin
      addSpin = true
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      // Left input: must alternate with right
      if (lastInputSideRef.current !== 'left') {
        addSpin = true
        lastInputSideRef.current = 'left'
        setLastInputSide('left')
      }
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      // Right input: must alternate with left
      if (lastInputSideRef.current !== 'right') {
        addSpin = true
        lastInputSideRef.current = 'right'
        setLastInputSide('right')
      }
    }

    if (addSpin && spinRef.current < MAX_SPIN) {
      const increment = 45 // each valid input adds 45 degrees
      spinRef.current = Math.min(MAX_SPIN, spinRef.current + increment)
      setSpinDegrees(spinRef.current)
    }
  }, [])

  // Handle touch/click input for mobile
  const handleClick = useCallback((e) => {
    if (completedRef.current) return
    if (spinRef.current < MAX_SPIN) {
      spinRef.current = Math.min(MAX_SPIN, spinRef.current + 45)
      setSpinDegrees(spinRef.current)
    }
  }, [])

  // Register keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Main animation loop
  useEffect(() => {
    startTimeRef.current = Date.now()
    let completeTimeout = null

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const p = Math.min(1, elapsed / BIG_AIR_DURATION)
      setProgress(p)

      if (p >= 1 && !completedRef.current) {
        completedRef.current = true
        setLanded(true)

        // Generate snow spray particles on landing
        const particles = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: (Math.random() - 0.5) * 120,
          y: -Math.random() * 30,
          vx: (Math.random() - 0.5) * 8,
          vy: -(Math.random() * 4 + 1),
          size: 2 + Math.random() * 4,
          opacity: 0.6 + Math.random() * 0.4,
        }))
        setSnowSpray(particles)

        // Show bonus briefly, then complete
        setShowBonus(true)
        const bonus = Math.min(MAX_BONUS_GATES, Math.floor(spinRef.current / DEGREES_PER_BONUS))
        completeTimeout = setTimeout(() => {
          if (onComplete) onComplete(bonus)
        }, 1500)
        return
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (completeTimeout) clearTimeout(completeTimeout)
    }
  }, [onComplete])

  // Animate snow spray particles
  const sprayActive = snowSpray.length > 0
  useEffect(() => {
    if (!sprayActive) return
    const interval = setInterval(() => {
      setSnowSpray(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3,
          opacity: p.opacity - 0.03,
        })).filter(p => p.opacity > 0)
        if (updated.length === 0) clearInterval(interval)
        return updated
      })
    }, 16)
    return () => clearInterval(interval)
  }, [sprayActive])

  const pos = getArcPosition(progress)
  const currentBonus = Math.min(MAX_BONUS_GATES, Math.floor(spinDegrees / DEGREES_PER_BONUS))
  const fullSpins = Math.floor(spinDegrees / 360)
  const displayDegrees = Math.round(spinDegrees)

  // Ramp position (bottom-left area)
  const rampX = GAME_WIDTH * 0.2
  const rampY = GAME_HEIGHT - 100

  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
      style={{ zIndex: 30 }}
    >
      {/* Sky background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1e3a5f 0%, #60a5fa 30%, #93c5fd 60%, #dbeafe 80%, #f0f9ff 100%)'
      }} />

      {/* Mountains */}
      <svg className="absolute top-0 left-0 w-full" style={{ height: 160 }}>
        <polygon points="0,160 30,80 70,110 120,50 170,85 220,60 270,80 330,55 400,160"
          fill="#475569" opacity="0.7" />
        <polygon points="0,160 50,100 100,70 150,100 200,75 260,90 310,70 400,160"
          fill="#334155" opacity="0.6" />
        {/* Snow caps */}
        <polygon points="120,50 110,70 130,70" fill="white" opacity="0.8" />
        <polygon points="220,60 210,78 230,78" fill="white" opacity="0.8" />
        <polygon points="330,55 318,75 342,75" fill="white" opacity="0.8" />
      </svg>

      {/* Snow ground */}
      <div className="absolute left-0 right-0 bottom-0" style={{
        height: 120,
        background: 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)'
      }} />

      {/* Jump ramp */}
      <svg className="absolute" style={{ left: rampX - 60, top: rampY - 30, width: 120, height: 60 }}>
        <defs>
          <linearGradient id="rampGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        {/* Ramp shape */}
        <path d="M 0 60 L 80 60 L 120 10 L 100 10 Q 60 15 0 60 Z" fill="url(#rampGrad)" />
        <path d="M 0 60 L 80 60 L 120 10 L 100 10 Q 60 15 0 60 Z" fill="none" stroke="#1e40af" strokeWidth="2" />
        {/* Snow on top of ramp */}
        <path d="M 20 55 Q 60 35 100 12 L 120 10 L 115 15 Q 55 40 10 58 Z" fill="white" opacity="0.4" />
      </svg>

      {/* Arc trajectory trail (dotted) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {progress > 0.05 && (
          <path
            d={(() => {
              const points = []
              const steps = Math.floor(progress * 40)
              for (let i = 0; i <= steps; i++) {
                const p = i / 40
                const pt = getArcPosition(p)
                points.push(`${pt.x} ${pt.y}`)
              }
              return `M ${points.join(' L ')}`
            })()}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        )}
      </svg>

      {/* Skier in the air */}
      <div style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) rotate(${spinDegrees}deg)`,
        transition: 'transform 0.05s linear',
        width: 80,
        height: 90,
        pointerEvents: 'none',
      }}>
        <svg
          style={{ width: 80, height: 90, overflow: 'visible' }}
          viewBox="-40 -75 80 90"
        >
          <defs>
            <linearGradient id="ba-skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDBF94" />
              <stop offset="100%" stopColor="#D4956B" />
            </linearGradient>
            <linearGradient id="ba-helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={helmet} />
              <stop offset="100%" stopColor={helmetDark} />
            </linearGradient>
            <linearGradient id="ba-goggleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={goggles} />
              <stop offset="60%" stopColor={gogglesDark} />
              <stop offset="100%" stopColor={gogglesDark} />
            </linearGradient>
            <linearGradient id="ba-suitTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={suit} />
              <stop offset="100%" stopColor={suitDark} />
            </linearGradient>
            <linearGradient id="ba-suitBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="ba-skiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="50%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
          </defs>

          {/* Tucked pose - arms in, legs together */}
          <g>
            {/* Skis (horizontal, together) */}
            <g>
              <rect x="-28" y="4" width="56" height="5" rx="2" fill="#1a1a2e" stroke="#111" strokeWidth="0.3" />
              <rect x="-22" y="5" width="44" height="1.5" rx="0.5" fill={skiAccent} />
            </g>

            {/* Boots */}
            <rect x="-8" y="-2" width="16" height="7" rx="2" fill="#1f2937" />

            {/* Legs (tucked) */}
            <path d="M -6 -2 Q -8 -10 -5 -18 L 5 -18 Q 8 -10 6 -2 Z"
              fill="url(#ba-suitBottomGrad)" />

            {/* Torso */}
            <g transform="translate(0, -26)">
              <path
                d="M -9 18 Q -12 10 -9 2 Q -6 -5 0 -8 Q 6 -5 9 2 Q 12 10 9 18 Q 5 20 0 20 Q -5 20 -9 18 Z"
                fill="url(#ba-suitTopGrad)"
              />
              <path d="M -3 -6 L -4 20 L 4 20 L 3 -6 Z" fill="white" opacity="0.3" />
              <rect x="-7" y="2" width="14" height="12" rx="1" fill="white" />
              <rect x="-6" y="3" width="12" height="10" rx="0.5" fill="white" stroke="#e5e7eb" strokeWidth="0.3" />
              <text x="0" y="11" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#111" fontFamily="Arial">{bibNumber}</text>
            </g>

            {/* Arms (tucked in) */}
            <g transform="translate(-10, -34)">
              <path d="M 0 0 Q -3 5 -2 10 L 4 10 Q 5 5 2 0 Z" fill="url(#ba-suitTopGrad)" />
              <ellipse cx="1" cy="11" rx="3" ry="2.5" fill="#1f2937" />
            </g>
            <g transform="translate(10, -34)">
              <path d="M 0 0 Q 3 5 2 10 L -4 10 Q -5 5 -2 0 Z" fill="url(#ba-suitTopGrad)" />
              <ellipse cx="-1" cy="11" rx="3" ry="2.5" fill="#1f2937" />
            </g>

            {/* Head */}
            <g transform="translate(0, -46)">
              <rect x="-2.5" y="4" width="5" height="4" rx="1" fill="url(#ba-skinGrad)" />
              <ellipse cx="0" cy="0" rx="9" ry="8" fill="url(#ba-helmetGrad)" />
              <ellipse cx="-3" cy="-3" rx="4" ry="2.5" fill="white" opacity="0.2" />
              <path d="M -8 -1 Q -9 -3 -7 -4 Q 0 -6 7 -4 Q 9 -3 8 -1 Q 7 2 0 3 Q -7 2 -8 -1 Z"
                fill="url(#ba-goggleGrad)" stroke="#92400e" strokeWidth="0.6" />
              <path d="M -5 -2 Q -3 -4 2 -3 Q 0 -1 -5 -2 Z" fill="white" opacity="0.4" />
            </g>
          </g>
        </svg>
      </div>

      {/* Snow spray on landing */}
      {landed && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {snowSpray.map(p => (
            <circle
              key={p.id}
              cx={GAME_WIDTH / 2 + p.x}
              cy={GAME_HEIGHT - 100 + p.y}
              r={p.size}
              fill="white"
              opacity={p.opacity}
            />
          ))}
        </svg>
      )}

      {/* BIG AIR header */}
      <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
        <div className="text-4xl font-black text-white" style={{
          textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 2px 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '0.15em',
        }}>
          BIG AIR!
        </div>
      </div>

      {/* MASH! prompt */}
      {!landed && (
        <div className="absolute top-16 left-0 right-0 text-center pointer-events-none">
          <div className="text-lg font-bold animate-pulse" style={{
            color: '#fbbf24',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
          }}>
            MASH SPACE or alternate LEFT/RIGHT!
          </div>
        </div>
      )}

      {/* Spin counter */}
      <div className="absolute top-28 left-0 right-0 text-center pointer-events-none">
        <div className="text-6xl font-black font-mono" style={{
          color: currentBonus >= MAX_BONUS_GATES ? '#fbbf24' : currentBonus >= 3 ? '#fb923c' : '#ffffff',
          textShadow: '0 0 15px rgba(0,0,0,0.5), 2px 2px 4px rgba(0,0,0,0.5)',
          transition: 'color 0.2s',
        }}>
          {displayDegrees}°
        </div>
        {fullSpins > 0 && (
          <div className="text-sm font-bold text-white/70 mt-1">
            {fullSpins === 1 && '360'}
            {fullSpins === 2 && '720'}
            {fullSpins === 3 && '1080'}
            {fullSpins === 4 && '1440'}
            {fullSpins === 5 && '1800'}
            {fullSpins > 5 && `${fullSpins * 360}`}
          </div>
        )}
      </div>

      {/* Bonus gate indicators */}
      <div className="absolute right-4 top-1/3 flex flex-col gap-2 pointer-events-none">
        {Array.from({ length: MAX_BONUS_GATES }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-2"
            style={{ opacity: currentBonus > i ? 1 : 0.3 }}
          >
            <div style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: currentBonus > i ? '#22c55e' : '#475569',
              border: '2px solid',
              borderColor: currentBonus > i ? '#86efac' : '#64748b',
              transition: 'all 0.2s',
              boxShadow: currentBonus > i ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none',
            }} />
            <span className="text-xs font-bold" style={{
              color: currentBonus > i ? '#22c55e' : '#64748b',
            }}>
              +{i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar (time remaining) */}
      {!landed && (
        <div className="absolute bottom-16 left-8 right-8 pointer-events-none">
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(1 - progress) * 100}%`,
                backgroundColor: progress > 0.8 ? '#ef4444' : progress > 0.6 ? '#f59e0b' : '#22c55e',
                transition: 'width 0.05s linear, background-color 0.3s',
              }}
            />
          </div>
          <div className="text-center text-xs text-white/60 mt-1">
            {Math.max(0, (BIG_AIR_DURATION / 1000 - (BIG_AIR_DURATION / 1000 * progress))).toFixed(1)}s
          </div>
        </div>
      )}

      {/* Landing bonus display */}
      {showBonus && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="text-center"
            style={{
              animation: 'bigAirBonusIn 0.5s ease-out',
            }}
          >
            {currentBonus > 0 ? (
              <>
                <div className="text-5xl font-black text-yellow-400 mb-2" style={{
                  textShadow: '0 0 20px rgba(251, 191, 36, 0.6), 2px 2px 4px rgba(0,0,0,0.5)',
                }}>
                  +{currentBonus} BONUS {currentBonus === 1 ? 'GATE' : 'GATES'}!
                </div>
                <div className="text-lg text-white/80">
                  {displayDegrees}° of rotation
                </div>
              </>
            ) : (
              <div className="text-3xl font-bold text-white/80" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}>
                No bonus - keep mashing next time!
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS animation for bonus popup */}
      <style>{`
        @keyframes bigAirBonusIn {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
