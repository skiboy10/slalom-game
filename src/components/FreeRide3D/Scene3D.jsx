import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sky, Stars, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import {
  palette, SLOPE_HALF_WIDTH, TURN_ACCEL, START_SPEED, CRUISE_SPEED, MAX_SPEED,
  MIN_SPEED, TUCK_GAIN, PLOW_DROP, WARN_SPEED, RUN_LENGTH,
} from './mountains'
import MountainBackdrop from './MountainBackdrop'
import SkierModel3D from './SkierModel3D'
import NPCSkier3D from './NPCSkier3D'
import SkiPatrol3D from './SkiPatrol3D'
import Coin3D from './Coin3D'
import Tree3D from './Trees3D'
import Lodge3D from './Lodge3D'
import { LiftTower3D, LiftChair3D } from './Chairlift3D'

const NPC_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#22d3ee', '#a3e635', '#f97316']

// Build all the (fixed) entities once for a run.
function buildEntities() {
  const coins = []
  for (let i = 0; i < 44; i++) {
    coins.push({ id: i, x: (Math.random() * 2 - 1) * (SLOPE_HALF_WIDTH - 1), z: -25 - Math.random() * (RUN_LENGTH - 40), got: false })
  }
  const npcs = []
  for (let i = 0; i < 9; i++) {
    const fallen = Math.random() < 0.25
    npcs.push({ id: i, x: (Math.random() * 2 - 1) * (SLOPE_HALF_WIDTH - 1), z: -40 - Math.random() * (RUN_LENGTH - 60), color: NPC_COLORS[i % NPC_COLORS.length], fallen })
  }
  const patrol = []
  for (let i = 0; i < 2; i++) {
    patrol.push({ id: i, x: (Math.random() * 2 - 1) * (SLOPE_HALF_WIDTH - 2), z: -60 - Math.random() * (RUN_LENGTH - 80) })
  }
  // trees densely line the run corridor (just outside the slope), plus a few inside
  const trees = []
  let tid = 0
  for (let z = -10; z > -RUN_LENGTH; z -= 6 + Math.random() * 6) {
    const side = Math.random() > 0.5 ? 1 : -1
    trees.push({ id: tid++, x: side * (SLOPE_HALF_WIDTH + 2 + Math.random() * 22), z, scale: 0.8 + Math.random() * 1.1 })
    if (Math.random() < 0.5) trees.push({ id: tid++, x: -side * (SLOPE_HALF_WIDTH + 2 + Math.random() * 22), z: z - 3, scale: 0.8 + Math.random() * 1.1 })
  }
  // jump ramps
  const jumps = [{ id: 0, x: 0, z: -120 }, { id: 1, x: -3, z: -340 }, { id: 2, x: 4, z: -600 }]
  return { coins, npcs, patrol, trees, jumps }
}

function Snow({ count = 1200, color = '#ffffff', speed = 1 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 60
      a[i * 3 + 1] = Math.random() * 30
      a[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10
    }
    return a
  }, [count])
  useFrame((_, delta) => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      p.array[i * 3 + 1] -= (2 + speed * 4) * delta
      p.array[i * 3 + 2] += (4 + speed * 30) * delta
      if (p.array[i * 3 + 1] < 0) p.array[i * 3 + 1] = 30
      if (p.array[i * 3 + 2] > 20) p.array[i * 3 + 2] = -60
    }
    p.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.14} color={color} transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

// Chairs slide up the cable on the left.
function Chairs({ nightMode }) {
  const g = useRef()
  useFrame((_, delta) => {
    if (!g.current) return
    g.current.children.forEach((c) => {
      c.position.z -= delta * 6
      if (c.position.z < -40) c.position.z = 40
    })
  })
  const chairs = []
  for (let i = 0; i < 14; i++) chairs.push(<group key={i} position={[-SLOPE_HALF_WIDTH - 4, 7, 40 - i * 6]}><LiftChair3D nightMode={nightMode} /></group>)
  return <group ref={g}>{chairs}</group>
}

export default function Scene3D({ theme, nightMode, started, skierStyle, addCredits, hudRef, bridgeRef }) {
  const { camera } = useThree()
  const p = palette(theme, nightMode)
  const ent = useMemo(buildEntities, [theme.id])
  const [coins, setCoins] = useState(ent.coins)
  const [npcs, setNpcs] = useState(ent.npcs)
  const player = useRef({ x: 0, speed: START_SPEED, lean: 0, distance: 0, tumbleUntil: 0, airT: -1 })
  const worldRef = useRef()
  const riderRef = useRef()
  const keys = useRef({})
  const [warning, setWarning] = useState(false)
  const warnRef = useRef(false)

  // reset coins when entity set changes (new mountain)
  useEffect(() => { setCoins(ent.coins); setNpcs(ent.npcs); player.current = { x: 0, speed: START_SPEED, lean: 0, distance: 0, tumbleUntil: 0, airT: -1 } }, [ent])

  useEffect(() => {
    const dn = (e) => { keys.current[e.key.toLowerCase()] = true }
    const up = (e) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up) }
  }, [])

  // expose rideLift to the parent HUD
  useEffect(() => {
    if (!bridgeRef) return
    bridgeRef.current = {
      rideLift: () => {
        const pl = player.current
        pl.distance = 0; pl.x = 0; pl.speed = CRUISE_SPEED
        setCoins(cs => cs.map(c => ({ ...c, got: false })))
      },
    }
  }, [bridgeRef])

  useFrame((state, delta) => {
    const pl = player.current
    const t = state.clock.elapsedTime
    const atBase = pl.distance >= RUN_LENGTH

    if (started && !atBase) {
      const k = keys.current
      const tumbling = t < pl.tumbleUntil
      // steer
      let target = 0
      if (!tumbling) {
        if (k['a'] || k['arrowleft']) { pl.x = Math.max(-SLOPE_HALF_WIDTH, pl.x - TURN_ACCEL * delta); target = -1 }
        if (k['d'] || k['arrowright']) { pl.x = Math.min(SLOPE_HALF_WIDTH, pl.x + TURN_ACCEL * delta); target = 1 }
      }
      pl.lean = THREE.MathUtils.lerp(pl.lean, target, 0.15)
      // speed
      if (tumbling) pl.speed *= 0.9
      else if (k['w'] || k['arrowup']) pl.speed += TUCK_GAIN
      else if (k['s'] || k['arrowdown']) pl.speed -= PLOW_DROP
      else pl.speed += (CRUISE_SPEED - pl.speed) * 0.02
      pl.speed = THREE.MathUtils.clamp(pl.speed, MIN_SPEED, MAX_SPEED)
      pl.distance = Math.min(RUN_LENGTH, pl.distance + pl.speed)

      // jumps -> little hop
      if (pl.airT < 0) {
        for (const j of ent.jumps) {
          const sz = j.z + pl.distance
          if (sz > -1.5 && sz < 1.5 && Math.abs(j.x - pl.x) < 2.2 && pl.speed > 0.4) { pl.airT = 0 }
        }
      }
    }

    // jump arc
    let riderY = 0
    if (pl.airT >= 0) {
      pl.airT += delta
      const dur = 0.9
      const prog = pl.airT / dur
      riderY = Math.sin(Math.min(prog, 1) * Math.PI) * 2.2
      if (prog >= 1) { pl.airT = -1; if (addCredits) addCredits(2); }
    }

    // world scroll + rider
    if (worldRef.current) worldRef.current.position.z = pl.distance
    if (riderRef.current) { riderRef.current.position.x = pl.x; riderRef.current.position.y = riderY }

    // coin pickup
    let collected = 0
    for (const c of coins) {
      if (c.got) continue
      const sz = c.z + pl.distance
      if (sz > -1.4 && sz < 1.6 && Math.abs(c.x - pl.x) < 1.3 && Math.abs(riderY - 1) < 1.4) { c.got = true; collected++ }
    }
    if (collected > 0) { setCoins(cs => [...cs]); if (addCredits) addCredits(collected) }

    // warn state when bombing
    const speeding = pl.speed > WARN_SPEED
    if (speeding !== warnRef.current) { warnRef.current = speeding; setWarning(speeding) }

    // camera (behind the skier)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pl.x * 0.35, 0.1)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.6 + pl.speed * 2.2, 0.08)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 - pl.speed * 3.5, 0.08)
    camera.lookAt(pl.x * 0.5, 0.8, -10)
    camera.fov = 55 + pl.speed * 22
    camera.updateProjectionMatrix()

    // report to HUD
    if (hudRef) hudRef.current = { coins: coins.filter(c => c.got).length, speed: pl.speed, atBase }
  })

  const coinCount = coins.length

  return (
    <Suspense fallback={null}>
      {nightMode
        ? <Stars radius={120} depth={40} count={1500} factor={4} fade speed={1} />
        : <Sky sunPosition={p.sun} turbidity={6} rayleigh={1.2} />}
      <color attach="background" args={[p.sky]} />
      <fog attach="fog" args={[p.fog, p.fogNear, p.fogFar]} />
      <ambientLight intensity={nightMode ? 0.35 : 0.6} />
      <directionalLight position={p.sun} intensity={nightMode ? 0.5 : 1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={[p.sky, p.snow, nightMode ? 0.3 : 0.6]} />

      {/* slope */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -RUN_LENGTH / 2]} receiveShadow>
        <planeGeometry args={[120, RUN_LENGTH + 200]} />
        <meshStandardMaterial color={p.snow} roughness={0.95} />
      </mesh>

      {/* distant mountain silhouette */}
      <MountainBackdrop theme={theme} nightMode={nightMode} />

      {/* chairlift towers (fixed) + sliding chairs */}
      <group>
        {Array.from({ length: 10 }).map((_, i) => (
          <group key={i} position={[-SLOPE_HALF_WIDTH - 4, 0, -i * 30]}><LiftTower3D nightMode={nightMode} /></group>
        ))}
      </group>
      <Chairs nightMode={nightMode} />

      {/* the moving world: everything placed along the run */}
      <group ref={worldRef}>
        {/* lodge near the top */}
        <group position={[SLOPE_HALF_WIDTH + 8, 0, -14]}><Lodge3D theme={theme} nightMode={nightMode} /></group>

        {ent.trees.map(tr => (
          <group key={tr.id} position={[tr.x, 0, tr.z]} scale={tr.scale}><Tree3D theme={theme} nightMode={nightMode} /></group>
        ))}

        {coins.map(c => c.got ? null : (
          <group key={c.id} position={[c.x, 0, c.z]}><Coin3D nightMode={nightMode} /></group>
        ))}

        {npcs.map(n => (
          <group key={n.id} position={[n.x, 0, n.z]}><NPCSkier3D color={n.color} fallen={n.fallen} nightMode={nightMode} /></group>
        ))}

        {ent.patrol.map((pt, i) => (
          <group key={pt.id} position={[pt.x, 0, pt.z]}><SkiPatrol3D state={warning ? 'warn' : 'cruise'} nightMode={nightMode} /></group>
        ))}

        {/* jump ramps */}
        {ent.jumps.map(j => (
          <mesh key={j.id} position={[j.x, 0.6, j.z]} rotation={[-0.5, 0, 0]} castShadow>
            <boxGeometry args={[4, 0.4, 3]} />
            <meshStandardMaterial color={nightMode ? '#cdd9f0' : '#ffffff'} />
          </mesh>
        ))}
      </group>

      {/* the player */}
      <group ref={riderRef}><SkierModel3D lean={player.current.lean} speed={player.current.speed} skierStyle={skierStyle} nightMode={nightMode} /></group>

      <Snow count={nightMode ? 900 : 1200} color={nightMode ? '#cbd5e1' : '#ffffff'} speed={0.6} />
    </Suspense>
  )
}
