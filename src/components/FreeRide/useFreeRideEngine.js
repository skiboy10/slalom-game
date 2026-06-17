import { useEffect, useRef, useState, useCallback } from 'react'
import {
  VIEW_W, MOUNTAIN_WIDTH, MOUNTAIN_LENGTH, PLAYER_SCREEN_Y,
  MIN_X, MAX_X, TURN_RATE, TUCK_ACCEL, PLOW_DECEL, FRICTION,
  MIN_SPEED, CRUISE_SPEED, MAX_FREE_SPEED, TUMBLE_MS, LIFT_BASE_Y,
} from '../../config/freeRideSettings'
import { createNPCs, updateNPCs } from './npcSystem'
import { createPatrol, updatePatrol } from './patrolSystem'
import { createCoins, collectCoins } from './coinSystem'
import { createTrees, hitsTree, zoneAt } from './terrain'

const now = () => (typeof performance !== 'undefined' ? performance.now() : 0)

// Core Free Ride engine: owns world state, runs the loop, exposes a render snapshot.
// onCoins(n) -> award credits; onSound(name) -> optional sfx hook.
export function useFreeRideEngine({ onCoins, onSound }) {
  const playerRef = useRef({
    worldX: MOUNTAIN_WIDTH / 2, worldY: 60, speed: CRUISE_SPEED,
    lean: 0, tumbleUntil: 0,
  })
  const npcsRef = useRef(createNPCs())
  const patrolRef = useRef(createPatrol())
  const coinsRef = useRef(createCoins())
  const treesRef = useRef(createTrees())
  const inputRef = useRef({ left: false, right: false, tuck: false, plow: false })
  const airborneRef = useRef(false)
  const jumpCooldownRef = useRef(0)
  const coinTotalRef = useRef(0)
  const tricksRef = useRef(0)
  const rafRef = useRef(null)

  const [snapshot, setSnapshot] = useState(() => buildSnapshot())
  const [airborne, setAirborne] = useState(false)
  const [liftRiding, setLiftRiding] = useState(false)

  function buildSnapshot() {
    const p = playerRef.current
    const camX = Math.max(0, Math.min(p.worldX - VIEW_W / 2, MOUNTAIN_WIDTH - VIEW_W))
    const camY = p.worldY - PLAYER_SCREEN_Y
    return {
      camX, camY,
      player: {
        screenX: p.worldX - camX,
        screenY: PLAYER_SCREEN_Y,
        lean: p.lean,
        tumbling: p.tumbleUntil > now(),
        speed: p.speed,
        worldY: p.worldY,
      },
      npcs: npcsRef.current.map(n => ({ ...n })),
      patrol: patrolRef.current.map(p2 => ({ ...p2 })),
      coins: coinsRef.current,
      trees: treesRef.current,
      hud: { coins: coinTotalRef.current, tricks: tricksRef.current, speed: p.speed },
      atLiftBase: p.worldY >= LIFT_BASE_Y - 40,
    }
  }

  // ----- input -----
  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'a' || k === 'arrowleft') inputRef.current.left = true
      else if (k === 'd' || k === 'arrowright') inputRef.current.right = true
      else if (k === 'w' || k === 'arrowup') inputRef.current.tuck = true
      else if (k === 's' || k === 'arrowdown') inputRef.current.plow = true
    }
    const up = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'a' || k === 'arrowleft') inputRef.current.left = false
      else if (k === 'd' || k === 'arrowright') inputRef.current.right = false
      else if (k === 'w' || k === 'arrowup') inputRef.current.tuck = false
      else if (k === 's' || k === 'arrowdown') inputRef.current.plow = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // touch / pointer steering helpers (used by the orchestrator for on-screen taps)
  const setSteer = useCallback((dir) => {
    inputRef.current.left = dir === 'left'
    inputRef.current.right = dir === 'right'
  }, [])
  const clearSteer = useCallback(() => {
    inputRef.current.left = false; inputRef.current.right = false
  }, [])

  // ----- loop -----
  useEffect(() => {
    let mounted = true
    const tick = () => {
      if (!mounted) return
      const t = now()
      const p = playerRef.current

      if (!airborneRef.current && !liftRiding) {
        const tumbling = p.tumbleUntil > t
        if (tumbling) {
          p.speed *= 0.85
          p.worldY += Math.max(0.4, p.speed)
        } else {
          // speed
          const inp = inputRef.current
          if (inp.tuck) p.speed += TUCK_ACCEL
          else if (inp.plow) p.speed -= PLOW_DECEL
          else p.speed += (CRUISE_SPEED - p.speed) * 0.02
          p.speed -= FRICTION
          if (p.speed < MIN_SPEED) p.speed = MIN_SPEED
          if (p.speed > MAX_FREE_SPEED) p.speed = MAX_FREE_SPEED

          // steer
          let target = 0
          if (inp.left) { p.worldX -= TURN_RATE; target = -1 }
          if (inp.right) { p.worldX += TURN_RATE; target = 1 }
          p.lean += (target - p.lean) * 0.2
          if (p.worldX < MIN_X) p.worldX = MIN_X
          if (p.worldX > MAX_X) p.worldX = MAX_X

          // descend
          p.worldY += p.speed

          // tree wipeout
          if (t > jumpCooldownRef.current && hitsTree(treesRef.current, p)) {
            p.tumbleUntil = t + TUMBLE_MS
            p.speed = 1
            onSound && onSound('crash')
          }

          // jump zone -> hand off to Big Air
          const z = zoneAt(p.worldX, p.worldY)
          if (z && z.type === 'jump' && p.speed > 3 && t > jumpCooldownRef.current) {
            airborneRef.current = true
            setAirborne(true)
            onSound && onSound('whoosh')
          }
        }

        // lift base reached -> stop and let the player ride up
        if (p.worldY >= LIFT_BASE_Y) {
          p.worldY = LIFT_BASE_Y
          p.speed = MIN_SPEED
        }

        // world entities
        updateNPCs(npcsRef.current, { player: p, now: t })
        updatePatrol(patrolRef.current, { player: p, playerSpeed: p.speed, npcs: npcsRef.current, now: t })
        const got = collectCoins(coinsRef.current, p)
        if (got > 0) {
          coinTotalRef.current += got
          onCoins && onCoins(got)
          onSound && onSound('coin')
        }
      }

      setSnapshot(buildSnapshot())
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { mounted = false; if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [liftRiding, onCoins, onSound])

  // called by the orchestrator when the Big Air sequence finishes
  const resolveJump = useCallback((bonus = 0) => {
    const p = playerRef.current
    airborneRef.current = false
    jumpCooldownRef.current = now() + 1200
    p.worldY += 80 // land past the jump
    if (bonus > 0) {
      tricksRef.current += 1
      coinTotalRef.current += bonus
      onCoins && onCoins(bonus)
    }
    setAirborne(false)
  }, [onCoins])

  // ride the chairlift back to the top
  const rideLift = useCallback(() => {
    setLiftRiding(true)
    onSound && onSound('whoosh')
    setTimeout(() => {
      const p = playerRef.current
      p.worldY = 60
      p.worldX = MOUNTAIN_WIDTH / 2
      p.speed = CRUISE_SPEED
      setLiftRiding(false)
    }, 1400)
  }, [onSound])

  return { snapshot, airborne, liftRiding, resolveJump, rideLift, setSteer, clearSteer }
}
