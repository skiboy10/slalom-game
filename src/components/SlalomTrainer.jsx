import { useState, useEffect, useCallback, useRef } from 'react'
import {
  GAME_HEIGHT, GAME_WIDTH, SKIER_Y, GATE_SPAWN_Y, OPTIMAL_HIT_Y, GATE_Y,
  PERFECT_WINDOW, GOOD_WINDOW, LATE_WINDOW,
  INITIAL_SPEED, MAX_SPEED, ACCELERATION, TURN_DECELERATION,
  MIN_GATE_SPACING, MAX_GATE_SPACING, TOTAL_GATES, MAX_RACE_TIME,
  SKIER_CENTER_X, LEFT_POSITION, RIGHT_POSITION, MAX_MISSES,
  DIFFICULTY_PRESETS
} from '../config/gameSettings'
import { useAudio } from '../hooks/useAudio'
import { generateSnowParticles, generateSparkles, generateTrees, generateCrowd, generateCourse } from '../utils/generators'
import Skier from './Skier'
import SlalomGate from './SlalomGate'
import Spectator from './Spectator'
import Tree from './Tree'
import HUD from './HUD'
import { CountdownScreen, FinishScreen, GameOverScreen } from './GameScreens'
import Lobby from './Lobby'

// Pre-generate static elements
const SPARKLES = generateSparkles(40)
const LEFT_TREES = generateTrees(6)
const RIGHT_TREES = generateTrees(6)
const LEFT_CROWD = generateCrowd(15)
const RIGHT_CROWD = generateCrowd(15)

export default function SlalomTrainer() {
  const [difficulty, setDifficulty] = useState('normal')
  const diffSettings = DIFFICULTY_PRESETS[difficulty]

  const [gameState, setGameState] = useState('lobby')
  const [soundEnabled, setSoundEnabled] = useState(true)
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
  const bestTime = bestScores[difficulty] || null
  const [runHistory, setRunHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('slalom-runHistory')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  const [skierX, setSkierX] = useState(SKIER_CENTER_X)
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

  const { initAudio, playBeep, playCarveSound, playGateHit, playCrowdNoise } = useAudio()

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

      // Show finish crowd in the last 5 seconds
      if (currentTime >= MAX_RACE_TIME - 10000 && !showFinishCrowd) {
        setShowFinishCrowd(true)
        setCrowdCheering(true)
      }
    }, 10)

    return () => clearInterval(timer)
  }, [gameState, showFinishCrowd])

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
          exitX: exitX
        })

        setSpeed(prev => Math.max(diffSettings.INITIAL_SPEED, prev - TURN_DECELERATION))

        const distance = Math.abs(targetGate.y - OPTIMAL_HIT_Y)
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
        } else if (distance <= diffSettings.GOOD_WINDOW) {
          timePenalty = 0.15
          feedback = 'GOOD'
          feedbackColor = '#3b82f6'
          setTimingBreakdown(prev => ({ ...prev, good: prev.good + 1 }))
        } else if (distance <= diffSettings.LATE_WINDOW) {
          timePenalty = 0.35
          feedback = distance < OPTIMAL_HIT_Y ? 'EARLY' : 'LATE'
          feedbackColor = '#f59e0b'
          setTimingBreakdown(prev => {
            const key = distance < OPTIMAL_HIT_Y ? 'early' : 'late'
            return { ...prev, [key]: prev[key] + 1 }
          })
        }

        setLastFeedback({ text: feedback, color: feedbackColor, penalty: timePenalty, id: Date.now() })
        setGatesCleared(prev => prev + 1)

        const splitTime = currentTime + timePenalty * 1000
        setSplitTimes(prev => [...prev, splitTime])
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
          exitX: skierX
        })
      }

      return updated
    })
  }, [gameState, skierX, gatesCleared, playGateHit])

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
      setGroundOffset(prev => (prev + speed) % 40)
      setSpeed(prev => Math.min(diffSettings.MAX_SPEED, prev + diffSettings.ACCELERATION))

      setGates(prev => {
        let newMisses = 0

        let updated = prev.map(gate => ({ ...gate, y: gate.y + speed }))

        updated = updated.filter(gate => {
          if (!gate.hit && gate.y > GATE_Y + 40) {
            newMisses++
            return false
          }
          return gate.y < GAME_HEIGHT + 80
        })

        if (newMisses > 0) {
          setMisses(m => m + newMisses)
          setTimingBreakdown(prev => ({ ...prev, miss: prev.miss + newMisses }))
          setLastFeedback({ text: 'MISS', color: '#ef4444', penalty: 2.0, id: Date.now() })
        }

        // Spawn gates from the pre-generated course
        const currentTime = Date.now() - raceStartTimeRef.current
        const course = courseRef.current
        if (courseIndexRef.current < course.length) {
          lastGateSpawnRef.current += speed
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

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, speed, gateCount])

  // Check finish/game over
  useEffect(() => {
    if (gameState !== 'playing') return

    if (misses >= MAX_MISSES) {
      const run = { gates: gatesCleared, misses, timing: { ...timingBreakdown }, ts: Date.now(), result: 'dnf', difficulty }
      setRunHistory(prev => {
        const updated = [run, ...prev].slice(0, 20)
        try { localStorage.setItem('slalom-runHistory', JSON.stringify(updated)) } catch {}
        return updated
      })
      setGameState('gameOver')
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    } else if (raceTime >= MAX_RACE_TIME) {
      setRaceTime(MAX_RACE_TIME)
      const currentBest = bestScores[difficulty]
      const isNewBest = !currentBest || gatesCleared > (currentBest.gates || 0)
      if (isNewBest) {
        const newBest = { time: MAX_RACE_TIME, gates: gatesCleared }
        setBestScores(prev => {
          const updated = { ...prev, [difficulty]: newBest }
          try { localStorage.setItem('slalom-bestScores', JSON.stringify(updated)) } catch {}
          return updated
        })
      }
      const run = { gates: gatesCleared, misses, timing: { ...timingBreakdown }, ts: Date.now(), result: 'finish', difficulty }
      setRunHistory(prev => {
        const updated = [run, ...prev].slice(0, 20)
        try { localStorage.setItem('slalom-runHistory', JSON.stringify(updated)) } catch {}
        return updated
      })
      setGameState('finished')
      setCrowdCheering(true)
      playCrowdNoise(3)
      playBeep(880, 0.5, 0.4)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [misses, raceTime, gatesCleared, gameState, bestTime, timingBreakdown, playBeep, playCrowdNoise])

  const startGame = () => {
    initAudio()

    setGates([])
    setGateCount(0)
    setGatesCleared(0)
    setMisses(0)
    setSpeed(diffSettings.INITIAL_SPEED)
    setRaceTime(0)
    setSplitTimes([])
    setLastSplit(null)
    setLastFeedback(null)
    setTimingBreakdown({ perfect: 0, good: 0, early: 0, late: 0, miss: 0 })
    setSkierX(SKIER_CENTER_X)
    setSkierLean(0)
    setSkierTrail([])
    setCarvePhase(null)
    setGroundOffset(0)
    setCrowdCheering(false)
    setShowFinishCrowd(false)
    setCameraShake({ x: 0, y: 0 })
    setCountdownValue(3)
    lastGateSpawnRef.current = 0
    courseRef.current = generateCourse(difficulty)
    courseIndexRef.current = 0
    nextGateSideRef.current = 'left'
    nextGateSpacingRef.current = courseRef.current.length > 0 ? courseRef.current[0].spacing : (diffSettings.MIN_GATE_SPACING || MIN_GATE_SPACING)
    gateIdRef.current = 0
    setGameState('countdown')
  }

  if (gameState === 'lobby') {
    return (
      <Lobby
        onStart={startGame}
        bestScores={bestScores}
        runHistory={runHistory}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
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
          background: 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 40%, #dbeafe 70%, #f0f9ff 100%)'
        }} />

        {/* Mountains */}
        <svg className="absolute top-0 left-0 w-full" style={{ height: 100 }}>
          <polygon points="0,100 40,50 80,75 130,30 180,60 230,40 280,55 340,35 400,100" fill="#94a3b8" opacity="0.6" />
          <polygon points="0,100 60,65 110,45 160,70 210,50 270,60 320,45 400,100" fill="#64748b" opacity="0.5" />
          <polygon points="130,30 120,45 140,45" fill="white" opacity="0.7" />
          <polygon points="230,40 220,52 240,52" fill="white" opacity="0.7" />
          <polygon points="340,35 328,50 352,50" fill="white" opacity="0.7" />
        </svg>

        {/* Snow slope */}
        <div className="absolute inset-0" style={{
          top: 70,
          background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 40%, #cbd5e1 80%, #94a3b8 100%)'
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
            return <Tree key={tree.id} x={8 + tree.offset * 0.4} y={scrollY} size={tree.size} flipped={false} />
          })}
        </svg>
        <svg className="absolute right-0 top-0 pointer-events-none" style={{ width: 45, height: GAME_HEIGHT }}>
          {RIGHT_TREES.map(tree => {
            const scrollY = (tree.y + groundOffset * 1.8) % (GAME_HEIGHT + 80) - 40
            return <Tree key={tree.id} x={37 - tree.offset * 0.4} y={scrollY} size={tree.size} flipped={true} />
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
          <SlalomGate key={gate.id} x={gate.x} y={gate.y} side={gate.side} hit={gate.hit} hitTime={gate.hitTime} />
        ))}

        {/* Skier */}
        <Skier lean={skierLean} x={skierX} />

        {/* Feedback */}
        {lastFeedback && (
          <div key={lastFeedback.id} className="absolute left-1/2 text-2xl font-bold pointer-events-none feedback-pop"
            style={{ top: OPTIMAL_HIT_Y - 50, transform: 'translateX(-50%)', color: lastFeedback.color,
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            {lastFeedback.text}
            {lastFeedback.penalty > 0 && <span className="text-sm ml-1">+{lastFeedback.penalty.toFixed(2)}s</span>}
          </div>
        )}

        {/* HUD */}
        {gameState === 'playing' && (
          <HUD raceTime={raceTime} gatesCleared={gatesCleared} speed={speed} misses={misses} bestTime={bestTime} maxTime={MAX_RACE_TIME} difficulty={difficulty} />
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
        {gameState === 'finished' && (
          <FinishScreen bestTime={bestTime} gatesCleared={gatesCleared} misses={misses} timingBreakdown={timingBreakdown} onRestart={startGame} onLobby={() => setGameState('lobby')} />
        )}
        {gameState === 'gameOver' && <GameOverScreen gatesCleared={gatesCleared} timingBreakdown={timingBreakdown} onRestart={startGame} onLobby={() => setGameState('lobby')} />}
      </div>

      {/* Controls hint */}
      <div className="mt-3 text-slate-500 text-xs text-center">
        A/← Left • D/→ Right • Space to start
      </div>
    </div>
  )
}
