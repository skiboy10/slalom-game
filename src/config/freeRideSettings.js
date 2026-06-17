// Free Ride mode — configuration & mountain layout
// The visible frame stays GAME_WIDTH x GAME_HEIGHT (400x600). The "mountain" is a
// large world; a camera shows a 400x600 window into it and follows the player.
import { GAME_WIDTH, GAME_HEIGHT } from './gameSettings'

export const VIEW_W = GAME_WIDTH    // 400
export const VIEW_H = GAME_HEIGHT   // 600

// World size (much larger than the view)
export const MOUNTAIN_WIDTH = 1200
export const MOUNTAIN_LENGTH = 6000

// Player fixed screen position (camera keeps the player here vertically)
export const PLAYER_SCREEN_Y = 460

// Playable horizontal bounds inside the world (safety nets at the edges)
export const EDGE_MARGIN = 60
// Keep the play area clear of the chairlift cable on the left edge.
export const MIN_X = 110
export const MAX_X = MOUNTAIN_WIDTH - EDGE_MARGIN

// Movement / physics
export const TURN_RATE = 5.5          // horizontal px per frame at full steer
export const TUCK_ACCEL = 0.06        // downhill speed gain while tucking
export const PLOW_DECEL = 0.12        // speed loss while snowplowing
export const DRIFT_ACCEL = 0.015      // gentle constant downhill pull
export const FRICTION = 0.008
export const MIN_SPEED = 1.2
export const CRUISE_SPEED = 4.0
export const MAX_FREE_SPEED = 9.0
export const WARN_SPEED = 7.5         // patrol warns the player above this

export const TUMBLE_MS = 800          // how long a tree wipeout lasts

// Entity population
export const NPC_COUNT = 10
export const PATROL_COUNT = 3
export const COIN_COUNT = 60
export const TREE_COUNT = 70

export const NPC_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#a3e635', '#22d3ee',
]

// Mountain zones, expressed in world coordinates.
// type: 'forest' (trees + tumble), 'jump' (launch into Big Air), 'pond' (decor V1),
//       'open' (clear cruising)
export const ZONES = [
  { id: 'z-open-1',   type: 'open',   x: 0,    y: 0,    w: MOUNTAIN_WIDTH, h: 700 },
  { id: 'z-forest-1', type: 'forest', x: 60,   y: 700,  w: 480,  h: 900 },
  { id: 'z-jump-1',   type: 'jump',   x: 560,  y: 1100, w: 220,  h: 160 },
  { id: 'z-pond-1',   type: 'pond',   x: 760,  y: 900,  w: 360,  h: 420 },
  { id: 'z-open-2',   type: 'open',   x: 0,    y: 1600, w: MOUNTAIN_WIDTH, h: 500 },
  { id: 'z-forest-2', type: 'forest', x: 620,  y: 2100, w: 520,  h: 1000 },
  { id: 'z-jump-2',   type: 'jump',   x: 180,  y: 2500, w: 240,  h: 160 },
  { id: 'z-open-3',   type: 'open',   x: 0,    y: 3100, w: MOUNTAIN_WIDTH, h: 600 },
  { id: 'z-forest-3', type: 'forest', x: 120,  y: 3700, w: 980,  h: 1200 },
  { id: 'z-jump-3',   type: 'jump',   x: 520,  y: 4200, w: 240,  h: 160 },
  { id: 'z-open-4',   type: 'open',   x: 0,    y: 4900, w: MOUNTAIN_WIDTH, h: MOUNTAIN_LENGTH - 4900 },
]

// Landmarks (decor), world coordinates
export const LODGE = { x: 120, y: 240 }            // near the top, by the lift base/top
export const LIFT_X = 40                            // chairlift runs up the left edge
export const LIFT_BASE_Y = MOUNTAIN_LENGTH - 120    // where you ride back up
