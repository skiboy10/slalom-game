// Ski patrol — cruise the mountain, rescue fallen skiers, warn a speeding player.
import { PATROL_COUNT, MIN_X, MAX_X, MOUNTAIN_LENGTH, WARN_SPEED } from '../../config/freeRideSettings'

function spawnPatrol(i, nearY) {
  return {
    id: `patrol-${i}`,
    worldX: MIN_X + Math.random() * (MAX_X - MIN_X),
    worldY: nearY + (Math.random() * 1600 - 800),
    speed: 3.2,
    state: 'cruise',      // 'cruise' | 'rescue' | 'warn'
    targetId: null,
    leanPhase: Math.random() * Math.PI * 2,
    lean: 0,
    warnUntil: 0,
  }
}

export function createPatrol() {
  const patrol = []
  for (let i = 0; i < PATROL_COUNT; i++) {
    patrol.push(spawnPatrol(i, 200 + Math.random() * (MOUNTAIN_LENGTH - 400)))
  }
  return patrol
}

function nearestFallen(npcs, p) {
  let best = null, bestD = Infinity
  for (const n of npcs) {
    if (!n.fallen) continue
    const dx = n.worldX - p.worldX, dy = n.worldY - p.worldY
    const d = dx * dx + dy * dy
    if (d < bestD) { bestD = d; best = n }
  }
  return best
}

// ctx: { player, playerSpeed, npcs, now }
export function updatePatrol(patrol, ctx) {
  const { player, playerSpeed, npcs, now } = ctx
  const speeding = playerSpeed > WARN_SPEED

  for (const p of patrol) {
    // WARN: if the player is bombing downhill, the closest patrol waves a warning
    if (speeding && p.state !== 'rescue') {
      const dx = p.worldX - player.worldX, dy = p.worldY - player.worldY
      if (dx * dx + dy * dy < 320 * 320) {
        p.state = 'warn'
        p.warnUntil = now + 1400
      }
    }
    if (p.state === 'warn' && now > p.warnUntil) p.state = 'cruise'

    // RESCUE: head toward the nearest fallen skier, pause to help, then resume
    if (p.state === 'cruise' || p.state === 'rescue') {
      const target = p.targetId ? npcs.find(n => n.id === p.targetId && n.fallen) : nearestFallen(npcs, p)
      if (target) {
        p.state = 'rescue'
        p.targetId = target.id
        const dx = target.worldX - p.worldX
        const dy = target.worldY - p.worldY
        const dist = Math.hypot(dx, dy) || 1
        if (dist > 26) {
          p.worldX += (dx / dist) * p.speed
          p.worldY += (dy / dist) * p.speed
        } else {
          // arrived: helping (the NPC recovers via its own timer)
          target.fallenUntil = Math.min(target.fallenUntil, now + 400)
        }
        continue
      } else if (p.state === 'rescue') {
        p.state = 'cruise'
        p.targetId = null
      }
    }

    // CRUISE: weave downhill like everyone else
    p.leanPhase += 0.05
    p.lean = Math.sin(p.leanPhase) * 0.5
    p.worldX += p.lean * 1.6
    if (p.worldX < MIN_X) p.worldX = MIN_X
    if (p.worldX > MAX_X) p.worldX = MAX_X
    p.worldY += p.speed

    // recycle around the player
    if (p.worldY - player.worldY > 1000) {
      p.worldY = player.worldY - (800 + Math.random() * 500)
      p.worldX = MIN_X + Math.random() * (MAX_X - MIN_X)
    }
    if (player.worldY - p.worldY > 1000) {
      p.worldY = player.worldY + (800 + Math.random() * 500)
      p.worldX = MIN_X + Math.random() * (MAX_X - MIN_X)
    }
  }
  return patrol
}
