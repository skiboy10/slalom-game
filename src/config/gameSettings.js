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

// Difficulty presets
export const DIFFICULTY_PRESETS = {
  easy: {
    label: 'Easy',
    PERFECT_WINDOW: 35,
    GOOD_WINDOW: 65,
    LATE_WINDOW: 110,
    ACCELERATION: 0.006,
    MAX_SPEED: 6,
    INITIAL_SPEED: 2.0,
    MIN_GATE_SPACING: 300,
    MAX_GATE_SPACING: 420,
  },
  normal: {
    label: 'Normal',
    PERFECT_WINDOW: 25,
    GOOD_WINDOW: 50,
    LATE_WINDOW: 90,
    ACCELERATION: 0.008,
    MAX_SPEED: 8,
    INITIAL_SPEED: 2.5,
    MIN_GATE_SPACING: 220,
    MAX_GATE_SPACING: 320,
  },
  hard: {
    label: 'Hard',
    PERFECT_WINDOW: 15,
    GOOD_WINDOW: 35,
    LATE_WINDOW: 65,
    ACCELERATION: 0.012,
    MAX_SPEED: 10,
    INITIAL_SPEED: 3.0,
    MIN_GATE_SPACING: 150,
    MAX_GATE_SPACING: 220,
  },
}
