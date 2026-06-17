# Free Ride Mode — Design Spec

**Date:** 2026-06-16
**Author:** Claude (with Don & Isaac, age 10)
**Status:** Approved for V1 build

## Overview

Add a new **Free Ride** mode to Ski Racing: an open, explorable mountain the
player skis freely down — no race timer, no gates required, no DNF. The mountain
is alive with other skiers and ski patrol, has collectible coins (tied to the
existing shop/credits system), jumps that trigger the existing trick system, a
chairlift, and a cozy lodge. A chairlift "ride back up" loop gives the
roam-the-whole-mountain feeling inside the game's existing downhill engine.

Race mode and **everything else stays exactly as it is.** Free Ride is purely
additive — a new entry from the lobby and a new `gameState`.

### Why 2D Free-Ride (not 3D)
The game is a 2D top-down React/SVG downhill engine. A 2D free-ride reuses all
existing art (Skier, Tree, Spectator/crowd, BigAir tricks, snow, night mode),
runs fast on any machine, and is buildable now. 3D was considered and deferred.

## Goals / Non-Goals

**Goals (V1):**
- New `🏔️ FREE RIDE` entry in the lobby; launches free-roam instead of a race.
- Player-controlled skiing across a **wide** mountain with a follow camera.
- Speed control (tuck to accelerate, snowplow to slow). No timer, no losing.
- Collect coins → add to existing `credits` (spendable in the existing shop).
- Hit jumps → reuse Big Air trick sequence → land → keep skiing.
- Forest zones: bonking a tree = harmless funny tumble, then auto-recover.
- NPC skiers cruising down (varied colors/speeds) you can pass.
- Ski patrol: zoom around, "rescue" fallen skiers, wave a warning if you bomb fast.
- Chairlift carrying skiers up; lodge with chimney smoke.
- Works in existing night mode.
- "Back to Lobby" available at all times.

**Non-Goals (deferred to V2, documented so we don't lose them):**
- Snowmobiles, halfpipe, frozen-pond ice physics, follow-patrol-to-secret-caves,
  friendly mountain animal, warmth/cocoa meter.

## Architecture — designed for isolation & parallel build

New, self-contained module tree so independent pieces can be built in parallel
without touching each other's files. Free Ride does **not** modify the existing
`SlalomTrainer` race loop beyond a small mode-dispatch hook.

```
src/config/freeRideSettings.js        # constants, mountain layout, zone defs, NPC params
src/components/FreeRide/
  FreeRide.jsx                         # orchestrator: state, game loop, camera, HUD, input
  useFreeRideEngine.js                 # core movement/physics/camera hook (player + world scroll)
  Mountain.jsx                         # renders terrain zones, slope, decor layer (lodge, lift base)
  Chairlift.jsx                        # animated chairlift with riders
  Lodge.jsx                            # cabin + chimney smoke
  NPCSkier.jsx                         # one cruising skier sprite (reuses Skier visuals where possible)
  SkiPatrol.jsx                        # patrol skier sprite + behavior states
  Coin.jsx                             # collectible coin sprite + shimmer
  FreeRideHUD.jsx                      # coins collected, speed, tricks, Back-to-Lobby
```

**Reused as-is:** `Skier`, `Tree`, `BigAir`, snow/sparkle generators, `useAudio`,
night-mode colors (same palette approach as the race scene).

### Integration points (the ONLY edits to existing files)
1. `SlalomTrainer.jsx`
   - Add `'freeride'` branch to the `gameState` switch; render `<FreeRide ... />`.
   - Pass `playerName`, `skierStyle`, `credits`/`addCredits`, `soundEnabled`,
     `nightMode`, audio init, and `onExit` (→ back to lobby).
2. `Lobby.jsx`
   - Add a `🏔️ FREE RIDE` button that calls `onStartFreeRide`.
3. `SlalomTrainer` wiring: `onStartFreeRide` sets `gameState='freeride'`.

These edits are small and will be done in the **foundation step** (by the
orchestrator) BEFORE parallel agents run, so the parallel agents only create new
files in `src/components/FreeRide/` and `src/config/freeRideSettings.js`.

## Coordinate model

- The world is a tall, wide field. Player has world coords `(worldX, worldY)`.
- `worldY` always increases as you descend (downhill). `worldX` is free within
  mountain bounds (`MOUNTAIN_WIDTH`, much wider than the 400px race lane).
- Camera centers on the player; everything renders at `screenX = worldX - camX`,
  `screenY = worldY - camY`. Off-screen entities are culled.
- Reaching the bottom (`worldY >= MOUNTAIN_LENGTH`) puts the player at the lift
  base; pressing the lift action rides them back to the top (worldY reset, brief
  chairlift animation), preserving coins/credits.

## Data structures

```js
// freeRideSettings.js
MOUNTAIN_WIDTH   = 1200     // wide playfield (race lane is 400)
MOUNTAIN_LENGTH  = 6000     // long descent before lift base
VIEW_W, VIEW_H              // visible window (match current 400x600 frame)
FRICTION, TUCK_ACCEL, PLOW_DECEL, MAX_FREE_SPEED, TURN_RATE

ZONES = [ {id, type:'forest'|'pond'|'open'|'jump', x, y, w, h, ...} ]
COIN_LAYOUT = [ {id, worldX, worldY} ]      // or seeded generator
NPC_PARAMS = { count, speedRange, colorPalette }
PATROL_PARAMS = { count, speed, warnSpeedThreshold }
```

```js
// runtime entities (in useFreeRideEngine)
player:  { worldX, worldY, vx, vy, speed, lean, airborne, tumbleUntil }
npcs:    [{ id, worldX, worldY, speed, color, fallen }]
patrol:  [{ id, worldX, worldY, state:'cruise'|'rescue'|'warn', targetId }]
coins:   [{ id, worldX, worldY, collected }]
camera:  { camX, camY }
hud:     { coins, tricksLanded }
```

## Mechanics

**Movement:** A/← and D/→ steer (adjust `vx` / lean). ↑/W = tuck (faster),
↓/S = snowplow (slower). Gravity-ish constant downhill drift scaled by speed.
Clamp to mountain bounds (orange safety net edges like the race).

**Coins:** circle-overlap with player → `collected=true`, +1 coin, sound, and
`addCredits(1)` so it feeds the real shop. HUD shows session coins.

**Jumps:** entering a `jump` zone with enough speed → hand off to `BigAir`
(existing). On complete, return to free ride; landed tricks add bonus coins.

**Forest collision:** overlap a tree trunk → `tumbleUntil = now + 800ms`, play
tumble (skier spins/falls), speed drops to ~0, then auto-recover upright. No
penalty — it's just funny. (Reuse/extend Skier visual for a tumble pose.)

**NPC skiers:** spawn across the width, drift downhill at varied speeds; recycle
to the top when they pass below view. Purely cosmetic + "race/pass" feel.

**Ski patrol behaviors (state machine):**
- `cruise`: ski around like NPCs but red jacket + white cross.
- `rescue`: if an NPC is `fallen`, the nearest idle patrol heads to it, pauses
  (rescue animation), then NPC stands and both resume.
- `warn`: if the *player* exceeds `warnSpeedThreshold`, the nearest patrol shows
  a brief "⚠️ Slow down!" wave/callout (cosmetic, no penalty).

**Chairlift:** animated chairs with seated skiers moving up one edge (decor) +
functions as the "ride back up" loop at the bottom.

**Lodge:** static cabin with animated chimney smoke (decor landmark).

**Night mode:** reuse the same palette switch already added to the race scene.

## Controls
- A/← , D/→ : steer
- ↑/W : tuck (speed up) ; ↓/S : snowplow (slow down)
- Space / E near lift base : ride lift back to top
- Esc or on-screen button : Back to Lobby

## Error / edge handling
- Player clamped within mountain bounds; cannot leave the field.
- Entity arrays recycled (object pools) to avoid unbounded growth / key churn.
- All entity keys are stable ids (avoid the duplicate-key warning pattern).
- If audio not initialized, calls no-op gracefully (existing `useAudio` pattern).
- Reduced motion / low perf: cap entity counts via settings constants.

## Testing / verification
- App builds and lobby shows the new button; Race mode unaffected.
- Launch Free Ride: player skis, camera follows, coins collect & credits rise.
- NPCs and patrol render and move; patrol rescue + warn trigger.
- Jump → trick → return works. Tree tumble + recover works.
- Lift loop returns player to top. Back-to-Lobby works.
- Night mode renders correctly. No new console errors (beyond pre-existing).
- Verified live via Playwright screenshots, same as the night-mode fix.

## Build plan (parallelization)
1. **Foundation (orchestrator, first):** `freeRideSettings.js`, `FreeRide.jsx`
   skeleton + `useFreeRideEngine.js` core loop/camera, lobby button + gameState
   wiring, defined props/interfaces and stub child components so the app runs.
2. **Parallel agents (own separate files):**
   - Agent A: `NPCSkier.jsx` + NPC spawn/recycle logic (interface from engine).
   - Agent B: `SkiPatrol.jsx` + patrol state machine (cruise/rescue/warn).
   - Agent C: `Coin.jsx` + coin layout/collection + credits tie-in.
   - Agent D: `Mountain.jsx` + `Chairlift.jsx` + `Lodge.jsx` (terrain & decor).
   - Agent E: jump-zone → BigAir integration + forest tumble.
3. **Integration & verification (orchestrator):** wire children into FreeRide,
   run, screenshot, fix, agy review.

## V2 backlog (not now)
Snowmobiles, halfpipe, frozen-pond physics, follow-patrol-to-secret-caves,
friendly mountain animal, warmth/cocoa meter. Add to `BACKLOG.md`.
