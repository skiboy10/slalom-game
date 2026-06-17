// NPC skiers — other people cruising down the mountain. Cosmetic + "pass them" feel.
import { NPC_COUNT, NPC_COLORS, MIN_X, MAX_X, MOUNTAIN_LENGTH } from '../../config/freeRideSettings'

function spawnNPC(i, nearY) {
  return {
    id: `npc-${i}`,
    worldX: MIN_X + Math.random() * (MAX_X - MIN_X),
    worldY: nearY + (Math.random() * 1600 - 800),
    speed: 2 + Math.random() * 3,
    color: NPC_COLORS[i % NPC_COLORS.length],
    lean: 0,
    leanPhase: Math.random() * Math.PI * 2,
    fallen: false,
    fallenUntil: 0,
  }
}

export function createNPCs() {
  const npcs = []
  for (let i = 0; i < NPC_COUNT; i++) {
    npcs.push(spawnNPC(i, 200 + Math.random() * (MOUNTAIN_LENGTH - 400)))
  }
  return npcs
}

// ctx: { player, dt, now }
export function updateNPCs(npcs, ctx) {
  const { player, now } = ctx
  for (const n of npcs) {
    if (n.fallen) {
      if (now > n.fallenUntil) n.fallen = false
      continue
    }
    // gentle weave so they look alive
    n.leanPhase += 0.04
    n.lean = Math.sin(n.leanPhase) * 0.5
    n.worldX += n.lean * 1.4
    if (n.worldX < MIN_X) n.worldX = MIN_X
    if (n.worldX > MAX_X) n.worldX = MAX_X
    n.worldY += n.speed
    // occasionally take a tumble so ski patrol has someone to rescue
    if (!n.fallen && Math.random() < 0.0008) {
      n.fallen = true
      n.fallenUntil = now + 2600
    }
    // recycle: when an NPC drifts far below the player, respawn above
    if (n.worldY - player.worldY > 900) {
      n.worldY = player.worldY - (700 + Math.random() * 600)
      n.worldX = MIN_X + Math.random() * (MAX_X - MIN_X)
      n.speed = 2 + Math.random() * 3
    }
    // also recycle if far above
    if (player.worldY - n.worldY > 900) {
      n.worldY = player.worldY + (700 + Math.random() * 600)
      n.worldX = MIN_X + Math.random() * (MAX_X - MIN_X)
    }
  }
  return npcs
}
