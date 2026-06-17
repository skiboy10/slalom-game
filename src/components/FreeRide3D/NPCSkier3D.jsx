import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// A blocky voxel other-skier at local origin, facing downhill (-Z).
// Parent positions the wrapping group; we only handle the lean bank here.
export default function NPCSkier3D({ color = '#3b82f6', lean = 0, fallen = false, nightMode = false }) {
  const g = useRef()
  useFrame(() => {
    if (!g.current) return
    const roll = fallen ? 1.4 : -lean * 0.4
    g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, roll, 0.15)
  })

  // deterministic helmet shade derived from the jacket color
  const helmet = new THREE.Color(color).multiplyScalar(0.65).getStyle()
  const jacketDark = new THREE.Color(color).multiplyScalar(0.8).getStyle()
  const skin = '#f1c27d'
  // night mode: dim the jacket a touch
  const jacket = nightMode ? new THREE.Color(color).multiplyScalar(0.82).getStyle() : color

  return (
    <group ref={g}>
      {/* skis */}
      <mesh position={[-0.18, 0.05, 0.08]}><boxGeometry args={[0.15, 0.07, 1.4]} /><meshStandardMaterial color="#111827" flatShading /></mesh>
      <mesh position={[0.18, 0.05, 0.08]}><boxGeometry args={[0.15, 0.07, 1.4]} /><meshStandardMaterial color="#111827" flatShading /></mesh>
      {/* upturned tips */}
      <mesh position={[-0.18, 0.11, -0.62]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.15, 0.07, 0.2]} /><meshStandardMaterial color={jacket} flatShading /></mesh>
      <mesh position={[0.18, 0.11, -0.62]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.15, 0.07, 0.2]} /><meshStandardMaterial color={jacket} flatShading /></mesh>
      {/* boots */}
      <mesh position={[-0.15, 0.16, 0]}><boxGeometry args={[0.2, 0.16, 0.26]} /><meshStandardMaterial color="#0f172a" flatShading /></mesh>
      <mesh position={[0.15, 0.16, 0]}><boxGeometry args={[0.2, 0.16, 0.26]} /><meshStandardMaterial color="#0f172a" flatShading /></mesh>
      {/* legs */}
      <mesh position={[0, 0.46, 0]}><boxGeometry args={[0.3, 0.45, 0.24]} /><meshStandardMaterial color="#1e293b" flatShading /></mesh>
      {/* torso / jacket */}
      <mesh position={[0, 0.95, 0]}><boxGeometry args={[0.52, 0.6, 0.34]} /><meshStandardMaterial color={jacket} flatShading /></mesh>
      {/* back stripe trim */}
      <mesh position={[0, 0.92, 0.175]}><boxGeometry args={[0.52, 0.12, 0.02]} /><meshStandardMaterial color={jacketDark} flatShading /></mesh>
      {/* arms */}
      <mesh position={[-0.36, 0.92, 0.02]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.16, 0.52, 0.2]} /><meshStandardMaterial color={jacket} flatShading /></mesh>
      <mesh position={[0.36, 0.92, 0.02]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.16, 0.52, 0.2]} /><meshStandardMaterial color={jacket} flatShading /></mesh>
      {/* head */}
      <mesh position={[0, 1.4, 0]}><boxGeometry args={[0.3, 0.28, 0.3]} /><meshStandardMaterial color={skin} flatShading /></mesh>
      {/* blocky helmet */}
      <mesh position={[0, 1.58, 0]}><boxGeometry args={[0.36, 0.24, 0.36]} /><meshStandardMaterial color={helmet} flatShading /></mesh>
      {/* goggles */}
      <mesh position={[0, 1.42, -0.16]}><boxGeometry args={[0.26, 0.1, 0.05]} /><meshStandardMaterial color="#1f2937" emissive="#60a5fa" emissiveIntensity={nightMode ? 0.5 : 0.1} flatShading /></mesh>
    </group>
  )
}
