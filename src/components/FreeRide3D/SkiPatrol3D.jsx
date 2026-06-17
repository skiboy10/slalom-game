import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

// Blocky voxel ski patrol at local origin, facing downhill (-Z).
// state: 'cruise' | 'rescue' | 'warn'. Parent positions the wrapping group.
export default function SkiPatrol3D({ state = 'cruise', lean = 0, nightMode = false }) {
  const g = useRef()
  const armR = useRef()
  useFrame((s) => {
    if (g.current) {
      const roll = state === 'cruise' ? -lean * 0.4 : 0
      g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, roll, 0.15)
      // rescue = hunched forward over the patient
      const hunch = state === 'rescue' ? 0.5 : 0
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, hunch, 0.15)
    }
    // 'warn' = raise + wave the right arm
    if (armR.current) {
      const target = state === 'warn' ? -2.1 + Math.sin(s.clock.elapsedTime * 8) * 0.4 : 0.2
      armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, target, 0.2)
    }
  })

  const red = nightMode ? '#b91c1c' : '#dc2626'
  const skin = '#f1c27d'

  return (
    <group>
      {state === 'warn' && (
        <Html center position={[0, 2.4, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{ background: '#fde047', color: '#7c2d12', fontWeight: 800, fontSize: 11, padding: '2px 6px', borderRadius: 6, whiteSpace: 'nowrap' }}>⚠️ Slow down!</div>
        </Html>
      )}
      <group ref={g}>
        {/* skis */}
        <mesh position={[-0.18, 0.05, 0.08]}><boxGeometry args={[0.15, 0.07, 1.4]} /><meshStandardMaterial color="#111827" flatShading /></mesh>
        <mesh position={[0.18, 0.05, 0.08]}><boxGeometry args={[0.15, 0.07, 1.4]} /><meshStandardMaterial color="#111827" flatShading /></mesh>
        <mesh position={[-0.18, 0.11, -0.62]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.15, 0.07, 0.2]} /><meshStandardMaterial color={red} flatShading /></mesh>
        <mesh position={[0.18, 0.11, -0.62]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.15, 0.07, 0.2]} /><meshStandardMaterial color={red} flatShading /></mesh>
        {/* boots */}
        <mesh position={[-0.15, 0.16, 0]}><boxGeometry args={[0.2, 0.16, 0.26]} /><meshStandardMaterial color="#0f172a" flatShading /></mesh>
        <mesh position={[0.15, 0.16, 0]}><boxGeometry args={[0.2, 0.16, 0.26]} /><meshStandardMaterial color="#0f172a" flatShading /></mesh>
        {/* legs */}
        <mesh position={[0, 0.46, 0]}><boxGeometry args={[0.3, 0.45, 0.24]} /><meshStandardMaterial color="#1e293b" flatShading /></mesh>
        {/* red jacket */}
        <mesh position={[0, 0.95, 0]}><boxGeometry args={[0.52, 0.6, 0.34]} /><meshStandardMaterial color={red} flatShading /></mesh>
        {/* bold WHITE CROSS on the BACK (+Z faces the camera) */}
        <mesh position={[0, 0.95, 0.18]}><boxGeometry args={[0.12, 0.42, 0.05]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
        <mesh position={[0, 0.95, 0.18]}><boxGeometry args={[0.36, 0.12, 0.05]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
        {/* small white-cross medic backpack on the back */}
        <mesh position={[0, 1.0, 0.3]} castShadow><boxGeometry args={[0.34, 0.42, 0.16]} /><meshStandardMaterial color="#f3f4f6" flatShading /></mesh>
        <mesh position={[0, 1.0, 0.39]}><boxGeometry args={[0.08, 0.26, 0.03]} /><meshStandardMaterial color={red} flatShading /></mesh>
        <mesh position={[0, 1.0, 0.39]}><boxGeometry args={[0.24, 0.08, 0.03]} /><meshStandardMaterial color={red} flatShading /></mesh>
        {/* left arm (static) */}
        <mesh position={[-0.36, 0.92, 0.02]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.16, 0.52, 0.2]} /><meshStandardMaterial color={red} flatShading /></mesh>
        {/* right arm (pivots from shoulder for the wave) */}
        <group ref={armR} position={[0.36, 1.18, 0]}>
          <mesh position={[0, -0.26, 0.02]}><boxGeometry args={[0.16, 0.52, 0.2]} /><meshStandardMaterial color={red} flatShading /></mesh>
          <mesh position={[0, -0.56, 0.02]}><boxGeometry args={[0.15, 0.14, 0.18]} /><meshStandardMaterial color={skin} flatShading /></mesh>
        </group>
        {/* head */}
        <mesh position={[0, 1.4, 0]}><boxGeometry args={[0.3, 0.28, 0.3]} /><meshStandardMaterial color={skin} flatShading /></mesh>
        {/* red helmet */}
        <mesh position={[0, 1.58, 0]}><boxGeometry args={[0.36, 0.24, 0.36]} /><meshStandardMaterial color={red} flatShading /></mesh>
        {/* tiny white cross on helmet back */}
        <mesh position={[0, 1.58, 0.185]}><boxGeometry args={[0.06, 0.16, 0.02]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
        <mesh position={[0, 1.58, 0.185]}><boxGeometry args={[0.16, 0.06, 0.02]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
        {/* goggles */}
        <mesh position={[0, 1.42, -0.16]}><boxGeometry args={[0.26, 0.1, 0.05]} /><meshStandardMaterial color="#1f2937" emissive="#60a5fa" emissiveIntensity={nightMode ? 0.5 : 0.1} flatShading /></mesh>
      </group>
    </group>
  )
}
