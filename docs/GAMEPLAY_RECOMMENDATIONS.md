# Slalom Game — Gameplay Recommendations & Dev Test

Prepared by Clutch (manager) after code review of:
- `src/components/SlalomTrainer.jsx`
- `src/config/gameSettings.js`
- `src/components/HUD.jsx`
- `src/components/GameScreens.jsx`
- `BACKLOG.md`

## Worktree Team Setup (created)
- `/workspace/projects/slalom-game` (main)
- `/workspace/projects/slalom-game-worktrees/agent-mechanics` (branch: `analysis/agent-mechanics`)
- `/workspace/projects/slalom-game-worktrees/agent-balance` (branch: `analysis/agent-balance`)
- `/workspace/projects/slalom-game-worktrees/agent-ux` (branch: `analysis/agent-ux`)

---

## Top Gameplay Improvements (prioritized)

## P0 — High Impact, low-to-medium effort

### 1) Add Pause + Restart state machine (already in backlog)
**Why:** Right now there’s no in-run pause/resume safety; this hurts usability and testing loops.  
**Where:** `SlalomTrainer.jsx`, `GameScreens.jsx`  
**Implementation:** Add `paused` to game states, freeze loop/timer, Resume/Restart overlay, keybind `Esc`.

### 2) Add Difficulty Presets (Easy / Normal / Expert)
**Why:** One tuning profile can’t serve beginners and returning players.  
**Where:** `gameSettings.js`, start screen in `GameScreens.jsx`, game init in `SlalomTrainer.jsx`  
**Implementation:** Parameterize speed ramp, windows, miss allowance, and spacing by mode.

### 3) Practice Mode (No DNF, coaching-first)
**Why:** Current `MAX_MISSES=3` can end learning runs too early.  
**Where:** `gameSettings.js`, `SlalomTrainer.jsx`, start screen toggle  
**Implementation:** Add mode with unlimited misses + post-run coaching tips.

### 4) Better Timing Feedback Clarity
**Why:** Current “PERFECT/GOOD/LATE/MISS” is good but still hard to calibrate rhythm for new players.  
**Where:** `HUD.jsx`, feedback block in `SlalomTrainer.jsx`  
**Implementation:** Add tiny rhythm bar/progress cue for next gate timing + optional metronome tick.

## P1 — Medium Impact, medium effort

### 5) Combo/Streak Scoring Layer
**Why:** Current loop is mostly survival + time; adding streak reward increases flow and replayability.  
**Where:** `SlalomTrainer.jsx`, `HUD.jsx`, finish screen  
**Implementation:** `combo` increments on Perfect/Good, decays on Late, resets on Miss; display max streak + bonus.

### 6) Split + Sector Coaching
**Why:** You collect split times but don’t teach improvement patterns yet.  
**Where:** `SlalomTrainer.jsx`, finish/game over screens  
**Implementation:** Show “lost most time on late right turns” type hints after run.

### 7) Mobile-first Control Pass
**Why:** Click left/right works, but no explicit touch UX calibration.  
**Where:** container click handler + onboarding copy  
**Implementation:** larger touch zones, optional haptic pulse (if available), clear mobile hints.

## P2 — Nice next wave

### 8) Adaptive gate spacing by player consistency
**Why:** Keeps challenge in “flow channel.”  
**Implementation:** If 5+ clean gates, tighten spacing slightly; if repeated misses, relax temporarily.

### 9) Ghost replay of best run
**Why:** Strong motivation and immediate pacing benchmark.

---

## Simple Development Test (1 sprint, 2–3 days)

## Goal
Increase “fun + learnability” while preserving challenge.

## Test Package
Implement only these 3 items first:
1. Pause/Restart flow
2. Difficulty presets (Easy/Normal/Expert)
3. Practice mode (no DNF) + clearer timing cue

## Success Metrics
- New player can complete at least one run in < 5 minutes (Easy).
- Retry rate increases (target +20% vs baseline session).
- Misses per run decrease in first 3 attempts.
- Subjective score (1–5): “I understand how to improve” avg >= 4.

## Test Procedure
1. Run 5 quick sessions per mode (Easy/Normal/Expert).
2. Capture: completion rate, avg misses, avg gates cleared, avg run time.
3. Compare baseline (current main branch) vs test branch.
4. Keep changes only if they improve both completion and replay desire.

---

## Suggested Next Branches
- `feat/pause-restart-state`
- `feat/difficulty-presets`
- `feat/practice-mode-feedback`

These can be built/validated in parallel, then merged behind a single test pass.


---

## Graphics Upgrade Plan (Jam Pass)

### Delivered in this sprint branch
- Dynamic camera zoom tied to speed
- Deeper sky/slope lighting and vignette
- Improved skier rendering + animation bob
- Dynamic gate shadows based on speed
- Snow spray particles during carves/misses
- HUD visual hierarchy refresh + timing progress meter
- Start screen run setup (difficulty + practice mode)
- Pause/resume overlay and controls

### Engine recommendation
- **Near-term:** stay in current React setup while validating gameplay loop changes.
- **If we need more visual fidelity/performance:** migrate gameplay layer to **Phaser 3** (best 2D fit), keep React for menus/settings if desired.
- **Alternative:** PixiJS for render-heavy custom approach.


## Broadcast-quality pass (implemented)

Second jam pass visual upgrades added:
- cloud parallax layer
- atmospheric speed-reactive haze
- animated course banners
- high-speed streak lines
- refined depth and motion cues

### Next if we migrate engines
- Keep game design constants and run-state machine unchanged
- Move render/input loop into Phaser 3 scene
- Keep React for menu/settings shell
