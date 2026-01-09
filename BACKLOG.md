# Slalom Timing Trainer - Backlog

## Overview
Feature backlog for the slalom game. Items are prioritized and broken into implementation tasks.

---

## 1. Stop / Restart Functions
**Priority:** High
**Status:** Planned

Add ability to pause gameplay and restart mid-run.

### Tasks
- [ ] Add pause state to game state machine (`start`, `countdown`, `playing`, `paused`, `finished`, `gameOver`)
- [ ] Create pause overlay UI with Resume/Restart/Quit options
- [ ] Implement keyboard shortcut (Escape or P) to toggle pause
- [ ] Freeze game loop, animations, and timer when paused
- [ ] Add "Restart Run" button accessible during gameplay (not just end screens)
- [ ] Handle audio context suspension during pause

### Acceptance Criteria
- Player can pause at any time during a run
- Timer stops when paused and resumes accurately
- Gates and skier freeze in place
- Clear visual indication of paused state

---

## 2. Player Name and Top Scores
**Priority:** High
**Status:** Planned

Persist player identity and maintain a leaderboard of best times.

### Tasks
- [ ] Add player name input on first launch (modal or start screen)
- [ ] Store player name in localStorage
- [ ] Create leaderboard data structure (name, time, date, gates cleared)
- [ ] Store top 10 scores in localStorage
- [ ] Display leaderboard on start screen and finish screen
- [ ] Highlight current player's scores
- [ ] Add "Change Name" option in settings/menu
- [ ] Show rank position when finishing a run

### Data Structure
```javascript
{
  playerName: "string",
  scores: [
    { name: "string", time: number, date: "ISO string", gates: number }
  ]
}
```

### Acceptance Criteria
- Player name persists across sessions
- Top 10 times displayed with player names
- New high scores are highlighted
- Player can change their name

---

## 3. Skier Position Refinement
**Priority:** Medium
**Status:** Planned

Improve skier movement, positioning, and visual feedback for more realistic carving.

### Tasks
- [ ] Refine horizontal position calculations during turns
- [ ] Adjust approach/gate/exit phase timing for smoother arcs
- [ ] Fine-tune lean angle based on turn sharpness
- [ ] Improve ski trail rendering (carve marks in snow)
- [ ] Add edge angle visualization during hard carves
- [ ] Calibrate LEFT_POSITION and RIGHT_POSITION constants
- [ ] Test and adjust SKIER_Y relative to gate passing point
- [ ] Add subtle body anticipation before turn initiation

### Current Constants (for reference)
```javascript
SKIER_Y = 480
SKIER_CENTER_X = GAME_WIDTH / 2  // 200
LEFT_POSITION = GAME_WIDTH * 0.22  // 88
RIGHT_POSITION = GAME_WIDTH * 0.78  // 312
```

### Acceptance Criteria
- Skier path looks natural through gates
- Carving animation feels responsive
- Trail accurately represents ski path
- No visual "teleporting" between positions

---

## Future Ideas (Unprioritized)

- [ ] Difficulty levels (gate spacing, speed progression)
- [ ] Sound toggle / volume controls
- [ ] Touch/swipe controls for mobile
- [ ] Ghost replay of best run
- [ ] Different course layouts
- [ ] Weather effects (visibility, wind)
- [ ] Multiplayer split-screen
- [ ] Export/share run results

---

## Completed

- [x] Initial Docker development environment
- [x] Modular component architecture
- [x] Basic gameplay loop
- [x] Timing feedback system (Perfect/Good/Late/Miss)
- [x] Audio effects
- [x] Crowd cheering on perfect timing
