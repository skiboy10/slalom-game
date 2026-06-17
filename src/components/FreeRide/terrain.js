// Static terrain: trees placed inside forest zones (used for both rendering & collision).
import { ZONES, TREE_COUNT } from '../../config/freeRideSettings'

const TRUNK_HALF = 7   // collision half-width around a tree trunk

export function createTrees() {
  const forests = ZONES.filter(z => z.type === 'forest')
  if (forests.length === 0) return []
  const trees = []
  for (let i = 0; i < TREE_COUNT; i++) {
    const z = forests[i % forests.length]
    trees.push({
      id: `frtree-${i}`,
      worldX: z.x + 20 + Math.random() * (z.w - 40),
      worldY: z.y + 20 + Math.random() * (z.h - 40),
      size: 0.7 + Math.random() * 0.6,
      flipped: Math.random() > 0.5,
    })
  }
  // draw far trees first
  trees.sort((a, b) => a.worldY - b.worldY)
  return trees
}

// true if the player overlaps a tree trunk (triggers a harmless tumble)
export function hitsTree(trees, player) {
  for (const t of trees) {
    const half = TRUNK_HALF * t.size + 10
    const dx = Math.abs(t.worldX - player.worldX)
    const dy = Math.abs(t.worldY - player.worldY)
    if (dx < half && dy < 18) return t
  }
  return null
}

// which zone type the player is currently in (first match)
export function zoneAt(worldX, worldY) {
  for (const z of ZONES) {
    if (worldX >= z.x && worldX <= z.x + z.w && worldY >= z.y && worldY <= z.y + z.h) {
      return z
    }
  }
  return null
}
