// Coin collectibles — layout + collection. Coins feed the existing shop credits.
import { COIN_COUNT, MOUNTAIN_WIDTH, MOUNTAIN_LENGTH, MIN_X, MAX_X, LIFT_X } from '../../config/freeRideSettings'

const COIN_RADIUS = 16
const PICKUP_DIST = 34

export function createCoins() {
  const coins = []
  for (let i = 0; i < COIN_COUNT; i++) {
    // spread down the mountain, keep clear of the lift edge
    const worldX = Math.max(MIN_X + 30, LIFT_X + 80 + Math.random() * (MAX_X - LIFT_X - 110))
    const worldY = 200 + Math.random() * (MOUNTAIN_LENGTH - 400)
    coins.push({ id: `coin-${i}`, worldX, worldY, collected: false })
  }
  return coins
}

// Returns how many newly collected this tick; mutates `collected` flags in place.
export function collectCoins(coins, player) {
  let collected = 0
  for (const c of coins) {
    if (c.collected) continue
    const dx = c.worldX - player.worldX
    const dy = c.worldY - player.worldY
    if (dx * dx + dy * dy < PICKUP_DIST * PICKUP_DIST) {
      c.collected = true
      collected++
    }
  }
  return collected
}

export { COIN_RADIUS }
