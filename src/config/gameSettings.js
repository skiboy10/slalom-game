// Game dimensions
export const GAME_HEIGHT = 600
export const GAME_WIDTH = 400
export const SKIER_Y = 480
export const GATE_SPAWN_Y = -50
export const OPTIMAL_HIT_Y = 330
export const GATE_Y = 430

// Timing windows (in pixels from optimal)
export const PERFECT_WINDOW = 25
export const GOOD_WINDOW = 50
export const LATE_WINDOW = 90

// Speed settings
export const INITIAL_SPEED = 2.5
export const MAX_SPEED = 8
export const ACCELERATION = 0.008
export const TURN_DECELERATION = 0.15

// Gate spawning
export const MIN_GATE_SPACING = 220
export const MAX_GATE_SPACING = 320
export const TOTAL_GATES = 20

// Race time limit (90 seconds)
export const MAX_RACE_TIME = 90000

// Skier positions
export const SKIER_CENTER_X = GAME_WIDTH / 2
export const LEFT_POSITION = GAME_WIDTH * 0.22
export const RIGHT_POSITION = GAME_WIDTH * 0.78

// Time penalties (in seconds)
export const PENALTIES = {
  PERFECT: 0,
  GOOD: 0.15,
  LATE: 0.35,
  MISS: 2.0
}

// Max misses before DNF
export const MAX_MISSES = 3

// Speed presets (independent from difficulty)
export const SPEED_PRESETS = {
  slow: { INITIAL_SPEED: 2, MAX_SPEED: 4, ACCELERATION: 0.003 },
  normal: { INITIAL_SPEED: 3, MAX_SPEED: 6, ACCELERATION: 0.005 },
  fast: { INITIAL_SPEED: 4, MAX_SPEED: 8, ACCELERATION: 0.007 },
  turbo: { INITIAL_SPEED: 5, MAX_SPEED: 10, ACCELERATION: 0.01 },
}

// Difficulty presets (timing windows and gate spacing only)
export const DIFFICULTY_PRESETS = {
  easy: {
    label: 'Easy',
    PERFECT_WINDOW: 35,
    GOOD_WINDOW: 65,
    LATE_WINDOW: 110,
    MIN_GATE_SPACING: 300,
    MAX_GATE_SPACING: 420,
  },
  normal: {
    label: 'Normal',
    PERFECT_WINDOW: 25,
    GOOD_WINDOW: 50,
    LATE_WINDOW: 90,
    MIN_GATE_SPACING: 220,
    MAX_GATE_SPACING: 320,
  },
  hard: {
    label: 'Hard',
    PERFECT_WINDOW: 15,
    GOOD_WINDOW: 35,
    LATE_WINDOW: 65,
    MIN_GATE_SPACING: 150,
    MAX_GATE_SPACING: 220,
  },
}

// Discipline presets
// SL (Slalom): tight spacing, rapid turn-to-turn, single-pole gates, narrow gate width
// GS (Giant Slalom): wider spacing, long sweeping arcs, dual-pole wide panel gates
// World Tour locations — each maps to a difficulty + speed + optional flags
export const WORLD_TOUR_LOCATIONS = [
  {
    id: 'bunny-hill',
    name: 'Bunny Hill',
    emoji: '⛷️',
    difficulty: 'easy',
    speed: 'normal',
    themeColor: '#22c55e',
    description: 'Where legends begin',
    unlockRequirement: null, // always unlocked
    unlockText: null,
    nightMode: false,
  },
  {
    id: 'aspen',
    name: 'Aspen',
    emoji: '🏔️',
    difficulty: 'normal',
    speed: 'normal',
    themeColor: '#3b82f6',
    description: 'Classic Colorado skiing',
    unlockRequirement: null, // always unlocked
    unlockText: null,
    nightMode: false,
  },
  {
    id: 'the-alps',
    name: 'The Alps',
    emoji: '🗻',
    difficulty: 'hard',
    speed: 'normal',
    themeColor: '#ef4444',
    description: 'Only the brave',
    unlockRequirement: 'totalGates20',
    unlockText: 'Clear 20 total gates',
    nightMode: false,
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    emoji: '🌃',
    difficulty: 'normal',
    speed: 'normal',
    themeColor: '#a855f7',
    description: 'Neon lights, fresh powder',
    unlockRequirement: 'finishNoDNF',
    unlockText: 'Finish a run without DNF',
    nightMode: true,
  },
  {
    id: 'mt-olympus',
    name: 'Mt. Olympus',
    emoji: '⚡',
    difficulty: 'hard',
    speed: 'fast',
    themeColor: '#fbbf24',
    description: 'Home of the gods',
    unlockRequirement: 'combo15',
    unlockText: 'Get a 15+ combo',
    nightMode: false,
  },
]

export const DISCIPLINE_PRESETS = {
  sl: {
    label: 'Slalom',
    shortLabel: 'SL',
    description: 'Rapid-fire gates, quick reflexes',
    // Multipliers applied on top of difficulty spacing
    spacingMultiplier: 1.0,
    // Skier travel distance per gate (narrower arc)
    arcWidth: 1.0,
    gateStyle: 'sl',
  },
  gs: {
    label: 'Giant Slalom',
    shortLabel: 'GS',
    description: 'Wide arcs, longer intervals',
    // GS gates are spaced roughly 1.6x further apart than SL
    spacingMultiplier: 1.6,
    // Wider arc — skier travels more side-to-side
    arcWidth: 1.25,
    gateStyle: 'gs',
  },
}
