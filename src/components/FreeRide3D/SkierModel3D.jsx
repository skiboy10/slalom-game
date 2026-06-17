import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// The player's blocky voxel skier, rendered at local origin facing downhill (-Z).
// Parent positions the group at [skierX, 0, 0]; we only handle rotation/bob here.
export default function SkierModel3D({ lean = 0, speed = 0, skierStyle = {}, nightMode = false, tumbling = false }) {
  const g = useRef()
  const suit = skierStyle.suit || '#3b82f6'
  const helmet = skierStyle.helmet || '#ef4444'
  const goggles = skierStyle.goggles || '#fbbf24'
  // deterministic darker shade of the suit for trims/gloves
  const suitDark = new THREE.Color(suit).multiplyScalar(0.7).getStyle()
  const skin = '#f1c27d'

  useFrame((state) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    if (tumbling) {
      // full wipeout spin around forward + roll axes
      g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, Math.sin(t * 18), 0.3)
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, t * 6, 0.3)
      g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, t * 4, 0.3)
      g.current.position.y = 0.02 + Math.abs(Math.sin(t * 9)) * 0.25
    } else {
      g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, -lean * 0.5, 0.2)
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, 0, 0.2)
      g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, lean * 0.25, 0.15)
      // subtle speed-based bob
      g.current.position.y = 0.02 + Math.abs(Math.sin(t * 12 * (0.3 + speed))) * 0.04
    }
  })

  return (
    <group ref={g}>
      {/* skis */}
      <mesh position={[-0.22, 0.05, 0.1]} castShadow><boxGeometry args={[0.18, 0.08, 1.7]} /><meshStandardMaterial color="#111827" flatShading /></mesh>
      <mesh position={[0.22, 0.05, 0.1]} castShadow><boxGeometry args={[0.18, 0.08, 1.7]} /><meshStandardMaterial color="#111827" flatShading /></mesh>
      {/* upturned ski tips */}
      <mesh position={[-0.22, 0.12, -0.78]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.18, 0.08, 0.22]} /><meshStandardMaterial color={suit} flatShading /></mesh>
      <mesh position={[0.22, 0.12, -0.78]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.18, 0.08, 0.22]} /><meshStandardMaterial color={suit} flatShading /></mesh>
      {/* boots */}
      <mesh position={[-0.18, 0.18, 0]} castShadow><boxGeometry args={[0.24, 0.2, 0.32]} /><meshStandardMaterial color="#0f172a" flatShading /></mesh>
      <mesh position={[0.18, 0.18, 0]} castShadow><boxGeometry args={[0.24, 0.2, 0.32]} /><meshStandardMaterial color="#0f172a" flatShading /></mesh>
      {/* legs */}
      <mesh position={[-0.18, 0.55, 0]} castShadow><boxGeometry args={[0.22, 0.55, 0.28]} /><meshStandardMaterial color="#1e293b" flatShading /></mesh>
      <mesh position={[0.18, 0.55, 0]} castShadow><boxGeometry args={[0.22, 0.55, 0.28]} /><meshStandardMaterial color="#1e293b" flatShading /></mesh>
      {/* torso */}
      <mesh position={[0, 1.05, 0]} castShadow><boxGeometry args={[0.62, 0.7, 0.4]} /><meshStandardMaterial color={suit} flatShading /></mesh>
      {/* chest stripe trim */}
      <mesh position={[0, 1.0, -0.205]}><boxGeometry args={[0.62, 0.14, 0.02]} /><meshStandardMaterial color={suitDark} flatShading /></mesh>
      {/* small backpack on the back */}
      <mesh position={[0, 1.1, 0.26]} castShadow><boxGeometry args={[0.4, 0.5, 0.18]} /><meshStandardMaterial color={suitDark} flatShading /></mesh>
      {/* arms (bent slightly forward to hold poles) */}
      <mesh position={[-0.42, 1.0, 0.04]} rotation={[0.25, 0, 0]} castShadow><boxGeometry args={[0.2, 0.6, 0.22]} /><meshStandardMaterial color={suit} flatShading /></mesh>
      <mesh position={[0.42, 1.0, 0.04]} rotation={[0.25, 0, 0]} castShadow><boxGeometry args={[0.2, 0.6, 0.22]} /><meshStandardMaterial color={suit} flatShading /></mesh>
      {/* gloves */}
      <mesh position={[-0.42, 0.72, -0.16]}><boxGeometry args={[0.18, 0.16, 0.18]} /><meshStandardMaterial color={suitDark} flatShading /></mesh>
      <mesh position={[0.42, 0.72, -0.16]}><boxGeometry args={[0.18, 0.16, 0.18]} /><meshStandardMaterial color={suitDark} flatShading /></mesh>
      {/* ski poles (angled forward-down) */}
      <mesh position={[-0.5, 0.5, -0.05]} rotation={[0.35, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 1.0, 6]} /><meshStandardMaterial color="#9ca3af" flatShading /></mesh>
      <mesh position={[0.5, 0.5, -0.05]} rotation={[0.35, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 1.0, 6]} /><meshStandardMaterial color="#9ca3af" flatShading /></mesh>
      {/* pole baskets */}
      <mesh position={[-0.5, 0.06, 0.25]}><cylinderGeometry args={[0.08, 0.08, 0.03, 6]} /><meshStandardMaterial color="#374151" flatShading /></mesh>
      <mesh position={[0.5, 0.06, 0.25]}><cylinderGeometry args={[0.08, 0.08, 0.03, 6]} /><meshStandardMaterial color="#374151" flatShading /></mesh>
      {/* neck/chin */}
      <mesh position={[0, 1.42, 0]}><boxGeometry args={[0.26, 0.12, 0.26]} /><meshStandardMaterial color={skin} flatShading /></mesh>
      {/* head + helmet */}
      <mesh position={[0, 1.66, 0]} castShadow><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color={helmet} flatShading /></mesh>
      {/* goggles strap around the back of the helmet */}
      <mesh position={[0, 1.7, 0.205]}><boxGeometry args={[0.42, 0.12, 0.02]} /><meshStandardMaterial color={goggles} flatShading /></mesh>
      {/* goggles on the face */}
      <mesh position={[0, 1.68, -0.21]}><boxGeometry args={[0.34, 0.14, 0.06]} /><meshStandardMaterial color={goggles} emissive={goggles} emissiveIntensity={nightMode ? 0.6 : 0.15} flatShading /></mesh>
    </group>
  )
}
