import { GAME_HEIGHT, GAME_WIDTH, DISCIPLINE_PRESETS } from '../config/gameSettings'

/**
 * Mulberry32 seeded PRNG — returns a closure that behaves like Math.random().
 * Given the same seed it always produces the same sequence.
 */
export const createSeededRandom = (seed) => {
  let s = seed >>> 0 // ensure unsigned 32-bit
  return () => {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Returns today's date as a YYYYMMDD integer — same number for all players on the same calendar day.
 * Uses local time so the day turns over at midnight for each player (acceptable for a daily challenge).
 */
export const getDailySeed = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return Number(`${y}${m}${d}`)
}

/**
 * Returns today's date as a YYYY-MM-DD string for localStorage keys and display.
 */
export const getTodayString = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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

export const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * 95,
    size: 0.6 + Math.random() * 1.4,
    opacity: 0.4 + Math.random() * 0.6
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
 *   delay   - one big gap before the next gate (like a real delay combo)
 *
 * NOTE: flush (straight-through) gates have been intentionally removed.
 * Every gate requires the skier to go around it — no straight-through sequences.
 */
export const generateCourse = (difficulty = 'normal', discipline = 'sl', seed = null) => {
  // Use a seeded RNG when a seed is provided, otherwise fall back to Math.random
  const rng = seed !== null ? createSeededRandom(seed) : Math.random
  const disciplinePreset = DISCIPLINE_PRESETS[discipline] || DISCIPLINE_PRESETS.sl
  const spacingMult = disciplinePreset.spacingMultiplier
  // Gate spacing targets ~0.75s to ~1.5s between gates
  // At average speed ~4-5 px/frame at 60fps = ~250 px/sec
  // 0.75s = ~190px, 1.0s = ~250px, 1.5s = ~375px
  const baseConfig = {
    easy: {
      rhythmSpacing: [220, 340],
      hairpinSpacing: [160, 220],
      delaySpacing: [280, 360],
      hairpins: [3, 5],
      delays: [1, 2],
      openingRhythm: 6,
      rhythmFill: 22,
    },
    normal: {
      rhythmSpacing: [190, 300],
      hairpinSpacing: [140, 200],
      delaySpacing: [250, 330],
      hairpins: [4, 7],
      delays: [1, 2],
      openingRhythm: 5,
      rhythmFill: 18,
    },
    hard: {
      rhythmSpacing: [160, 260],
      hairpinSpacing: [110, 170],
      delaySpacing: [220, 300],
      hairpins: [5, 8],
      delays: [1, 2],
      openingRhythm: 4,
      rhythmFill: 15,
    },
  }

  const base = baseConfig[difficulty] || baseConfig.normal

  // Apply discipline spacing multiplier to all spacing ranges
  const c = {
    ...base,
    rhythmSpacing: [base.rhythmSpacing[0] * spacingMult, base.rhythmSpacing[1] * spacingMult],
    hairpinSpacing: [base.hairpinSpacing[0] * spacingMult, base.hairpinSpacing[1] * spacingMult],
    delaySpacing: [base.delaySpacing[0] * spacingMult, base.delaySpacing[1] * spacingMult],
  }

  const randBetween = (min, max) => min + rng() * (max - min)
  const randInt = (min, max) => Math.floor(randBetween(min, max + 1))

  // Estimate total distance the skier will travel in 90 seconds.
  // Speed ramps from INITIAL to MAX. At high speeds ~10 px/frame = ~600 px/sec.
  // Over 90s at high speed = ~54000 px. Use 70000 to guarantee gates all the way to the finish.
  const targetDistance = 70000

  // Build the course gate-by-gate
  const gates = []
  let totalSpacing = 0
  let currentSide = 'left' // start with left, right, left, right
  let currentPattern = 'rhythm'
  const flip = () => { currentSide = currentSide === 'left' ? 'right' : 'left' }

  // Gate opening width: SL = narrow, GS = wide
  // The inner pole defines one edge of the gate.
  // Left gate: inner pole on left side, skier passes to the RIGHT of it.
  // Right gate: inner pole on right side, skier passes to the LEFT of it.
  const openingWidth = discipline === 'gs' ? 80 : 50  // px

  const addGate = (spacing) => {
    const isLeft = currentSide === 'left'
    // Inner pole position — how far from center the pole sits
    const innerPoleVariation = (rng() - 0.5) * 30
    const innerX = isLeft
      ? GAME_WIDTH * 0.28 + innerPoleVariation   // left gate: inner pole left of center
      : GAME_WIDTH * 0.72 + innerPoleVariation   // right gate: inner pole right of center
    const outerX = isLeft
      ? innerX - openingWidth * 0.6              // outer pole further left
      : innerX + openingWidth * 0.6              // outer pole further right

    // Opening: the range of skier X that counts as "inside the gate"
    // Left gate: skier must be between innerX and innerX + openingWidth (to the right of inner pole)
    // Right gate: skier must be between innerX - openingWidth and innerX (to the left of inner pole)
    const openStart = isLeft ? innerX : innerX - openingWidth
    const openEnd = isLeft ? innerX + openingWidth : innerX

    gates.push({
      side: currentSide,
      spacing: spacing,
      x: innerX,            // kept for backwards compat / rendering anchor
      innerX,
      outerX,
      openStart,
      openEnd,
      pattern: currentPattern,
      discipline,
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
  const numDelays = randInt(c.delays[0], c.delays[1])
  for (let i = 0; i < numHairpins; i++) combos.push('hairpin')
  for (let i = 0; i < numDelays; i++) combos.push('delay')
  // Shuffle combos
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
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

    // Safety: don't generate more than 350 gates
    if (gates.length >= 350) break
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
