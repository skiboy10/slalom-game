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
export const MIN_GATE_SPACING = 130
export const MAX_GATE_SPACING = 200
export const TOTAL_GATES = 20

// Skier positions
export const SKIER_CENTER_X = GAME_WIDTH / 2
export const LEFT_POSITION = GAME_WIDTH * 0.22
export const RIGHT_POSITION = GAME_WIDTH * 0.78

// Time penalties (in seconds)
export const PENALTIES = {
  PERFECT: 0,
  GOOD: 0.15,
  LATE: 0.35,
  MISS: 2.0,
}

// Max misses before DNF
export const MAX_MISSES = 3

// Difficulty presets for gameplay tuning
export const DIFFICULTY_PRESETS = {
  easy: {
    key: 'easy',
    label: 'Easy',
    initialSpeed: 2.1,
    maxSpeed: 6.5,
    acceleration: 0.0055,
    turnDeceleration: 0.18,
    minGateSpacing: 145,
    maxGateSpacing: 220,
    perfectWindow: 30,
    goodWindow: 60,
    lateWindow: 105,
    maxMisses: 5,
  },
  normal: {
    key: 'normal',
    label: 'Normal',
    initialSpeed: INITIAL_SPEED,
    maxSpeed: MAX_SPEED,
    acceleration: ACCELERATION,
    turnDeceleration: TURN_DECELERATION,
    minGateSpacing: MIN_GATE_SPACING,
    maxGateSpacing: MAX_GATE_SPACING,
    perfectWindow: PERFECT_WINDOW,
    goodWindow: GOOD_WINDOW,
    lateWindow: LATE_WINDOW,
    maxMisses: MAX_MISSES,
  },
  expert: {
    key: 'expert',
    label: 'Expert',
    initialSpeed: 2.9,
    maxSpeed: 9,
    acceleration: 0.011,
    turnDeceleration: 0.12,
    minGateSpacing: 120,
    maxGateSpacing: 180,
    perfectWindow: 20,
    goodWindow: 42,
    lateWindow: 75,
    maxMisses: 2,
  },
}
