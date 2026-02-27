import { useState, useEffect, useCallback, useRef } from 'react'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  SKIER_Y,
  GATE_SPAWN_Y,
  OPTIMAL_HIT_Y,
  GATE_Y,
  INITIAL_SPEED,
  TURN_DECELERATION,
  TOTAL_GATES,
  SKIER_CENTER_X,
  LEFT_POSITION,
  RIGHT_POSITION,
  PENALTIES,
  DIFFICULTY_PRESETS,
} from '../config/gameSettings'
import { useAudio } from '../hooks/useAudio'
import { generateSnowParticles, generateSparkles, generateTrees, generateCrowd } from '../utils/generators'
import Skier from './Skier'
import SlalomGate from './SlalomGate'
import Spectator from './Spectator'
import Tree from './Tree'
import HUD from './HUD'
import { StartScreen, CountdownScreen, FinishScreen, GameOverScreen, PausedScreen } from './GameScreens'

const SPARKLES = generateSparkles(40)
const LEFT_TREES = generateTrees(6)
const RIGHT_TREES = generateTrees(6)
const LEFT_CROWD = generateCrowd(15)
const RIGHT_CROWD = generateCrowd(15)

export default function SlalomTrainer() {
  const [gameState, setGameState] = useState('start')
  const [countdownValue, setCountdownValue] = useState(3)
  const [difficulty, setDifficulty] = useState('normal')
  const [practiceMode, setPracticeMode] = useState(false)

  const [gates, setGates] = useState([])
  const [gateCount, setGateCount] = useState(0)
  const [gatesCleared, setGatesCleared] = useState(0)
  const [misses, setMisses] = useState(0)
  const [combo, setCombo] = useState(1)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [groundOffset, setGroundOffset] = useState(0)
  const [raceTime, setRaceTime] = useState(0)
  const [splitTimes, setSplitTimes] = useState([])
  const [lastSplit, setLastSplit] = useState(null)
  const [bestTime, setBestTime] = useState(null)

  const [skierX, setSkierX] = useState(SKIER_CENTER_X)
  const [skierLean, setSkierLean] = useState(0)
  const [skierTrail, setSkierTrail] = useState([])
  const [carvePhase, setCarvePhase] = useState(null)

  const [crowdCheering, setCrowdCheering] = useState(false)
  const [cheerPhase, setCheerPhase] = useState(0)
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 })
  const [snowParticles, setSnowParticles] = useState(() => generateSnowParticles(30))
  const [sprayParticles, setSprayParticles] = useState([])
  const [lastFeedback, setLastFeedback] = useState(null)

  const { initAudio, playBeep, playCarveSound, playGateHit } = useAudio()

  const gameLoopRef = useRef(null)
  const carveAnimationRef = useRef(null)
  const raceStartTimeRef = useRef(null)
  const lastGateSpawnRef = useRef(0)
  const nextGateSideRef = useRef('left')
  const nextGateSpacingRef = useRef(150)
  const gateIdRef = useRef(0)
  const cheerTimeoutRef = useRef(null)
  const sprayIdRef = useRef(0)

  const activePreset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.normal

  const modeLabel = activePreset.label

  const nextGate = gates.find((g) => !g.hit)
  const nextGateProgress = nextGate
    ? Math.max(0, Math.min(1, (nextGate.y - GATE_SPAWN_Y) / (OPTIMAL_HIT_Y - GATE_SPAWN_Y)))
    : 1

  const spawnSpray = useCallback((originX, originY, intensity = 1) => {
    const count = 8 + Math.floor(intensity * 8)
    const burst = Array.from({ length: count }, () => {
      sprayIdRef.current += 1
      return {
        id: sprayIdRef.current,
        x: originX + (Math.random() - 0.5) * 14,
        y: originY + Math.random() * 8,
        vx: (Math.random() - 0.5) * (1.2 + intensity * 1.2),
        vy: -0.3 - Math.random() * (1.4 + intensity * 0.9),
        life: 22 + Math.random() * 14,
        size: 1 + Math.random() * 2.8,
      }
    })
    setSprayParticles((prev) => [...prev, ...burst])
  }, [])

  // Countdown sequence
  useEffect(() => {
    if (gameState !== 'countdown') return

    initAudio()

    if (countdownValue > 0) {
      playBeep(440, 0.2, 0.3)
      const timer = setTimeout(() => setCountdownValue(countdownValue - 1), 1000)
      return () => clearTimeout(timer)
    }

    playBeep(880, 0.4, 0.4)
    raceStartTimeRef.current = Date.now()
    setGameState('playing')
  }, [gameState, countdownValue, initAudio, playBeep])

  // Update race time
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setRaceTime(Date.now() - raceStartTimeRef.current)
    }, 10)

    return () => clearInterval(timer)
  }, [gameState])

  // Animate cheering
  useEffect(() => {
    if (!crowdCheering) return

    let animationId
    const animateCheer = () => {
      setCheerPhase((prev) => prev + 0.15)
      animationId = requestAnimationFrame(animateCheer)
    }

    animationId = requestAnimationFrame(animateCheer)
    return () => cancelAnimationFrame(animationId)
  }, [crowdCheering])

  // Falling snow
  useEffect(() => {
    if (gameState !== 'playing') return

    const animateSnow = () => {
      setSnowParticles((particles) =>
        particles.map((p) => ({
          ...p,
          y: (p.y + p.speed + speed * 0.45) % GAME_HEIGHT,
          x: ((p.x + p.drift + skierLean * 0.25) + GAME_WIDTH) % GAME_WIDTH,
        })),
      )
    }

    const interval = setInterval(animateSnow, 50)
    return () => clearInterval(interval)
  }, [gameState, speed, skierLean])

  // Spray particles update
  useEffect(() => {
    if (gameState !== 'playing' && sprayParticles.length === 0) return

    const tick = setInterval(() => {
      setSprayParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.06,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0),
      )
    }, 16)

    return () => clearInterval(tick)
  }, [gameState, sprayParticles.length])

  // Camera shake decay
  useEffect(() => {
    if (cameraShake.x === 0 && cameraShake.y === 0) return

    const timer = setTimeout(() => {
      setCameraShake((prev) => ({ x: prev.x * 0.85, y: prev.y * 0.85 }))
    }, 16)

    return () => clearTimeout(timer)
  }, [cameraShake])

  // Carve animation
  useEffect(() => {
    if (!carvePhase) return

    const animateCarve = () => {
      setCarvePhase((prev) => {
        if (!prev) return null

        const newProgress = prev.progress + 0.03

        if (newProgress >= 1) {
          if (prev.phase === 'approach') {
            return {
              phase: 'gate',
              startX: prev.targetX,
              targetX: prev.gateX + (prev.gateSide === 'left' ? 20 : -20),
              progress: 0,
              gateX: prev.gateX,
              gateSide: prev.gateSide,
              exitX: prev.exitX,
            }
          }

          if (prev.phase === 'gate') {
            return {
              phase: 'exit',
              startX: prev.targetX,
              targetX: prev.exitX,
              progress: 0,
              gateX: prev.gateX,
              gateSide: prev.gateSide,
              exitX: prev.exitX,
            }
          }

          return null
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

  useEffect(() => {
    if (!carvePhase) return

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2)
    const easedProgress = easeInOutCubic(carvePhase.progress)
    const newX = carvePhase.startX + (carvePhase.targetX - carvePhase.startX) * easedProgress

    setSkierX(newX)

    const direction = carvePhase.targetX - carvePhase.startX
    const leanIntensity = carvePhase.phase === 'gate' ? 1.3 : 0.7
    setSkierLean(Math.sign(direction) * leanIntensity)

    if (Math.abs(direction) > 5 && carvePhase.progress < 0.1) {
      playCarveSound(Math.abs(leanIntensity))
      spawnSpray(newX, SKIER_Y + 12, Math.abs(leanIntensity))
    }

    if (gameState === 'playing') {
      setSkierTrail((trail) => {
        const newPoint = { x: newX, y: SKIER_Y, age: 0 }
        return [...trail, newPoint]
          .map((p) => ({ ...p, age: p.age + 1 }))
          .filter((p) => p.age < 35)
          .slice(-35)
      })
    }
  }, [carvePhase, gameState, playCarveSound, spawnSpray])

  useEffect(() => {
    if (!carvePhase) setSkierLean((prev) => prev * 0.9)
  }, [carvePhase])

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'playing') {
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
        return 'paused'
      }
      if (prev === 'paused') {
        return 'playing'
      }
      return prev
    })
  }, [])

  const handleInput = useCallback((inputSide) => {
    if (gameState !== 'playing') return

    setGates((prev) => {
      const updated = [...prev]
      const targetGate = updated.find(
        (g) =>
          !g.hit &&
          g.side === inputSide &&
          g.y > OPTIMAL_HIT_Y - activePreset.lateWindow &&
          g.y < GATE_Y + 25,
      )

      if (targetGate) {
        targetGate.hit = true
        targetGate.hitTime = Date.now()

        playGateHit()
        setCameraShake({ x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 4 })

        const isLeftGate = inputSide === 'left'
        const approachX = isLeftGate ? RIGHT_POSITION : LEFT_POSITION
        const exitX = isLeftGate ? LEFT_POSITION : RIGHT_POSITION

        setCarvePhase({
          phase: 'approach',
          startX: skierX,
          targetX: approachX,
          progress: 0,
          gateX: targetGate.x,
          gateSide: inputSide,
          exitX,
        })

        setSpeed((prevSpeed) => Math.max(activePreset.initialSpeed, prevSpeed - activePreset.turnDeceleration))

        const distance = Math.abs(targetGate.y - OPTIMAL_HIT_Y)
        const currentTime = Date.now() - raceStartTimeRef.current

        let timePenalty = 0
        let feedback = ''
        let feedbackColor = ''
        let comboDelta = 0

        if (distance <= activePreset.perfectWindow) {
          feedback = 'PERFECT'
          feedbackColor = '#22c55e'
          comboDelta = 0.3
          setCrowdCheering(true)
          if (cheerTimeoutRef.current) clearTimeout(cheerTimeoutRef.current)
          cheerTimeoutRef.current = setTimeout(() => setCrowdCheering(false), 1200)
        } else if (distance <= activePreset.goodWindow) {
          timePenalty = PENALTIES.GOOD
          feedback = 'GOOD'
          feedbackColor = '#3b82f6'
          comboDelta = 0.15
        } else if (distance <= activePreset.lateWindow) {
          timePenalty = PENALTIES.LATE
          feedback = distance < OPTIMAL_HIT_Y ? 'EARLY' : 'LATE'
          feedbackColor = '#f59e0b'
          comboDelta = -0.2
        }

        setCombo((prevCombo) => Math.max(1, Math.min(2.5, prevCombo + comboDelta)))
        setLastFeedback({ text: feedback, color: feedbackColor, penalty: timePenalty, id: Date.now() })
        setGatesCleared((value) => value + 1)

        const splitTime = currentTime + timePenalty * 1000
        setSplitTimes((times) => [...times, splitTime])
        setLastSplit({ time: splitTime, gate: gatesCleared + 1 })
      } else {
        const wobbleX = inputSide === 'left' ? skierX - 15 : skierX + 15
        setCarvePhase({
          phase: 'exit',
          startX: skierX,
          targetX: wobbleX,
          progress: 0,
          gateX: skierX,
          gateSide: inputSide,
          exitX: skierX,
        })
        setCombo((prevCombo) => Math.max(1, prevCombo - 0.2))
      }

      return updated
    })
  }, [gameState, activePreset, playGateHit, skierX, gatesCleared])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return

      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        if (gameState === 'playing' || gameState === 'paused') {
          e.preventDefault()
          togglePause()
        }
        return
      }

      if (gameState === 'paused') return

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleInput('left')
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleInput('right')
      } else if (e.key === ' ' && (gameState === 'start' || gameState === 'finished' || gameState === 'gameOver')) {
        startGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleInput, gameState, togglePause])

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = () => {
      setGroundOffset((prev) => (prev + speed) % 40)
      setSpeed((prev) => Math.min(activePreset.maxSpeed, prev + activePreset.acceleration))

      setGates((prev) => {
        let newMisses = 0
        let updated = prev.map((gate) => ({ ...gate, y: gate.y + speed }))

        updated = updated.filter((gate) => {
          if (!gate.hit && gate.y > GATE_Y + 40) {
            newMisses++
            return false
          }
          return gate.y < GAME_HEIGHT + 80
        })

        if (newMisses > 0) {
          setMisses((value) => value + newMisses)
          setCombo((value) => Math.max(1, value - 0.4))
          setLastFeedback({ text: 'MISS', color: '#ef4444', penalty: PENALTIES.MISS, id: Date.now() })
          spawnSpray(skierX + (Math.random() - 0.5) * 24, SKIER_Y + 14, 1.2)
        }

        if (gateCount < TOTAL_GATES) {
          lastGateSpawnRef.current += speed
          if (lastGateSpawnRef.current >= nextGateSpacingRef.current) {
            const side = nextGateSideRef.current
            nextGateSideRef.current = side === 'left' ? 'right' : 'left'

            const baseX = side === 'left' ? GAME_WIDTH * 0.32 : GAME_WIDTH * 0.68
            const variation = (Math.random() - 0.5) * 25

            gateIdRef.current += 1

            const newGate = {
              id: gateIdRef.current,
              y: GATE_SPAWN_Y,
              x: baseX + variation,
              side,
              hit: false,
              hitTime: null,
              gateNumber: gateCount + 1,
            }

            updated = [...updated, newGate]
            setGateCount((count) => count + 1)

            nextGateSpacingRef.current = activePreset.minGateSpacing + Math.random() * (activePreset.maxGateSpacing - activePreset.minGateSpacing)
            lastGateSpawnRef.current = 0
          }
        }

        return updated
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, speed, gateCount, activePreset, spawnSpray, skierX])

  // Check finish/game over
  useEffect(() => {
    if (gameState !== 'playing') return

    if (!practiceMode && misses >= activePreset.maxMisses) {
      setGameState('gameOver')
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    } else if (gatesCleared >= TOTAL_GATES) {
      const finalTime = Date.now() - raceStartTimeRef.current
      setRaceTime(finalTime)
      if (!bestTime || finalTime < bestTime) {
        setBestTime(finalTime)
      }
      setGameState('finished')
      setCrowdCheering(true)
      playBeep(880, 0.5, 0.4)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [misses, gatesCleared, gameState, bestTime, playBeep, activePreset, practiceMode])

  const startGame = () => {
    initAudio()

    setGates([])
    setGateCount(0)
    setGatesCleared(0)
    setMisses(0)
    setCombo(1)
    setSpeed(activePreset.initialSpeed)
    setRaceTime(0)
    setSplitTimes([])
    setLastSplit(null)
    setLastFeedback(null)
    setSkierX(SKIER_CENTER_X)
    setSkierLean(0)
    setSkierTrail([])
    setCarvePhase(null)
    setGroundOffset(0)
    setCrowdCheering(false)
    setCameraShake({ x: 0, y: 0 })
    setCountdownValue(3)
    setSprayParticles([])

    lastGateSpawnRef.current = 0
    nextGateSideRef.current = 'left'
    nextGateSpacingRef.current = activePreset.maxGateSpacing
    gateIdRef.current = 0

    setGameState('countdown')
  }

  const cameraZoom = gameState === 'playing'
    ? Math.min(1.04, 1 + (speed - activePreset.initialSpeed) * 0.015)
    : 1

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer select-none"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          transform: `translate(${cameraShake.x}px, ${cameraShake.y}px) scale(${cameraZoom})`,
          transformOrigin: 'center 60%',
          boxShadow: '0 16px 45px rgba(2,6,23,0.65)',
        }}
        onClick={(e) => {
          if (gameState !== 'playing') return
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          handleInput(x < GAME_WIDTH / 2 ? 'left' : 'right')
        }}
      >
        {/* Sky */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 38%, #dbeafe 68%, #f8fafc 100%)',
          }}
        />

        {/* Sun bloom */}
        <div className="absolute top-[-80px] right-[-60px] w-52 h-52 rounded-full bg-white/30 blur-2xl pointer-events-none" />

        {/* Mountains - parallax */}
        <svg className="absolute top-0 left-0 w-full" style={{ height: 120, transform: `translateX(${(-groundOffset * 0.12) % 32}px)` }}>
          <polygon points="0,118 40,50 80,75 130,30 180,60 230,40 280,55 340,35 400,118" fill="#94a3b8" opacity="0.68" />
          <polygon points="0,118 60,65 110,45 160,70 210,50 270,60 320,45 400,118" fill="#64748b" opacity="0.55" />
          <polygon points="130,30 120,45 140,45" fill="white" opacity="0.7" />
          <polygon points="230,40 220,52 240,52" fill="white" opacity="0.7" />
          <polygon points="340,35 328,50 352,50" fill="white" opacity="0.7" />
        </svg>

        {/* Snow slope */}
        <div
          className="absolute inset-0"
          style={{
            top: 74,
            background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 42%, #cbd5e1 82%, #94a3b8 100%)',
          }}
        />

        {/* Vignette for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(2,6,23,0.3) 100%)' }} />

        {/* Grooming lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: 70 }}>
          {[...Array(20)].map((_, i) => {
            const baseY = i * 36 + groundOffset - 40
            const scale = 0.25 + (baseY / GAME_HEIGHT) * 0.75
            const w = GAME_WIDTH * scale
            const xStart = (GAME_WIDTH - w) / 2
            return (
              <line
                key={i}
                x1={xStart + 48}
                y1={baseY}
                x2={xStart + w - 48}
                y2={baseY}
                stroke="#94a3b8"
                strokeWidth="1"
                opacity={0.12 + (baseY / GAME_HEIGHT) * 0.2}
              />
            )
          })}
        </svg>

        {/* Snow sparkles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {SPARKLES.map((s) => (
            <circle key={s.id} cx={s.x} cy={s.y} r={s.size} fill="white" opacity={s.opacity} />
          ))}
        </svg>

        {/* Falling snow */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {snowParticles.map((p) => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.size} fill="white" opacity={0.66} />
          ))}
        </svg>

        {/* Trees */}
        <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: 50, height: GAME_HEIGHT }}>
          {LEFT_TREES.map((tree) => {
            const scrollY = (tree.y + groundOffset * 1.9) % (GAME_HEIGHT + 80) - 40
            return <Tree key={tree.id} x={8 + tree.offset * 0.4} y={scrollY} size={tree.size} flipped={false} />
          })}
        </svg>
        <svg className="absolute right-0 top-0 pointer-events-none" style={{ width: 50, height: GAME_HEIGHT }}>
          {RIGHT_TREES.map((tree) => {
            const scrollY = (tree.y + groundOffset * 1.9) % (GAME_HEIGHT + 80) - 40
            return <Tree key={tree.id} x={40 - tree.offset * 0.4} y={scrollY} size={tree.size} flipped={true} />
          })}
        </svg>

        {/* Crowd */}
        <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: 58, height: GAME_HEIGHT }}>
          {LEFT_CROWD.map((person) => {
            const scrollY = (person.y + groundOffset * 1.35) % (GAME_HEIGHT + 120) - 60
            return <Spectator key={person.id} x={30} y={scrollY} data={person} cheering={crowdCheering} globalCheerPhase={cheerPhase} />
          })}
        </svg>
        <svg className="absolute right-0 top-0 pointer-events-none" style={{ width: 58, height: GAME_HEIGHT }}>
          {RIGHT_CROWD.map((person) => {
            const scrollY = (person.y + groundOffset * 1.35) % (GAME_HEIGHT + 120) - 60
            return <Spectator key={person.id} x={24} y={scrollY} data={person} cheering={crowdCheering} globalCheerPhase={cheerPhase} />
          })}
        </svg>

        {/* Safety netting */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="48" y1="0" x2="48" y2={GAME_HEIGHT} stroke="#f97316" strokeWidth="2" opacity="0.72" />
          <line x1={GAME_WIDTH - 48} y1="0" x2={GAME_WIDTH - 48} y2={GAME_HEIGHT} stroke="#f97316" strokeWidth="2" opacity="0.72" />
        </svg>

        {/* Timing zone indicator */}
        {gameState === 'playing' && (
          <div className="absolute left-12 right-12 border-t-2 border-dashed" style={{ top: OPTIMAL_HIT_Y, borderColor: 'rgba(34, 197, 94, 0.6)' }} />
        )}

        {/* Skier trail + spray */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {skierTrail.length > 2 && (
            <>
              <path
                d={`M ${skierTrail.map((p, i) => `${p.x + 1} ${p.y - (skierTrail.length - i) * speed * 0.5 + 1}`).join(' L ')}`}
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`M ${skierTrail.map((p, i) => `${p.x} ${p.y - (skierTrail.length - i) * speed * 0.5}`).join(' L ')}`}
                fill="none"
                stroke="rgba(148,163,184,0.6)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {sprayParticles.map((p) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill="white"
              opacity={Math.max(0, p.life / 35)}
            />
          ))}

          {Math.abs(skierLean) > 0.5 &&
            [...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx={skierX + skierLean * -25 + (Math.random() - 0.5) * 20}
                cy={SKIER_Y + 8 + Math.random() * 15}
                r={2 + Math.random() * 4}
                fill="white"
                opacity={0.45 + Math.random() * 0.3}
              />
            ))}
        </svg>

        {/* Gates */}
        {gates.map((gate) => (
          <SlalomGate key={gate.id} x={gate.x} y={gate.y} side={gate.side} hit={gate.hit} hitTime={gate.hitTime} speed={speed} />
        ))}

        {/* Skier */}
        <Skier lean={skierLean} x={skierX} speed={speed} frame={Math.floor(raceTime / 80)} />

        {/* Feedback */}
        {lastFeedback && (
          <div
            key={lastFeedback.id}
            className="absolute left-1/2 text-2xl font-bold pointer-events-none feedback-pop"
            style={{
              top: OPTIMAL_HIT_Y - 52,
              transform: 'translateX(-50%)',
              color: lastFeedback.color,
              textShadow: '1px 1px 4px rgba(0,0,0,0.55)',
            }}
          >
            {lastFeedback.text}
            {lastFeedback.penalty > 0 && <span className="text-sm ml-1">+{lastFeedback.penalty.toFixed(2)}s</span>}
          </div>
        )}

        {/* HUD */}
        {gameState === 'playing' && (
          <HUD
            raceTime={raceTime}
            gatesCleared={gatesCleared}
            speed={speed}
            misses={misses}
            bestTime={bestTime}
            modeLabel={modeLabel}
            practiceMode={practiceMode}
            combo={combo}
            nextGateProgress={nextGateProgress}
          />
        )}

        {/* Screens */}
        {gameState === 'countdown' && <CountdownScreen value={countdownValue} />}
        {gameState === 'start' && (
          <StartScreen
            onStart={startGame}
            bestTime={bestTime}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            practiceMode={practiceMode}
            setPracticeMode={setPracticeMode}
          />
        )}
        {gameState === 'paused' && <PausedScreen onResume={togglePause} onRestart={startGame} />}
        {gameState === 'finished' && (
          <FinishScreen
            raceTime={raceTime}
            bestTime={bestTime}
            gatesCleared={gatesCleared}
            misses={misses}
            onRestart={startGame}
            modeLabel={modeLabel}
            practiceMode={practiceMode}
          />
        )}
        {gameState === 'gameOver' && <GameOverScreen gatesCleared={gatesCleared} onRestart={startGame} modeLabel={modeLabel} />}
      </div>

      <div className="mt-3 text-slate-500 text-xs text-center">
        A/← Left • D/→ Right • Space start • Esc/P pause
      </div>
    </div>
  )
}
