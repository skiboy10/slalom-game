// A cozy blocky/voxel A-frame ski lodge at local origin.
// Timber/log walls, snowy pitched roof, glowing windows (brighter at night),
// a chimney with a gentle drifting blocky smoke puff, and a small front deck.
// Flat-shaded, flat colors, no textures.

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Lodge3D({ theme, nightMode = false }) {
  const glow = nightMode ? 1.6 : 0.25
  const smoke = useRef()

  // Gentle rising/drifting smoke puff. No per-frame allocations.
  useFrame((state) => {
    if (!smoke.current) return
    const t = state.clock.elapsedTime
    const cycle = (t % 4) / 4 // 0..1 over 4s
    smoke.current.position.y = 4.0 + cycle * 1.8
    smoke.current.position.x = 1.2 + Math.sin(t * 0.8) * 0.25
    const s = 0.3 + cycle * 0.5
    smoke.current.scale.set(s, s, s)
    smoke.current.material.opacity = (1 - cycle) * 0.55
  })

  const wall = '#8a5a2b'
  const logTrim = '#6b4420'
  const roof = nightMode ? '#3a4a63' : '#4f6079'
  const snow = nightMode ? '#aeb8d8' : '#f4f9ff'
  const winCol = '#ffe49c'

  return (
    <group>
      {/* main timber body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color={wall} flatShading />
      </mesh>
      {/* horizontal log trim bands */}
      <mesh position={[0, 0.55, 1.52]}>
        <boxGeometry args={[4.05, 0.14, 0.06]} />
        <meshStandardMaterial color={logTrim} flatShading />
      </mesh>
      <mesh position={[0, 1.45, 1.52]}>
        <boxGeometry args={[4.05, 0.14, 0.06]} />
        <meshStandardMaterial color={logTrim} flatShading />
      </mesh>

      {/* pitched A-frame roof (prism: a box rotated 45deg, scaled flat) */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[2.3, 2.3, 3.2]} />
        <meshStandardMaterial color={roof} flatShading />
      </mesh>
      {/* snow blanket riding on the roof ridge */}
      <mesh position={[0, 3.0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.5, 1.5, 3.25]} />
        <meshStandardMaterial color={snow} flatShading />
      </mesh>

      {/* glowing windows */}
      <mesh position={[-1.1, 1.05, 1.51]}>
        <boxGeometry args={[0.8, 0.9, 0.06]} />
        <meshStandardMaterial color={winCol} emissive={winCol} emissiveIntensity={glow} flatShading />
      </mesh>
      <mesh position={[1.1, 1.05, 1.51]}>
        <boxGeometry args={[0.8, 0.9, 0.06]} />
        <meshStandardMaterial color={winCol} emissive={winCol} emissiveIntensity={glow} flatShading />
      </mesh>
      {/* front door */}
      <mesh position={[0, 0.6, 1.52]}>
        <boxGeometry args={[0.7, 1.2, 0.06]} />
        <meshStandardMaterial color={logTrim} flatShading />
      </mesh>

      {/* small front deck */}
      <mesh position={[0, 0.05, 2.1]} receiveShadow>
        <boxGeometry args={[3.4, 0.2, 1.2]} />
        <meshStandardMaterial color="#7a5a36" flatShading />
      </mesh>
      <mesh position={[-1.5, -0.35, 2.6]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color={logTrim} flatShading />
      </mesh>
      <mesh position={[1.5, -0.35, 2.6]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color={logTrim} flatShading />
      </mesh>

      {/* chimney */}
      <mesh position={[1.2, 3.2, 0]} castShadow>
        <boxGeometry args={[0.5, 1.4, 0.5]} />
        <meshStandardMaterial color="#5d3a1a" flatShading />
      </mesh>
      <mesh position={[1.2, 3.95, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial color={snow} flatShading />
      </mesh>

      {/* gentle drifting smoke puff */}
      <mesh ref={smoke} position={[1.2, 4.0, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#dfe6ee" transparent opacity={0.5} flatShading depthWrite={false} />
      </mesh>
    </group>
  )
}
