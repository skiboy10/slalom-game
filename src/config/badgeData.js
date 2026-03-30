// Badge definitions for the Achievement system
// Each badge has: id, name, emoji, description, check function
export const BADGES = [
  {
    id: 'first-run',
    name: 'First Run',
    emoji: '🎿',
    description: 'Complete any run',
  },
  {
    id: 'first-finish',
    name: 'First Finish',
    emoji: '🏁',
    description: 'Finish without DNF',
  },
  {
    id: 'gate-crusher',
    name: 'Gate Crusher',
    emoji: '🚪',
    description: '25+ gates in one run',
  },
  {
    id: 'gate-master',
    name: 'Gate Master',
    emoji: '👑',
    description: '50+ gates in one run',
  },
  {
    id: 'hot-streak',
    name: 'Hot Streak',
    emoji: '🔥',
    description: '5+ combo',
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    emoji: '💥',
    description: '10+ combo',
  },
  {
    id: 'legendary',
    name: 'Legendary',
    emoji: '⭐',
    description: '20+ combo',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    emoji: '🏎️',
    description: 'Finish on Turbo speed',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    emoji: '💎',
    description: '10+ PERFECT in one run',
  },
  {
    id: 'all-rounder',
    name: 'All-Rounder',
    emoji: '🌍',
    description: 'Played all 3 difficulties',
  },
  {
    id: 'big-air-pro',
    name: 'Big Air Pro',
    emoji: '🦅',
    description: '3+ Big Air bonus gates',
  },
  {
    id: 'daily-player',
    name: 'Daily Player',
    emoji: '📅',
    description: 'Complete a daily challenge',
  },
]

/**
 * Check which new badges were earned after a run.
 *
 * @param {Object} runData - Data about the just-completed run
 *   { gates, result, timing, maxCombo, speedLevel, difficulty, bigAirBonus, isDailyChallenge }
 * @param {Array} runHistory - Full run history (including the latest run)
 * @param {Set|Array} alreadyEarned - Badge IDs already earned
 * @returns {string[]} - Array of newly earned badge IDs
 */
export function checkBadges(runData, runHistory, alreadyEarned) {
  const earned = alreadyEarned instanceof Set ? alreadyEarned : new Set(alreadyEarned || [])
  const newBadges = []

  function award(id) {
    if (!earned.has(id)) newBadges.push(id)
  }

  // 1. first-run: Complete any run (DNF or finish)
  award('first-run')

  // 2. first-finish: Finish without DNF
  if (runData.result === 'finish') {
    award('first-finish')
  }

  // 3. gate-crusher: 25+ gates in one run
  if (runData.gates >= 25) {
    award('gate-crusher')
  }

  // 4. gate-master: 50+ gates in one run
  if (runData.gates >= 50) {
    award('gate-master')
  }

  // 5. hot-streak: 5+ combo
  if (runData.maxCombo >= 5) {
    award('hot-streak')
  }

  // 6. on-fire: 10+ combo
  if (runData.maxCombo >= 10) {
    award('on-fire')
  }

  // 7. legendary: 20+ combo
  if (runData.maxCombo >= 20) {
    award('legendary')
  }

  // 8. speed-demon: Finish on Turbo speed
  if (runData.result === 'finish' && runData.speedLevel === 'turbo') {
    award('speed-demon')
  }

  // 9. perfectionist: 10+ PERFECT in one run
  if (runData.timing && runData.timing.perfect >= 10) {
    award('perfectionist')
  }

  // 10. all-rounder: Played all 3 difficulties (check full history)
  const allDiffs = new Set((runHistory || []).map(r => r.difficulty))
  if (allDiffs.has('easy') && allDiffs.has('normal') && allDiffs.has('hard')) {
    award('all-rounder')
  }

  // 11. big-air-pro: 3+ Big Air bonus gates
  if (runData.bigAirBonus >= 3) {
    award('big-air-pro')
  }

  // 12. daily-player: Complete a daily challenge
  if (runData.isDailyChallenge) {
    award('daily-player')
  }

  return newBadges
}
