import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// A spinning chunky gold voxel coin at local origin, embossed with a star.
// Parent positions the wrapping group; we keep the spin + vertical bob.
export default function Coin3D({ nightMode = false }) {
  const g = useRef()
  useFrame((state, delta) => {
    if (!g.current) return
    g.current.rotation.y += delta * 3
    g.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.12
  })

  const gold = '#fbbf24'
  const goldBright = '#fde68a'
  const glow = nightMode ? 1.1 : 0.4

  // five-point embossed star, points derived deterministically
  const starPts = []
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
    starPts.push([Math.cos(a) * 0.22, Math.sin(a) * 0.22, a])
  }

  return (
    <group ref={g} position={[0, 1, 0]}>
     {/* tilt the disc upright so it stands on edge; outer group spins on Y to flash the faces */}
     <group rotation={[Math.PI / 2, 0, 0]}>
      {/* coin body (cylinder axis = local Y, tilted to point toward camera) */}
      <mesh castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.14, 16]} />
        <meshStandardMaterial color={gold} metalness={0.7} roughness={0.3}
          emissive="#f59e0b" emissiveIntensity={glow} flatShading />
      </mesh>
      {/* brighter raised rim */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 0.16, 16, 1, true]} />
        <meshStandardMaterial color={goldBright} metalness={0.8} roughness={0.2}
          emissive="#fbbf24" emissiveIntensity={glow} flatShading />
      </mesh>
      {/* embossed star on the front face (+local-Y) */}
      <group position={[0, 0.075, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.16, 0.03, 0.16]} /><meshStandardMaterial color={goldBright} emissive="#fde68a" emissiveIntensity={glow} flatShading /></mesh>
        {starPts.map(([x, z, a], i) => (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.1, 0.03, 0.16]} />
            <meshStandardMaterial color={goldBright} emissive="#fde68a" emissiveIntensity={glow} flatShading />
          </mesh>
        ))}
      </group>
      {/* embossed star on the back face (-local-Y) */}
      <group position={[0, -0.075, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.16, 0.03, 0.16]} /><meshStandardMaterial color={goldBright} emissive="#fde68a" emissiveIntensity={glow} flatShading /></mesh>
        {starPts.map(([x, z, a], i) => (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.1, 0.03, 0.16]} />
            <meshStandardMaterial color={goldBright} emissive="#fde68a" emissiveIntensity={glow} flatShading />
          </mesh>
        ))}
      </group>
     </group>
    </group>
  )
}
