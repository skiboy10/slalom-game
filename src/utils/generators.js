import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameSettings'

export const generateSnowParticles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: 1 + Math.random() * 2,
    speed: 0.5 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 0.5
  }))
}

export const generateSparkles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: 1 + Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.5
  }))
}

export const generateTrees = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: (i / count) * GAME_HEIGHT * 1.2 - 50,
    size: 0.4 + Math.random() * 0.4,
    offset: Math.random() * 15
  }))
}

export const generateCrowd = (count) => {
  const jacketColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
  const hatColors = ['#1f2937', '#dc2626', '#1d4ed8', '#047857', '#7c3aed', '#be185d']

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: (i / count) * GAME_HEIGHT * 1.5 - 100,
    xOffset: Math.random() * 20,
    jacketColor: jacketColors[Math.floor(Math.random() * jacketColors.length)],
    hatColor: hatColors[Math.floor(Math.random() * hatColors.length)],
    hasHat: Math.random() > 0.3,
    hasScarf: Math.random() > 0.5,
    scarfColor: jacketColors[Math.floor(Math.random() * jacketColors.length)],
    height: 0.7 + Math.random() * 0.3,
    armRaise: Math.random(),
    cheerOffset: Math.random() * Math.PI * 2
  }))
}

/**
 * Generate a randomized slalom course based on real FIS rules.
 *
 * Gate patterns:
 *   rhythm  - standard alternating turns, normal spacing
 *   hairpin - 2 quick turns very close together (like real hairpin combos)
 *   flush   - 3 rapid gates in a row (like a real flush combo)
 *   delay   - one big gap before the next gate (like a real delay combo)
 */
export const generateCourse = (difficulty = 'normal') => {
  // Gate spacing targets ~0.75s to ~1.5s between gates
  // At average speed ~4-5 px/frame at 60fps = ~250 px/sec
  // 0.75s = ~190px, 1.0s = ~250px, 1.5s = ~375px
  const config = {
    easy: {
      rhythmSpacing: [280, 420],   // ~1.1s to ~1.7s — relaxed pace
      hairpinSpacing: [180, 240],   // ~0.75s to ~1.0s — quick but doable
      flushSpacing: [170, 220],     // ~0.7s to ~0.9s
      delaySpacing: [500, 650],     // big breather gap
      hairpins: [2, 4],
      flushes: [0, 1],
      delays: [1, 3],
      openingRhythm: 6,
      closingRhythm: 4,
      rhythmFill: 22,              // lots of rhythm gates to fill 90s
    },
    normal: {
      rhythmSpacing: [230, 370],   // ~0.9s to ~1.5s
      hairpinSpacing: [150, 210],   // ~0.6s to ~0.85s — fast pairs
      flushSpacing: [140, 190],     // ~0.55s to ~0.75s — rapid fire
      delaySpacing: [450, 580],     // big gap
      hairpins: [3, 6],
      flushes: [2, 4],
      delays: [2, 3],
      openingRhythm: 5,
      closingRhythm: 3,
      rhythmFill: 18,
    },
    hard: {
      rhythmSpacing: [190, 310],   // ~0.75s to ~1.25s — tight
      hairpinSpacing: [120, 180],   // ~0.5s to ~0.7s — really fast
      flushSpacing: [110, 160],     // ~0.45s to ~0.65s — rapid fire
      delaySpacing: [400, 520],
      hairpins: [4, 7],
      flushes: [3, 5],
      delays: [2, 4],
      openingRhythm: 4,
      closingRhythm: 3,
      rhythmFill: 15,
    },
  }

  const c = config[difficulty] || config.normal

  const randBetween = (min, max) => min + Math.random() * (max - min)
  const randInt = (min, max) => Math.floor(randBetween(min, max + 1))

  // Estimate total distance the skier will travel in 90 seconds.
  // Speed ramps from INITIAL to MAX. Average speed is roughly the midpoint.
  // At 60fps, average ~5 px/frame = ~300 px/sec, over 90s = ~27000 px total.
  // We generate enough gates to cover that distance, with a safety margin.
  const targetDistance = 40000

  // Build the course gate-by-gate
  const gates = []
  let totalSpacing = 0
  let currentSide = 'left' // start with left, right, left, right
  let currentPattern = 'rhythm'
  const flip = () => { currentSide = currentSide === 'left' ? 'right' : 'left' }

  const addGate = (spacing) => {
    const baseX = currentSide === 'left' ? GAME_WIDTH * 0.32 : GAME_WIDTH * 0.68
    const variation = (Math.random() - 0.5) * 25
    gates.push({
      side: currentSide,
      spacing: spacing,
      x: baseX + variation,
      pattern: currentPattern,
    })
    totalSpacing += spacing
    flip()
  }

  // Opening rhythm: steady gates to get into the flow
  currentPattern = 'rhythm'
  for (let i = 0; i < c.openingRhythm; i++) {
    addGate(randBetween(c.rhythmSpacing[0], c.rhythmSpacing[1]))
  }

  // Build combo pools — these get sprinkled throughout
  const combos = []
  const numHairpins = randInt(c.hairpins[0], c.hairpins[1])
  const numFlushes = randInt(c.flushes[0], c.flushes[1])
  const numDelays = randInt(c.delays[0], c.delays[1])
  for (let i = 0; i < numHairpins; i++) combos.push('hairpin')
  for (let i = 0; i < numFlushes; i++) combos.push('flush')
  for (let i = 0; i < numDelays; i++) combos.push('delay')
  // Shuffle combos
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]]
  }

  // Keep generating gates until we've filled the whole race distance.
  // Sprinkle in combos every few rhythm gates.
  let comboIndex = 0
  let rhythmCount = 0
  const comboInterval = randInt(3, 5) // drop a combo every 3-5 rhythm gates

  while (totalSpacing < targetDistance) {
    // Time for a combo?
    if (comboIndex < combos.length && rhythmCount >= comboInterval) {
      const combo = combos[comboIndex]
      comboIndex++
      rhythmCount = 0

      if (combo === 'hairpin') {
        currentPattern = 'hairpin'
        addGate(randBetween(c.hairpinSpacing[0], c.hairpinSpacing[1]))
        addGate(randBetween(c.hairpinSpacing[0], c.hairpinSpacing[1]))
      } else if (combo === 'flush') {
        currentPattern = 'flush'
        addGate(randBetween(c.flushSpacing[0], c.flushSpacing[1]))
        addGate(randBetween(c.flushSpacing[0], c.flushSpacing[1]))
        addGate(randBetween(c.flushSpacing[0], c.flushSpacing[1]))
      } else if (combo === 'delay') {
        currentPattern = 'delay'
        addGate(randBetween(c.delaySpacing[0], c.delaySpacing[1]))
      }
    } else {
      // Regular rhythm gate
      currentPattern = 'rhythm'
      addGate(randBetween(c.rhythmSpacing[0], c.rhythmSpacing[1]))
      rhythmCount++
    }

    // Safety: don't generate more than 200 gates
    if (gates.length >= 200) break
  }

  return gates
}

// Format time as MM:SS.ss
export const formatTime = (ms) => {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`
}

// Format split time difference
export const formatSplit = (diff) => {
  const prefix = diff >= 0 ? '+' : ''
  return `${prefix}${diff.toFixed(2)}`
}
