import { useState, useEffect, useCallback, useRef } from 'react'
import {
  GAME_HEIGHT, GAME_WIDTH, SKIER_Y, GATE_SPAWN_Y, OPTIMAL_HIT_Y, GATE_Y,
  PERFECT_WINDOW, GOOD_WINDOW, LATE_WINDOW,
  INITIAL_SPEED, MAX_SPEED, ACCELERATION, TURN_DECELERATION,
  MIN_GATE_SPACING, MAX_GATE_SPACING, TOTAL_GATES, MAX_RACE_TIME,
  SKIER_CENTER_X, LEFT_POSITION, RIGHT_POSITION, MAX_MISSES,
  DIFFICULTY_PRESETS, SPEED_PRESETS, DISCIPLINE_PRESETS,
  WORLD_TOUR_LOCATIONS
} from '../config/gameSettings'
import { useAudio } from '../hooks/useAudio'
import { generateSnowParticles, generateSparkles, generateStars, generateTrees, generateCrowd, generateCourse, getDailySeed, getTodayString } from '../utils/generators'
import Skier from './Skier'
import SlalomGate from './SlalomGate'
import Spectator from './Spectator'
import Tree from './Tree'
import HUD from './HUD'
import { CountdownScreen, FinishScreen, GameOverScreen } from './GameScreens'
import BigAir from './BigAir'
import GhostSkier from './GhostSkier'
import Lobby from './Lobby'
import FreeRide from './FreeRide/FreeRide'
import { calculateRunCredits, SHOP_ITEMS } from '../config/shopData'
import { checkBadges } from '../config/badgeData'

// Pre-generate static elements
const SPARKLES = generateSparkles(40)
const NIGHT_STARS = generateStars(70)
const LEFT_TREES = generateTrees(6)
const RIGHT_TREES = generateTrees(6)
const LEFT_CROWD = generateCrowd(15)
const RIGHT_CROWD = generateCrowd(15)

export default function SlalomTrainer() {
  const [discipline, setDiscipline] = useState('sl')
  const disciplineSettings = DISCIPLINE_PRESETS[discipline]
  const [difficulty, setDifficulty] = useState('normal')
  const diffSettings = DIFFICULTY_PRESETS[difficulty]
  const [speedLevel, setSpeedLevel] = useState('normal')
  const speedSettings = SPEED_PRESETS[speedLevel]

  // World Tour location state
  const [selectedLocation, setSelectedLocation] = useState('bunny-hill')
  const [nightMode, setNightMode] = useState(false)

  const [gameState, setGameState] = useState('lobby')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [skierStyle, setSkierStyle] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-skierStyle')
      return stored ? JSON.parse(stored) : {
        helmet: '#ef4444', suit: '#3b82f6', goggles: '#fbbf24',
        skiAccent: '#ef4444', bibNumber: 42,
      }
    } catch {
      return { helmet: '#ef4444', suit: '#3b82f6', goggles: '#fbbf24', skiAccent: '#ef4444', bibNumber: 42 }
    }
  })
  const [countdownValue, setCountdownValue] = useState(3)
  const [gates, setGates] = useState([])
  const [gateCount, setGateCount] = useState(0)
  const [gatesCleared, setGatesCleared] = useState(0)
  const [misses, setMisses] = useState(0)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [groundOffset, setGroundOffset] = useState(0)
  const [raceTime, setRaceTime] = useState(0)
  const [splitTimes, setSplitTimes] = useState([])
  const [lastSplit, setLastSplit] = useState(null)
  const [bestScores, setBestScores] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-bestScores')
      if (stored) return JSON.parse(stored)
      // Migrate from old single-best format
      const legacy = localStorage.getItem('slalom-bestScore')
      if (legacy) {
        const migrated = { normal: JSON.parse(legacy) }
        localStorage.setItem('slalom-bestScores', JSON.stringify(migrated))
        localStorage.removeItem('slalom-bestScore')
        return migrated
      }
      return {}
    } catch { return {} }
  })
  const bestTime = bestScores[`${discipline}-${difficulty}`] || bestScores[difficulty] || null

  // Daily challenge state
  const [isDailyChallenge, setIsDailyChallenge] = useState(false)
  const [dailyBest, setDailyBest] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-daily')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Only keep if it's from today
        if (parsed.date === getTodayString()) return parsed
      }
      return null
    } catch { return null }
  })

  const [runHistory, setRunHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-runHistory')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  // Leaderboard: top 10 scores per discipline+difficulty key (e.g. "sl-normal", "gs-hard")
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-leaderboard-v2')
      if (stored) return JSON.parse(stored)
      // Migrate old leaderboard (assume sl discipline)
      const old = localStorage.getItem('slalom-leaderboard')
      if (old) {
        const parsed = JSON.parse(old)
        const migrated = {}
        for (const diff of ['easy', 'normal', 'hard']) {
          if (parsed[diff]) migrated[`sl-${diff}`] = parsed[diff]
        }
        return migrated
      }
      return {}
    } catch { return {} }
  })

  // Big Air bonus gates awarded after finishing
  const [bigAirBonus, setBigAirBonus] = useState(0)

  // Ski Credits currency — persisted in localStorage
  const [credits, setCredits] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-credits')
      return stored ? parseInt(stored, 10) : 0
    } catch { return 0 }
  })
  const [unlockedItems, setUnlockedItems] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-unlocked')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  // Achievement badges — persisted Set of badge IDs
  const [earnedBadges, setEarnedBadges] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-badges')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })

  const awardBadges = useCallback((newIds) => {
    if (!newIds || newIds.length === 0) return
    setEarnedBadges(prev => {
      const updated = new Set(prev)
      newIds.forEach(id => updated.add(id))
      try { localStorage.setItem('slalom-badges', JSON.stringify([...updated])) } catch {}
      return updated
    })
  }, [])

  // Credits earned during the current run (shown on finish/gameover screen)
  const [lastRunCredits, setLastRunCredits] = useState(0)

  const addCredits = useCallback((amount) => {
    setCredits(prev => {
      const updated = prev + amount
      try { localStorage.setItem('slalom-credits', String(updated)) } catch {}
      return updated
    })
  }, [])

  const buyItem = useCallback((itemId) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId)
    if (!item) return false
    if (unlockedItems.includes(itemId)) return false
    if (credits < item.price) return false
    setCredits(prev => {
      const updated = prev - item.price
      try { localStorage.setItem('slalom-credits', String(updated)) } catch {}
      return updated
    })
    setUnlockedItems(prev => {
      const updated = [...prev, itemId]
      try { localStorage.setItem('slalom-unlocked', JSON.stringify(updated)) } catch {}
      return updated
    })
    return true
  }, [credits, unlockedItems])

  const equipItem = useCallback((itemId) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId)
    if (!item || !unlockedItems.includes(itemId)) return
    // Map shop category to skierStyle key
    if (item.category === 'bib') {
      const newStyle = { ...skierStyle, bibNumber: item.bibNumber }
      setSkierStyle(newStyle)
      try { localStorage.setItem('slalom-skierStyle', JSON.stringify(newStyle)) } catch {}
      return
    }
    const styleKeyMap = { helmet: 'helmet', suit: 'suit', goggles: 'goggles', skis: 'skiAccent' }
    const styleKey = styleKeyMap[item.category]
    if (!styleKey) return
    const newStyle = { ...skierStyle, [styleKey]: item.color }
    setSkierStyle(newStyle)
    try { localStorage.setItem('slalom-skierStyle', JSON.stringify(newStyle)) } catch {}
  }, [unlockedItems, skierStyle])

  // Add a run to the leaderboard if it qualifies for top 10
  const addToLeaderboard = useCallback((run) => {
    setLeaderboard(prev => {
      const diff = run.difficulty || 'normal'
      const disc = run.discipline || 'sl'
      const key = `${disc}-${diff}`
      const board = [...(prev[key] || [])]

      const entry = {
        playerName: run.playerName || 'Unknown',
        gates: run.gates,
        timing: { ...run.timing },
        difficulty: diff,
        discipline: disc,
        result: run.result,
        ts: run.ts,
      }

      board.push(entry)
      // Sort by gates cleared descending, then by fewer misses, then by more perfects
      board.sort((a, b) => {
        if (b.gates !== a.gates) return b.gates - a.gates
        if ((a.timing?.miss || 0) !== (b.timing?.miss || 0)) return (a.timing?.miss || 0) - (b.timing?.miss || 0)
        return (b.timing?.perfect || 0) - (a.timing?.perfect || 0)
      })

      const trimmed = board.slice(0, 10)

      const updated = { ...prev, [key]: trimmed }
      try { localStorage.setItem('slalom-leaderboard-v2', JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  const [skierX, setSkierX] = useState(SKIER_CENTER_X)
  // Keep a ref in sync so game loop can read current X without stale closures
  useEffect(() => { skierXRef.current = skierX }, [skierX])
  useEffect(() => { missesRef.current = misses }, [misses])
  const [skierLean, setSkierLean] = useState(0)
  const [skierTrail, setSkierTrail] = useState([])
  const [carvePhase, setCarvePhase] = useState(null)

  const [crowdCheering, setCrowdCheering] = useState(false)
  const [cheerPhase, setCheerPhase] = useState(0)
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 })
  const [snowParticles, setSnowParticles] = useState(() => generateSnowParticles(30))
  const [lastFeedback, setLastFeedback] = useState(null)
  const [showFinishCrowd, setShowFinishCrowd] = useState(false)
  const [timingBreakdown, setTimingBreakdown] = useState({ perfect: 0, good: 0, early: 0, late: 0, miss: 0 })
  const [crowdCallout, setCrowdCallout] = useState(null) // { text, side, id }
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const comboRef = useRef(0) // sync ref for game loop reads
  const [hitParticles, setHitParticles] = useState([])
  const hitParticleIdRef = useRef(0)
  const [screenFlash, setScreenFlash] = useState(null) // { color, opacity, id }
  const [slowMo, setSlowMo] = useState(false)
  const slowMoRef = useRef(false) // sync ref for game loop reads
  const [isNewRecord, setIsNewRecord] = useState(false)
  // comboHighlight: tracks best combo and the gate number it peaked at
  const comboHighlightRef = useRef({ combo: 0, gateNumber: 0 })
  const [comboHighlight, setComboHighlight] = useState({ combo: 0, gateNumber: 0 })

  const [playerName, setPlayerName] = useState(() => {
    try { return localStorage.getItem('slalom-playerName') || '' } catch { return '' }
  })

  // Arcade Mode state
  const [arcadeMode, setArcadeMode] = useState(() => {
    try { return localStorage.getItem('slalom-arcadeMode') === 'true' } catch { return false }
  })
  const handleArcadeModeChange = useCallback((val) => {
    setArcadeMode(val)
    try { localStorage.setItem('slalom-arcadeMode', String(val)) } catch {}
  }, [])
  const arcadeModeRef = useRef(false)
  const [powerUps, setPowerUps] = useState([])
  const [activePowerUp, setActivePowerUp] = useState(null)
  const [shieldActive, setShieldActive] = useState(false)
  const shieldActiveRef = useRef(false)
  const activePowerUpRef = useRef(null)
  const powerUpIdRef = useRef(0)
  const lastPowerUpSpawnTimeRef = useRef(0)
  const nextPowerUpIntervalRef = useRef(15000)
  // Keep refs in sync with state
  useEffect(() => { arcadeModeRef.current = arcadeMode }, [arcadeMode])
  useEffect(() => { shieldActiveRef.current = shieldActive }, [shieldActive])
  useEffect(() => { activePowerUpRef.current = activePowerUp }, [activePowerUp])

  // Ghost Racer state
  const [ghostEnabled, setGhostEnabled] = useState(() => {
    try { return localStorage.getItem('slalom-ghostEnabled') !== 'false' } catch { return true }
  })
  const handleGhostToggle = useCallback(() => {
    setGhostEnabled(prev => {
      const next = !prev
      try { localStorage.setItem('slalom-ghostEnabled', String(next)) } catch {}
      return next
    })
  }, [])
  // Recording the current run's ghost data (array of {x, lean, t})
  const ghostDataRef = useRef([])
  const ghostFrameCountRef = useRef(0)
  // The loaded ghost for playback (array of {x, lean, t} from localStorage)
  const ghostPlaybackRef = useRef(null)
  // Current ghost position for rendering (updated in game loop)
  const [ghostPos, setGhostPos] = useState(null) // { x, lean }

  const { initAudio, playBeep, playCarveSound, playGateHit, playCrowdNoise, playComboTick, playComboMilestone, playComboBreak, startLobbyMusic, stopLobbyMusic } = useAudio()

  const gameLoopRef = useRef(null)
  const carveAnimationRef = useRef(null)
  const raceStartTimeRef = useRef(null)
  const lastGateSpawnRef = useRef(0)
  const nextGateSideRef = useRef('left')
  const nextGateSpacingRef = useRef(150)
  const gateIdRef = useRef(0)
  const cheerTimeoutRef = useRef(null)
  const courseRef = useRef([])
  const courseIndexRef = useRef(0)
  // Ref so the game loop always reads the latest skier X without stale closures
  const skierXRef = useRef(SKIER_CENTER_X)
  // Ref so the game loop can read current miss count without stale closures
  const missesRef = useRef(0)

  // Crowd callout helper
  const fireCrowdCallout = useCallback((text) => {
    const side = Math.random() < 0.5 ? 'left' : 'right'
    setCrowdCallout({ text, side, id: Date.now() })
  }, [])

  // Hit particle helper — IDs assigned outside setState to avoid StrictMode double-invoke
  const spawnHitParticles = useCallback((x, y, count, color) => {
    const newParticles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 3
      hitParticleIdRef.current += 1
      return {
        id: hitParticleIdRef.current,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color,
        life: 1.0,
      }
    })
    // Cap at 30 total particles
    setHitParticles(prev => [...prev, ...newParticles].slice(-30))
  }, [])

  // Countdown sequence
  useEffect(() => {
    if (gameState !== 'countdown') return

    initAudio()

    if (countdownValue > 0) {
      playBeep(440, 0.2, 0.3)
      const timer = setTimeout(() => setCountdownValue(countdownValue - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      playBeep(880, 0.4, 0.4)
      raceStartTimeRef.current = Date.now()
      setGameState('playing')
    }
  }, [gameState, countdownValue, initAudio, playBeep])

  // Update race time and check for finish
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      const currentTime = Date.now() - raceStartTimeRef.current
      setRaceTime(currentTime)

      // Show finish crowd in the last 10 seconds
      if (currentTime >= MAX_RACE_TIME - 10000 && !showFinishCrowd) {
        setShowFinishCrowd(true)
        setCrowdCheering(true)
        const lastSecondCalls = ['ALMOST THERE!', 'FINISH STRONG!', 'GO GO GO!']
        fireCrowdCallout(lastSecondCalls[Math.floor(Math.random() * lastSecondCalls.length)])
      }

      // Slow-mo: activate in the last 2 seconds of the race
      if (currentTime >= MAX_RACE_TIME - 2000 && !slowMoRef.current) {
        slowMoRef.current = true
        setSlowMo(true)
      }
    }, 10)

    return () => clearInterval(timer)
  }, [gameState, showFinishCrowd, fireCrowdCallout])

  // Animate cheering
  useEffect(() => {
    if (!crowdCheering) return

    let animationId
    const animateCheer = () => {
      setCheerPhase(prev => prev + 0.15)
      animationId = requestAnimationFrame(animateCheer)
    }

    animationId = requestAnimationFrame(animateCheer)
    return () => cancelAnimationFrame(animationId)
  }, [crowdCheering])

  // Snow particle animation
  useEffect(() => {
    if (gameState !== 'playing') return

    const animateSnow = () => {
      setSnowParticles(particles =>
        particles.map(p => ({
          ...p,
          y: (p.y + p.speed + speed * 0.5) % GAME_HEIGHT,
          x: p.x + p.drift + (skierLean * 0.3)
        }))
      )
    }

    const interval = setInterval(animateSnow, 50)
    return () => clearInterval(interval)
  }, [gameState, speed, skierLean])

  // Camera shake decay
  useEffect(() => {
    if (cameraShake.x === 0 && cameraShake.y === 0) return

    const decay = () => {
      setCameraShake(prev => ({
        x: prev.x * 0.85,
        y: prev.y * 0.85
      }))
    }

    const timer = setTimeout(decay, 16)
    return () => clearTimeout(timer)
  }, [cameraShake])

  // Hit particle animation — single persistent interval, no double-interval risk
  const particleTickRef = useRef(null)
  useEffect(() => {
    if (hitParticles.length > 0 && !particleTickRef.current) {
      particleTickRef.current = setInterval(() => {
        setHitParticles(prev => {
          if (prev.length === 0) {
            clearInterval(particleTickRef.current)
            particleTickRef.current = null
            return prev
          }
          return prev
            .map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.15, // gravity
              life: p.life - 0.045,
            }))
            .filter(p => p.life > 0)
        })
      }, 16)
    }
    return () => {
      if (hitParticles.length === 0 && particleTickRef.current) {
        clearInterval(particleTickRef.current)
        particleTickRef.current = null
      }
    }
  }, [hitParticles.length])

  // Screen flash decay
  useEffect(() => {
    if (!screenFlash) return

    const decay = setInterval(() => {
      setScreenFlash(prev => {
        if (!prev) return null
        const newOpacity = prev.opacity - 0.08
        return newOpacity <= 0 ? null : { ...prev, opacity: newOpacity }
      })
    }, 16)

    return () => clearInterval(decay)
  }, [screenFlash?.id])

  // Carve animation
  useEffect(() => {
    if (!carvePhase) return

    const animateCarve = () => {
      setCarvePhase(prev => {
        if (!prev) return null

        const newProgress = prev.progress + (prev.phase === 'approach' ? 0.08 : 0.05)

        if (newProgress >= 1) {
          if (prev.phase === 'approach') {
            return {
              phase: 'gate',
              startX: prev.targetX,
              targetX: prev.gateX,
              progress: 0,
              gateX: prev.gateX,
              gateSide: prev.gateSide,
              exitX: prev.exitX
            }
          } else if (prev.phase === 'gate') {
            return {
              phase: 'exit',
              startX: prev.targetX,
              targetX: prev.exitX,
              progress: 0,
              gateX: prev.gateX,
              gateSide: prev.gateSide,
              exitX: prev.exitX
            }
          } else {
            return null
          }
        }

        return { ...prev, progress: newProgress }
      })

      carveAnimationRef.current = requestAnimationFrame(animateCarve)
    }

    carveAnimationRef.current = requestAnimationFrame(animateCarve)
    return () => {
      if (carveAnimationRef.current) cancelAnimationFrame(carveAnimationRef.current)
    }
  }, [carvePhase?.phase])

  // Update skier position from carve
  useEffect(() => {
    if (!carvePhase) return

    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    const easedProgress = easeInOutCubic(carvePhase.progress)
    const newX = carvePhase.startX + (carvePhase.targetX - carvePhase.startX) * easedProgress

    setSkierX(newX)

    const direction = carvePhase.targetX - carvePhase.startX
    const leanIntensity = carvePhase.phase === 'gate' ? 1.3 : 0.7
    setSkierLean(Math.sign(direction) * leanIntensity)

    if (Math.abs(direction) > 5 && carvePhase.progress < 0.1) {
      playCarveSound(Math.abs(leanIntensity))
    }

    if (gameState === 'playing') {
      setSkierTrail(trail => {
        const newPoint = { x: newX, y: SKIER_Y, age: 0 }
        return [...trail, newPoint]
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < 35)
          .slice(-35)
      })
    }
  }, [carvePhase, gameState, playCarveSound])

  useEffect(() => {
    if (!carvePhase) setSkierLean(prev => prev * 0.9)
  }, [carvePhase])

  // Handle input
  const handleInput = useCallback((inputSide) => {
    if (gameState !== 'playing') return

    setGates(prev => {
      const updated = [...prev]

      const targetGate = updated.find(g =>
        !g.hit &&
        g.side === inputSide &&
        g.y > OPTIMAL_HIT_Y - diffSettings.LATE_WINDOW &&
        g.y < GATE_Y + 25
      )

      if (targetGate) {
        targetGate.hit = true
        targetGate.hitTime = Date.now()

        playGateHit()
        // Camera shake — will be sharpened per feedback quality below
        setCameraShake({ x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 4 })

        const isLeftGate = inputSide === 'left'
        // The gate has a physical opening: openStart..openEnd
        // The skier must pass through the center of that opening.
        // Approach: come from the correct side of the gate
        // Gate center: middle of openStart..openEnd
        // Exit: swing to the other side after passing through
        const openStart = targetGate.openStart ?? (isLeftGate ? targetGate.x : targetGate.x - 50)
        const openEnd = targetGate.openEnd ?? (isLeftGate ? targetGate.x + 50 : targetGate.x)
        const gateCenter = (openStart + openEnd) / 2

        // Approach: position skier outside the gate (on the far side from the opening center)
        // For a left gate (inner pole left, opening to the right): approach from further right
        // For a right gate (inner pole right, opening to the left): approach from further left
        const arcMult = disciplineSettings.arcWidth
        const approachX = isLeftGate
          ? Math.min(GAME_WIDTH - 20, gateCenter + (openEnd - openStart) * 0.8 * arcMult)
          : Math.max(20, gateCenter - (openEnd - openStart) * 0.8 * arcMult)

        // Exit: swing to the other side of center after clearing the gate
        const exitX = isLeftGate
          ? Math.max(20, gateCenter - (openEnd - openStart) * 0.8 * arcMult)
          : Math.min(GAME_WIDTH - 20, gateCenter + (openEnd - openStart) * 0.8 * arcMult)

        setCarvePhase({
          phase: 'approach',
          startX: skierX,
          targetX: approachX,
          progress: 0,
          gateX: gateCenter,   // skier threads through the gate opening center
          gateSide: inputSide,
          exitX: exitX
        })

        setSpeed(prev => Math.max(speedSettings.INITIAL_SPEED, prev - TURN_DECELERATION))

        // Magnet power-up: clamp distance so timing is GOOD or better
        const rawDistance = Math.abs(targetGate.y - OPTIMAL_HIT_Y)
        const magnetActive = activePowerUpRef.current?.type === 'magnet' && Date.now() < activePowerUpRef.current.expiresAt
        const distance = magnetActive ? Math.min(rawDistance, diffSettings.GOOD_WINDOW - 1) : rawDistance
        const currentTime = Date.now() - raceStartTimeRef.current

        let timePenalty = 0
        let feedback = ''
        let feedbackColor = ''

        if (distance <= diffSettings.PERFECT_WINDOW) {
          feedback = 'PERFECT'
          feedbackColor = '#22c55e'
          setTimingBreakdown(prev => ({ ...prev, perfect: prev.perfect + 1 }))
          setCrowdCheering(true)
          if (cheerTimeoutRef.current) clearTimeout(cheerTimeoutRef.current)
          cheerTimeoutRef.current = setTimeout(() => setCrowdCheering(false), 1200)
          // Sharp camera shake + white snow confetti burst
          setCameraShake({ x: (Math.random() - 0.5) * 14, y: (Math.random() - 0.5) * 10 })
          const particleCount = 8 + Math.floor(Math.random() * 5) // 8-12
          spawnHitParticles(targetGate.x, GATE_Y, particleCount, 'white')
        } else if (distance <= diffSettings.GOOD_WINDOW) {
          timePenalty = 0.15
          feedback = 'GOOD'
          feedbackColor = '#3b82f6'
          setTimingBreakdown(prev => ({ ...prev, good: prev.good + 1 }))
          // Mild camera shake + small particle burst
          setCameraShake({ x: (Math.random() - 0.5) * 7, y: (Math.random() - 0.5) * 5 })
          const particleCount = 4 + Math.floor(Math.random() * 3) // 4-6
          spawnHitParticles(targetGate.x, GATE_Y, particleCount, '#93c5fd')
        } else if (distance <= diffSettings.LATE_WINDOW) {
          timePenalty = 0.35
          feedback = distance < OPTIMAL_HIT_Y ? 'EARLY' : 'LATE'
          feedbackColor = '#f59e0b'
          setTimingBreakdown(prev => {
            const key = distance < OPTIMAL_HIT_Y ? 'early' : 'late'
            return { ...prev, [key]: prev[key] + 1 }
          })
        }

        // Combo system: PERFECT adds +2, GOOD adds +1, EARLY/LATE resets
        const comboBuilds = feedback === 'PERFECT' || feedback === 'GOOD'
        const prevComboValue = comboRef.current
        let newCombo
        if (comboBuilds) {
          const increment = feedback === 'PERFECT' ? 2 : 1
          newCombo = comboRef.current + increment
          comboRef.current = newCombo
          setCombo(newCombo)
          setMaxCombo(prev => Math.max(prev, newCombo))
          // Update combo highlight outside the setState updater to avoid nested setState calls
          if (newCombo > comboHighlightRef.current.combo) {
            comboHighlightRef.current = { combo: newCombo, gateNumber: gatesCleared + 1 }
            setComboHighlight({ combo: newCombo, gateNumber: gatesCleared + 1 })
          }
          if (soundEnabled) playComboTick(newCombo)
        } else {
          newCombo = 0
          comboRef.current = 0
          setCombo(0)
          if (soundEnabled) playComboBreak(prevComboValue)
        }

        // Combo milestones: gold sparkle burst at 10 and 20; sound at 5/10/20
        const prevCombo = prevComboValue
        const crossedMilestone5 = newCombo >= 5 && prevCombo < 5
        const crossedMilestone10 = newCombo >= 10 && prevCombo < 10
        const crossedMilestone20 = newCombo >= 20 && prevCombo < 20
        if (crossedMilestone20) {
          spawnHitParticles(targetGate.x, GATE_Y, 18, '#fbbf24')
          spawnHitParticles(targetGate.x, GATE_Y, 6, '#f59e0b')
          if (soundEnabled) playComboMilestone('legendary')
        } else if (crossedMilestone10) {
          spawnHitParticles(targetGate.x, GATE_Y, 12, '#fbbf24')
          if (soundEnabled) playComboMilestone('fire')
        } else if (crossedMilestone5) {
          if (soundEnabled) playComboMilestone('hot')
        }

        // Crowd callouts based on combo tier
        const displayName = (playerName || 'SKIER').toUpperCase()
        if (newCombo >= 20) {
          const legendCalls = ['LEGENDARY!', 'INCREDIBLE!', `${displayName} IS A GOD!`]
          fireCrowdCallout(legendCalls[Math.floor(Math.random() * legendCalls.length)])
        } else if (newCombo >= 10) {
          const fireCalls = ['UNSTOPPABLE!', 'ON FIRE!', `GO ${displayName}!`]
          fireCrowdCallout(fireCalls[Math.floor(Math.random() * fireCalls.length)])
        } else if (newCombo >= 5) {
          const streakCalls = ['NICE STREAK!', 'KEEP GOING!']
          fireCrowdCallout(streakCalls[Math.floor(Math.random() * streakCalls.length)])
        } else if (distance <= diffSettings.PERFECT_WINDOW && Math.random() < 0.30) {
          const perfectCalls = ['PERFECT!', 'AMAZING!', 'WOW!']
          fireCrowdCallout(perfectCalls[Math.floor(Math.random() * perfectCalls.length)])
        }

        setLastFeedback({ text: feedback, color: feedbackColor, penalty: timePenalty, id: Date.now() })
        setGatesCleared(prev => prev + 1)

        const splitTime = currentTime + timePenalty * 1000
        setSplitTimes(prev => [...prev, splitTime])
        setLastSplit({ time: splitTime, gate: gatesCleared + 1 })

      } else {
        // Wrong key / no valid gate — pronounced wobble
        const wobbleX = inputSide === 'left' ? skierX - 28 : skierX + 28
        setCarvePhase({
          phase: 'exit',
          startX: skierX,
          targetX: wobbleX,
          progress: 0,
          gateX: skierX,
          gateSide: inputSide,
          exitX: skierX
        })
      }

      return updated
    })
  }, [gameState, skierX, gatesCleared, playGateHit, disciplineSettings, fireCrowdCallout, playerName, spawnHitParticles, soundEnabled, playComboTick, playComboMilestone, playComboBreak])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleInput('left')
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleInput('right')
      } else if (e.key === ' ' && (gameState === 'lobby' || gameState === 'finished' || gameState === 'gameOver')) {
        startGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleInput, gameState])

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = () => {
      const slowMoMult = slowMoRef.current ? 0.3 : 1.0
      setGroundOffset(prev => (prev + speed * slowMoMult) % 40)
      setSpeed(prev => Math.min(speedSettings.MAX_SPEED, prev + speedSettings.ACCELERATION * slowMoMult))

      setGates(prev => {
        let newMisses = 0

        let updated = prev.map(gate => ({ ...gate, y: gate.y + speed * slowMoMult }))

        const currentSkierX = skierXRef.current
        updated = updated.filter(gate => {
          // Gate has scrolled past the skier — check if it was cleared
          if (!gate.hit && gate.y > GATE_Y + 60) {
            // Check if skier physically passed through the gate opening
            const gateOpen = gate.openStart !== undefined && gate.openEnd !== undefined
            const passedThrough = gateOpen
              ? currentSkierX >= gate.openStart - 15 && currentSkierX <= gate.openEnd + 15
              : false  // no openStart/openEnd = treat as miss
            if (!passedThrough) {
              newMisses++
            }
            return false
          }
          return gate.y < GAME_HEIGHT + 80
        })

        if (newMisses > 0) {
          comboRef.current = 0
          setCombo(0)
          // Shield absorbs one miss in arcade mode
          if (shieldActiveRef.current) {
            shieldActiveRef.current = false
            setShieldActive(false)
            setLastFeedback({ text: 'BLOCKED!', color: '#22c55e', penalty: 0, id: Date.now() })
            setScreenFlash({ color: '#22c55e', opacity: 0.3, id: Date.now() })
            newMisses = Math.max(0, newMisses - 1)
          }
          if (newMisses > 0) {
          const projectedMisses = missesRef.current + newMisses
          if (projectedMisses >= MAX_MISSES) {
            fireCrowdCallout('Better luck next time!')
          } else {
            const missCalls = ['Oooh!', 'So close!', 'Tough one!']
            fireCrowdCallout(missCalls[Math.floor(Math.random() * missCalls.length)])
          }
          setMisses(m => m + newMisses)
          setTimingBreakdown(prev => ({ ...prev, miss: prev.miss + newMisses }))
          setLastFeedback({ text: 'MISS', color: '#ef4444', penalty: 2.0, id: Date.now() })
          // Red screen flash on miss
          setScreenFlash({ color: '#ef4444', opacity: 0.45, id: Date.now() })
          } // end if (newMisses > 0) after shield check
        }

        // Spawn gates from the pre-generated course
        const currentTime = Date.now() - raceStartTimeRef.current
        const course = courseRef.current
        if (courseIndexRef.current < course.length) {
          lastGateSpawnRef.current += speed * slowMoMult
          if (lastGateSpawnRef.current >= nextGateSpacingRef.current) {
            const courseGate = course[courseIndexRef.current]
            courseIndexRef.current += 1

            gateIdRef.current += 1

            const newGate = {
              id: gateIdRef.current,
              y: GATE_SPAWN_Y,
              x: courseGate.x,
              side: courseGate.side,
              hit: false,
              hitTime: null,
              gateNumber: gateCount + 1,
              pattern: courseGate.pattern
            }

            updated = [...updated, newGate]
            setGateCount(c => c + 1)

            // Set spacing for the NEXT gate
            if (courseIndexRef.current < course.length) {
              nextGateSpacingRef.current = course[courseIndexRef.current].spacing
            }
            lastGateSpawnRef.current = 0
          }
        }

        return updated
      })

      // Arcade Mode: power-up spawning and collection
      if (arcadeModeRef.current) {
        const nowMs = Date.now()
        const elapsedMs = nowMs - (raceStartTimeRef.current || nowMs)
        setPowerUps(prev => {
          let next = prev.map(p => ({ ...p, y: p.y + speed * slowMoMult })).filter(p => p.y < GAME_HEIGHT + 40)
          const collected = next.filter(p => Math.abs(skierXRef.current - p.x) < 50 && p.y > SKIER_Y - 60 && p.y < SKIER_Y + 40)
          if (collected.length > 0) {
            collected.forEach(p => {
              if (p.type === 'shield') {
                shieldActiveRef.current = true
                setShieldActive(true)
              } else if (p.type === 'rocket') {
                const exp = nowMs + 4000
                activePowerUpRef.current = { type: 'rocket', expiresAt: exp }
                setActivePowerUp({ type: 'rocket', expiresAt: exp })
                setSpeed(s => Math.min(s + 3, speedSettings.MAX_SPEED + 3))
              } else if (p.type === 'magnet') {
                const exp = nowMs + 5000
                activePowerUpRef.current = { type: 'magnet', expiresAt: exp }
                setActivePowerUp({ type: 'magnet', expiresAt: exp })
              }
            })
            const ids = new Set(collected.map(p => p.id))
            next = next.filter(p => !ids.has(p.id))
          }
          if (activePowerUpRef.current && nowMs > activePowerUpRef.current.expiresAt) {
            const expiredType = activePowerUpRef.current.type
            activePowerUpRef.current = null
            setActivePowerUp(null)
            if (expiredType === 'rocket') setSpeed(s => Math.max(s - 3, speedSettings.INITIAL_SPEED))
          }
          if (next.length === 0 && elapsedMs - lastPowerUpSpawnTimeRef.current >= nextPowerUpIntervalRef.current) {
            const types = ['magnet', 'rocket', 'shield']
            const type = types[Math.floor(Math.random() * types.length)]
            const x = 80 + Math.floor(Math.random() * (GAME_WIDTH - 160))
            powerUpIdRef.current += 1
            next = [{ id: powerUpIdRef.current, type, x, y: GATE_SPAWN_Y }]
            lastPowerUpSpawnTimeRef.current = elapsedMs
            nextPowerUpIntervalRef.current = 15000 + Math.random() * 5000
          }
          return next
        })
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, speed, gateCount, fireCrowdCallout])

  // Check finish/game over
  useEffect(() => {
    if (gameState !== 'playing') return

    if (misses >= MAX_MISSES) {
      const run = { gates: gatesCleared, misses, timing: { ...timingBreakdown }, ts: Date.now(), result: 'dnf', difficulty, discipline, playerName, maxCombo }
      setRunHistory(prev => {
        const updated = [run, ...prev].slice(0, 20)
        try { localStorage.setItem('slalom-runHistory', JSON.stringify(updated)) } catch {}
        return updated
      })
      addToLeaderboard(run)
      // Calculate and award credits for DNF run
      const earned = calculateRunCredits(timingBreakdown, gatesCleared, maxCombo, false)
      setLastRunCredits(earned)
      addCredits(earned)
      // Check badges after DNF
      const badgeRun = { gates: gatesCleared, result: 'dnf', timing: { ...timingBreakdown }, maxCombo, speedLevel, difficulty, bigAirBonus: 0, isDailyChallenge }
      const newBadgeIds = checkBadges(badgeRun, [...runHistory, run], earnedBadges)
      if (newBadgeIds.length > 0) awardBadges(newBadgeIds)
      setGameState('gameOver')
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    } else if (raceTime >= MAX_RACE_TIME) {
      setRaceTime(MAX_RACE_TIME)
      const bestKey = `${discipline}-${difficulty}`
      const currentBest = bestScores[bestKey]
      const isNewBest = !currentBest || gatesCleared > (currentBest.gates || 0)
      if (isNewBest) {
        const newBest = { time: MAX_RACE_TIME, gates: gatesCleared }
        setBestScores(prev => {
          const updated = { ...prev, [bestKey]: newBest }
          try { localStorage.setItem('slalom-bestScores', JSON.stringify(updated)) } catch {}
          return updated
        })
      }
      const run = { gates: gatesCleared, misses, timing: { ...timingBreakdown }, ts: Date.now(), result: 'finish', difficulty, discipline, playerName, maxCombo }
      setRunHistory(prev => {
        const updated = [run, ...prev].slice(0, 20)
        try { localStorage.setItem('slalom-runHistory', JSON.stringify(updated)) } catch {}
        return updated
      })
      addToLeaderboard(run)
      // Save daily best if this was a daily challenge run
      if (isDailyChallenge) {
        const today = getTodayString()
        setDailyBest((prev) => {
          const currentBestGates = prev?.date === today ? (prev.best?.gates || 0) : 0
          if (gatesCleared > currentBestGates) {
            const saved = {
              date: today,
              best: { gates: gatesCleared, timing: { ...timingBreakdown }, combo: maxCombo },
            }
            try { localStorage.setItem('slalom-daily', JSON.stringify(saved)) } catch {}
            return saved
          }
          return prev
        })
      }
      // Calculate and award credits for finished run
      const earned = calculateRunCredits(timingBreakdown, gatesCleared, maxCombo, true)
      setLastRunCredits(earned)
      addCredits(earned)
      // Capture the final combo highlight before state resets
      setComboHighlight({ ...comboHighlightRef.current })
      // Record-breaking celebration
      if (isNewBest) {
        setIsNewRecord(true)
        setScreenFlash({ color: '#ffffff', opacity: 0.7, id: Date.now() })
        setCameraShake({ x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 14 })
      }
      // Transition to Big Air mini-game instead of directly to finished
      setBigAirBonus(0)
      setGameState('bigAir')
      playCrowdNoise(3)
      playBeep(880, 0.5, 0.4)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [misses, raceTime, gatesCleared, gameState, bestTime, timingBreakdown, playBeep, playCrowdNoise, addToLeaderboard, playerName, difficulty, maxCombo, addCredits, isDailyChallenge, earnedBadges, awardBadges, speedLevel, runHistory])

  // Big Air completion handler: add bonus gates, check badges, and transition to finished
  const handleBigAirComplete = useCallback((bonusGates) => {
    setBigAirBonus(bonusGates)
    if (bonusGates > 0) {
      setGatesCleared(prev => prev + bonusGates)
    }
    // Check badges after a finished run (bigAirBonus now known)
    const badgeRun = {
      gates: gatesCleared + bonusGates,
      result: 'finish',
      timing: { ...timingBreakdown },
      maxCombo,
      speedLevel,
      difficulty,
      bigAirBonus: bonusGates,
      isDailyChallenge,
    }
    const newBadgeIds = checkBadges(badgeRun, runHistory, earnedBadges)
    if (newBadgeIds.length > 0) awardBadges(newBadgeIds)
    setCrowdCheering(true)
    setGameState('finished')
  }, [gatesCleared, timingBreakdown, maxCombo, speedLevel, difficulty, isDailyChallenge, runHistory, earnedBadges, awardBadges])

  const startGame = () => {
    initAudio()

    setGates([])
    setGateCount(0)
    setGatesCleared(0)
    setMisses(0)
    setSpeed(speedSettings.INITIAL_SPEED)
    setRaceTime(0)
    setSplitTimes([])
    setLastSplit(null)
    setLastFeedback(null)
    setTimingBreakdown({ perfect: 0, good: 0, early: 0, late: 0, miss: 0 })
    setCrowdCallout(null)
    comboRef.current = 0
    setCombo(0)
    setMaxCombo(0)
    setBigAirBonus(0)
    comboHighlightRef.current = { combo: 0, gateNumber: 0 }
    setComboHighlight({ combo: 0, gateNumber: 0 })
    slowMoRef.current = false
    setSlowMo(false)
    setIsNewRecord(false)
    missesRef.current = 0
    setSkierX(SKIER_CENTER_X)
    setSkierLean(0)
    setSkierTrail([])
    setCarvePhase(null)
    setGroundOffset(0)
    setCrowdCheering(false)
    setShowFinishCrowd(false)
    setCameraShake({ x: 0, y: 0 })
    setHitParticles([])
    setScreenFlash(null)
    setCountdownValue(3)
    lastGateSpawnRef.current = 0
    courseRef.current = generateCourse(difficulty, discipline)
    courseIndexRef.current = 0
    nextGateSideRef.current = 'left'
    nextGateSpacingRef.current =
      courseRef.current.length > 0
        ? courseRef.current[0].spacing
        : diffSettings.MIN_GATE_SPACING || MIN_GATE_SPACING
    gateIdRef.current = 0
    // Arcade mode reset
    setPowerUps([])
    setActivePowerUp(null)
    activePowerUpRef.current = null
    setShieldActive(false)
    shieldActiveRef.current = false
    powerUpIdRef.current = 0
    lastPowerUpSpawnTimeRef.current = 0
    nextPowerUpIntervalRef.current = 15000
    setIsDailyChallenge(false)
    setGameState('countdown')
  }

  const startDailyChallenge = () => {
    initAudio()
    setDifficulty('normal')
    setSpeedLevel('normal')
    setDiscipline('sl')
    setGates([])
    setGateCount(0)
    setGatesCleared(0)
    setMisses(0)
    setSpeed(SPEED_PRESETS.normal.INITIAL_SPEED)
    setRaceTime(0)
    setSplitTimes([])
    setLastSplit(null)
    setLastFeedback(null)
    setTimingBreakdown({ perfect: 0, good: 0, early: 0, late: 0, miss: 0 })
    setCrowdCallout(null)
    comboRef.current = 0
    setCombo(0)
    setMaxCombo(0)
    missesRef.current = 0
    setSkierX(SKIER_CENTER_X)
    setSkierLean(0)
    setSkierTrail([])
    setCarvePhase(null)
    setGroundOffset(0)
    setCrowdCheering(false)
    setShowFinishCrowd(false)
    setCameraShake({ x: 0, y: 0 })
    setHitParticles([])
    setScreenFlash(null)
    setCountdownValue(3)
    lastGateSpawnRef.current = 0
    courseRef.current = generateCourse('normal', 'sl', getDailySeed())
    courseIndexRef.current = 0
    nextGateSideRef.current = 'left'
    nextGateSpacingRef.current =
      courseRef.current.length > 0 ? courseRef.current[0].spacing : MIN_GATE_SPACING
    gateIdRef.current = 0
    // Arcade mode reset
    setPowerUps([])
    setActivePowerUp(null)
    activePowerUpRef.current = null
    setShieldActive(false)
    shieldActiveRef.current = false
    powerUpIdRef.current = 0
    lastPowerUpSpawnTimeRef.current = 0
    nextPowerUpIntervalRef.current = 15000
    setIsDailyChallenge(true)
    setGameState('countdown')
  }

  if (gameState === 'freeride') {
    return (
      <FreeRide
        skierStyle={skierStyle}
        nightMode={nightMode}
        addCredits={addCredits}
        onExit={() => { startLobbyMusic && startLobbyMusic(); setGameState('lobby') }}
      />
    )
  }

  if (gameState === 'lobby') {
    return (
      <Lobby
        onStart={startGame}
        onStartFreeRide={() => { initAudio && initAudio(); stopLobbyMusic && stopLobbyMusic(); setGameState('freeride') }}
        bestScores={bestScores}
        runHistory={runHistory}
        discipline={discipline}
        onDisciplineChange={setDiscipline}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        speedLevel={speedLevel}
        onSpeedChange={setSpeedLevel}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        playerName={playerName}
        onNameChange={(name) => {
          setPlayerName(name)
          try { localStorage.setItem('slalom-playerName', name) } catch {}
        }}
        initAudio={initAudio}
        startLobbyMusic={startLobbyMusic}
        stopLobbyMusic={stopLobbyMusic}
        skierStyle={skierStyle}
        onStyleChange={(newStyle) => {
          setSkierStyle(newStyle)
          try { localStorage.setItem('slalom-skierStyle', JSON.stringify(newStyle)) } catch {}
        }}
        leaderboard={leaderboard}
        credits={credits}
        unlockedItems={unlockedItems}
        onBuyItem={buyItem}
        onEquipItem={equipItem}
        onStartDaily={startDailyChallenge}
        dailyBest={dailyBest}
        arcadeMode={arcadeMode}
        onArcadeModeChange={handleArcadeModeChange}
        ghostEnabled={ghostEnabled}
        onGhostToggle={handleGhostToggle}
        nightMode={nightMode}
        onNightModeToggle={() => setNightMode(prev => !prev)}
        earnedBadges={earnedBadges}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc.id)
          setDifficulty(loc.difficulty)
          setSpeedLevel(loc.speed)
          setNightMode(!!loc.nightMode)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer select-none"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          transform: `translate(${cameraShake.x}px, ${cameraShake.y}px)`
        }}
        onClick={(e) => {
          if (gameState !== 'playing') return
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          handleInput(x < GAME_WIDTH / 2 ? 'left' : 'right')
        }}
      >
        {/* Sky */}
        <div className="absolute inset-0" style={{
          background: nightMode
            ? 'linear-gradient(180deg, #060818 0%, #0d1330 35%, #1b2350 65%, #2a3566 100%)'
            : 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 40%, #dbeafe 70%, #f0f9ff 100%)'
        }} />

        {/* Night sky: stars + moon */}
        {nightMode && (
          <svg className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: 110 }}>
            {NIGHT_STARS.map(s => (
              <circle key={s.id} cx={s.x} cy={s.y} r={s.size} fill="#ffffff" opacity={s.opacity} />
            ))}
            <circle cx="320" cy="32" r="20" fill="#f8fafc" opacity="0.95" />
            <circle cx="313" cy="27" r="20" fill="#1b2350" opacity="0.9" />
          </svg>
        )}

        {/* Mountains */}
        <svg className="absolute top-0 left-0 w-full" style={{ height: 100 }}>
          <polygon points="0,100 40,50 80,75 130,30 180,60 230,40 280,55 340,35 400,100" fill={nightMode ? '#1e293b' : '#94a3b8'} opacity={nightMode ? 0.9 : 0.6} />
          <polygon points="0,100 60,65 110,45 160,70 210,50 270,60 320,45 400,100" fill={nightMode ? '#0f172a' : '#64748b'} opacity={nightMode ? 0.85 : 0.5} />
          <polygon points="130,30 120,45 140,45" fill={nightMode ? '#cbd5e1' : 'white'} opacity="0.7" />
          <polygon points="230,40 220,52 240,52" fill={nightMode ? '#cbd5e1' : 'white'} opacity="0.7" />
          <polygon points="340,35 328,50 352,50" fill={nightMode ? '#cbd5e1' : 'white'} opacity="0.7" />
        </svg>

        {/* Snow slope */}
        <div className="absolute inset-0" style={{
          top: 70,
          background: nightMode
            ? 'linear-gradient(180deg, #3b4a6b 0%, #314061 40%, #28344f 80%, #1c2740 100%)'
            : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 40%, #cbd5e1 80%, #94a3b8 100%)'
        }} />

        {/* Grooming lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: 70 }}>
          {[...Array(18)].map((_, i) => {
            const baseY = i * 40 + groundOffset - 40
            const scale = 0.25 + (baseY / GAME_HEIGHT) * 0.75
            const w = GAME_WIDTH * scale
            const xStart = (GAME_WIDTH - w) / 2
            return (
              <line key={i} x1={xStart + 50} y1={baseY} x2={xStart + w - 50} y2={baseY}
                stroke="#94a3b8" strokeWidth="1" opacity={0.15 + (baseY / GAME_HEIGHT) * 0.15} />
            )
          })}
        </svg>

        {/* Snow sparkles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {SPARKLES.map(s => (
            <circle key={s.id} cx={s.x} cy={s.y} r={s.size} fill="white" opacity={s.opacity} />
          ))}
        </svg>

        {/* Falling snow */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {snowParticles.map(p => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.size} fill="white" opacity={0.7} />
          ))}
        </svg>

        {/* Trees */}
        <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: 45, height: GAME_HEIGHT }}>
          {LEFT_TREES.map(tree => {
            const scrollY = (tree.y + groundOffset * 1.8) % (GAME_HEIGHT + 80) - 40
            return <Tree key={tree.id} x={8 + tree.offset * 0.4} y={scrollY} size={tree.size} flipped={false} nightMode={nightMode} />
          })}
        </svg>
        <svg className="absolute right-0 top-0 pointer-events-none" style={{ width: 45, height: GAME_HEIGHT }}>
          {RIGHT_TREES.map(tree => {
            const scrollY = (tree.y + groundOffset * 1.8) % (GAME_HEIGHT + 80) - 40
            return <Tree key={tree.id} x={37 - tree.offset * 0.4} y={scrollY} size={tree.size} flipped={true} nightMode={nightMode} />
          })}
        </svg>

        {/* Crowd */}
        <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: 55, height: GAME_HEIGHT }}>
          {LEFT_CROWD.map(person => {
            const scrollY = (person.y + groundOffset * 1.3) % (GAME_HEIGHT + 120) - 60
            return <Spectator key={person.id} x={30} y={scrollY} data={person} cheering={crowdCheering} globalCheerPhase={cheerPhase} />
          })}
        </svg>
        <svg className="absolute right-0 top-0 pointer-events-none" style={{ width: 55, height: GAME_HEIGHT }}>
          {RIGHT_CROWD.map(person => {
            const scrollY = (person.y + groundOffset * 1.3) % (GAME_HEIGHT + 120) - 60
            return <Spectator key={person.id} x={22} y={scrollY} data={person} cheering={crowdCheering} globalCheerPhase={cheerPhase} />
          })}
        </svg>

        {/* Safety netting */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="48" y1="0" x2="48" y2={GAME_HEIGHT} stroke="#f97316" strokeWidth="2" opacity="0.7" />
          <line x1={GAME_WIDTH - 48} y1="0" x2={GAME_WIDTH - 48} y2={GAME_HEIGHT} stroke="#f97316" strokeWidth="2" opacity="0.7" />
        </svg>

        {/* Timing zone indicator */}
        {gameState === 'playing' && (
          <div className="absolute left-12 right-12 border-t-2 border-dashed" style={{ top: OPTIMAL_HIT_Y, borderColor: 'rgba(34, 197, 94, 0.5)' }} />
        )}

        {/* Skier trail */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {skierTrail.length > 2 && (
            <>
              <path
                d={`M ${skierTrail.map((p, i) => `${p.x + 1} ${p.y - (skierTrail.length - i) * speed * 0.5 + 1}`).join(' L ')}`}
                fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d={`M ${skierTrail.map((p, i) => `${p.x} ${p.y - (skierTrail.length - i) * speed * 0.5}`).join(' L ')}`}
                fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              />
            </>
          )}
          {Math.abs(skierLean) > 0.5 && [...Array(8)].map((_, i) => (
            <circle key={i}
              cx={skierX + (skierLean * -25) + (Math.random() - 0.5) * 20}
              cy={SKIER_Y + 8 + Math.random() * 15}
              r={2 + Math.random() * 4} fill="white" opacity={0.5 + Math.random() * 0.3}
            />
          ))}
        </svg>

        {/* Gates */}
        {gates.map(gate => (
          <SlalomGate key={gate.id} x={gate.x} y={gate.y} outerX={gate.outerX} side={gate.side} hit={gate.hit} hitTime={gate.hitTime} discipline={gate.discipline || discipline} />
        ))}

        {/* Arcade Power-ups */}
        {arcadeMode && powerUps.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 12 }}>
            {powerUps.map(pu => {
              const POWER_UP_CONFIG = {
                magnet: { color: '#3b82f6', glow: '#60a5fa', emoji: '🧲' },
                rocket: { color: '#f97316', glow: '#fb923c', emoji: '🚀' },
                shield: { color: '#22c55e', glow: '#4ade80', emoji: '🛡️' },
              }
              const cfg = POWER_UP_CONFIG[pu.type]
              const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 300)
              return (
                <g key={pu.id}>
                  <circle cx={pu.x} cy={pu.y} r={22} fill={cfg.glow} opacity={0.25 * pulse} />
                  <circle cx={pu.x} cy={pu.y} r={16} fill={cfg.color} opacity={0.85} />
                  <circle cx={pu.x} cy={pu.y} r={16} fill="none" stroke={cfg.glow} strokeWidth="2" opacity={0.9} />
                  <text x={pu.x} y={pu.y + 6} textAnchor="middle" fontSize="14">{cfg.emoji}</text>
                </g>
              )
            })}
          </svg>
        )}

        {/* Skier */}
        <Skier lean={skierLean} x={skierX} style={skierStyle} combo={combo} />

        {/* Hit particles */}
        {hitParticles.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }}>
            {hitParticles.map(p => (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={3 + p.life * 2}
                fill={p.color}
                opacity={p.life * 0.9}
              />
            ))}
          </svg>
        )}

        {/* Screen flash overlay (miss = red, new record = white) */}
        {screenFlash && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: screenFlash.color,
              opacity: screenFlash.opacity,
              zIndex: 25,
            }}
          />
        )}

        {/* Slow-mo cinematic vignette overlay */}
        {slowMo && gameState === 'playing' && (
          <div className="absolute inset-0 pointer-events-none slow-mo-vignette" style={{ zIndex: 24 }} />
        )}

        {/* Feedback */}
        {lastFeedback && (
          <div key={lastFeedback.id} className="absolute left-1/2 text-2xl font-bold pointer-events-none feedback-pop"
            style={{ top: OPTIMAL_HIT_Y - 50, transform: 'translateX(-50%)', color: lastFeedback.color,
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            {lastFeedback.text}
            {lastFeedback.penalty > 0 && <span className="text-sm ml-1">+{lastFeedback.penalty.toFixed(2)}s</span>}
          </div>
        )}

        {/* Crowd callout speech bubble */}
        {crowdCallout && (
          <div
            key={crowdCallout.id}
            className="absolute pointer-events-none crowd-callout"
            style={{
              top: 200 + Math.floor((crowdCallout.id % 7) * 28),
              ...(crowdCallout.side === 'left'
                ? { left: 4 }
                : { right: 4 }),
              maxWidth: 110,
              zIndex: 50,
            }}
          >
            {/* Bubble body */}
            <div style={{
              background: 'white',
              borderRadius: 10,
              padding: '5px 9px',
              fontSize: 11,
              fontWeight: 700,
              color: '#1e293b',
              lineHeight: 1.2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              whiteSpace: 'nowrap',
            }}>
              {crowdCallout.text}
            </div>
            {/* Triangle pointer toward the course edge */}
            <div style={{
              width: 0,
              height: 0,
              borderTop: '6px solid white',
              borderLeft: crowdCallout.side === 'left' ? '6px solid transparent' : 'none',
              borderRight: crowdCallout.side === 'right' ? '6px solid transparent' : 'none',
              marginLeft: crowdCallout.side === 'left' ? 12 : 'auto',
              marginRight: crowdCallout.side === 'right' ? 12 : 'auto',
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))',
            }} />
          </div>
        )}

        {/* HUD */}
        {gameState === 'playing' && (
          <HUD raceTime={raceTime} gatesCleared={gatesCleared} speed={speed} misses={misses} bestTime={bestTime} maxTime={MAX_RACE_TIME} difficulty={difficulty} discipline={discipline} combo={combo} />
        )}

        {/* Arcade power-up HUD indicators */}
        {arcadeMode && gameState === 'playing' && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none" style={{ zIndex: 30 }}>
            {shieldActive && (
              <div className="flex items-center gap-1 bg-green-900/80 border border-green-400/60 px-2 py-1 rounded-lg text-green-300 text-xs font-bold">
                🛡️ SHIELD
              </div>
            )}
            {activePowerUp?.type === 'rocket' && (
              <div className="flex items-center gap-1 bg-orange-900/80 border border-orange-400/60 px-2 py-1 rounded-lg text-orange-300 text-xs font-bold">
                🚀 WAX
              </div>
            )}
            {activePowerUp?.type === 'magnet' && (
              <div className="flex items-center gap-1 bg-blue-900/80 border border-blue-400/60 px-2 py-1 rounded-lg text-blue-300 text-xs font-bold">
                🧲 MAGNET
              </div>
            )}
            {arcadeMode && !shieldActive && !activePowerUp && (
              <div className="bg-purple-900/50 border border-purple-500/30 px-2 py-1 rounded-lg text-purple-400/60 text-xs font-bold">
                ⚡ ARCADE
              </div>
            )}
          </div>
        )}

        {/* Restart button during gameplay */}
        {gameState === 'playing' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              startGame()
            }}
            className="absolute top-2 right-2 px-3 py-1 bg-slate-800/70 hover:bg-slate-700/80 text-white text-xs rounded transition-colors"
          >
            Restart
          </button>
        )}

        {/* Finish line crowd */}
        {showFinishCrowd && gameState === 'playing' && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            {/* Finish line banner */}
            <div className="absolute bottom-24 left-12 right-12 h-8 flex">
              <div className="flex-1 bg-gradient-to-r from-black via-white to-black bg-[length:20px_100%] opacity-80" />
            </div>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white font-bold text-lg bg-red-600 px-4 py-1 rounded shadow-lg">
              FINISH
            </div>

            {/* Dense crowd at finish */}
            <svg className="w-full h-32" viewBox="0 0 400 128">
              {/* Left crowd */}
              {[...Array(12)].map((_, i) => {
                const x = 15 + (i % 3) * 12 + Math.random() * 5
                const y = 60 + Math.floor(i / 3) * 18
                const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']
                const color = colors[i % colors.length]
                const bounce = crowdCheering ? Math.sin(cheerPhase + i) * 3 : 0
                return (
                  <g key={`left-${i}`} transform={`translate(${x}, ${y + bounce})`}>
                    <circle cx="0" cy="-8" r="4" fill="#fcd9b6" />
                    <rect x="-5" y="-4" width="10" height="12" rx="2" fill={color} />
                    {crowdCheering && (
                      <>
                        <line x1="-5" y1="-2" x2="-9" y2={-8 - Math.sin(cheerPhase + i) * 4} stroke={color} strokeWidth="2" />
                        <line x1="5" y1="-2" x2="9" y2={-8 - Math.cos(cheerPhase + i) * 4} stroke={color} strokeWidth="2" />
                      </>
                    )}
                  </g>
                )
              })}
              {/* Right crowd */}
              {[...Array(12)].map((_, i) => {
                const x = 355 + (i % 3) * 12 + Math.random() * 5
                const y = 60 + Math.floor(i / 3) * 18
                const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']
                const color = colors[(i + 3) % colors.length]
                const bounce = crowdCheering ? Math.sin(cheerPhase + i + 1) * 3 : 0
                return (
                  <g key={`right-${i}`} transform={`translate(${x}, ${y + bounce})`}>
                    <circle cx="0" cy="-8" r="4" fill="#fcd9b6" />
                    <rect x="-5" y="-4" width="10" height="12" rx="2" fill={color} />
                    {crowdCheering && (
                      <>
                        <line x1="-5" y1="-2" x2="-9" y2={-8 - Math.sin(cheerPhase + i + 1) * 4} stroke={color} strokeWidth="2" />
                        <line x1="5" y1="-2" x2="9" y2={-8 - Math.cos(cheerPhase + i + 1) * 4} stroke={color} strokeWidth="2" />
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        )}

        {/* Game Screens */}
        {gameState === 'countdown' && <CountdownScreen value={countdownValue} />}
        {gameState === 'bigAir' && (
          <BigAir skierStyle={skierStyle} onComplete={handleBigAirComplete} />
        )}
        {gameState === 'finished' && (
          <FinishScreen bestTime={bestTime} gatesCleared={gatesCleared} misses={misses} timingBreakdown={timingBreakdown} maxCombo={maxCombo} creditsEarned={lastRunCredits} isNewRecord={isNewRecord} comboHighlight={comboHighlight} bigAirBonus={bigAirBonus} isDailyChallenge={isDailyChallenge} onRestart={startGame} onLobby={() => setGameState('lobby')} />
        )}
        {gameState === 'gameOver' && <GameOverScreen gatesCleared={gatesCleared} timingBreakdown={timingBreakdown} maxCombo={maxCombo} creditsEarned={lastRunCredits} onRestart={startGame} onLobby={() => setGameState('lobby')} />}
      </div>

      {/* Controls hint */}
      <div className="mt-3 text-slate-500 text-xs text-center">
        A/← Left • D/→ Right • Space to start
      </div>
    </div>
  )
}
