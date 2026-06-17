// Blocky/voxel chairlift parts at local origin. Parent places towers/chairs along
// the slope edge. Flat-shaded, flat colors, no textures, no per-frame work.

export function LiftTower3D({ nightMode = false }) {
  const post = nightMode ? '#475569' : '#64748b'
  const metal = nightMode ? '#5b6b7e' : '#7c8a9c'
  const wheel = nightMode ? '#1e293b' : '#334155'

  return (
    <group>
      {/* vertical post */}
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[0.45, 8, 0.45]} />
        <meshStandardMaterial color={post} flatShading />
      </mesh>
      {/* wide base footing */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color={post} flatShading />
      </mesh>
      {/* cross-arm near the top */}
      <mesh position={[0, 7.7, 0]} castShadow>
        <boxGeometry args={[3, 0.4, 0.4]} />
        <meshStandardMaterial color={metal} flatShading />
      </mesh>
      {/* sheave wheels where the cable runs (one each end of the cross-arm) */}
      <mesh position={[-1.35, 7.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 10]} />
        <meshStandardMaterial color={wheel} flatShading />
      </mesh>
      <mesh position={[1.35, 7.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 10]} />
        <meshStandardMaterial color={wheel} flatShading />
      </mesh>
      {/* small hanger brackets from cross-arm down to the wheels */}
      <mesh position={[-1.35, 7.6, 0]}>
        <boxGeometry args={[0.14, 0.3, 0.14]} />
        <meshStandardMaterial color={metal} flatShading />
      </mesh>
      <mesh position={[1.35, 7.6, 0]}>
        <boxGeometry args={[0.14, 0.3, 0.14]} />
        <meshStandardMaterial color={metal} flatShading />
      </mesh>
    </group>
  )
}

export function LiftChair3D({ nightMode = false }) {
  const frame = nightMode ? '#1e293b' : '#334155'
  const hanger = nightMode ? '#64748b' : '#94a3b8'
  const bar = nightMode ? '#b45309' : '#f59e0b'
  const coat = nightMode ? '#1d4ed8' : '#3b82f6'
  const skin = '#e8b48a'
  const ski = nightMode ? '#cbd5e1' : '#e2e8f0'

  return (
    <group>
      {/* hanger bar up to the cable */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color={hanger} flatShading />
      </mesh>
      {/* grip clamp at the top (where it rides the cable) */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.22, 0.18, 0.22]} />
        <meshStandardMaterial color={hanger} flatShading />
      </mesh>

      {/* seat */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <boxGeometry args={[1.0, 0.15, 0.7]} />
        <meshStandardMaterial color={frame} flatShading />
      </mesh>
      {/* backrest */}
      <mesh position={[0, -0.65, -0.32]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.1]} />
        <meshStandardMaterial color={frame} flatShading />
      </mesh>
      {/* safety bar across the front, lowered */}
      <mesh position={[0, -0.5, 0.34]}>
        <boxGeometry args={[1.0, 0.07, 0.07]} />
        <meshStandardMaterial color={bar} flatShading />
      </mesh>
      <mesh position={[-0.45, -0.7, 0.17]}>
        <boxGeometry args={[0.07, 0.5, 0.07]} />
        <meshStandardMaterial color={bar} flatShading />
      </mesh>
      <mesh position={[0.45, -0.7, 0.17]}>
        <boxGeometry args={[0.07, 0.5, 0.07]} />
        <meshStandardMaterial color={bar} flatShading />
      </mesh>

      {/* little seated blocky rider */}
      {/* body */}
      <mesh position={[0, -0.55, -0.05]} castShadow>
        <boxGeometry args={[0.42, 0.5, 0.32]} />
        <meshStandardMaterial color={coat} flatShading />
      </mesh>
      {/* head */}
      <mesh position={[0, -0.18, -0.05]} castShadow>
        <boxGeometry args={[0.26, 0.26, 0.26]} />
        <meshStandardMaterial color={skin} flatShading />
      </mesh>
      {/* hat */}
      <mesh position={[0, -0.02, -0.05]}>
        <boxGeometry args={[0.3, 0.12, 0.3]} />
        <meshStandardMaterial color={bar} flatShading />
      </mesh>
      {/* upper legs resting on seat */}
      <mesh position={[0, -0.82, 0.18]}>
        <boxGeometry args={[0.34, 0.16, 0.45]} />
        <meshStandardMaterial color={frame} flatShading />
      </mesh>
      {/* dangling lower legs */}
      <mesh position={[-0.13, -1.25, 0.32]}>
        <boxGeometry args={[0.13, 0.6, 0.13]} />
        <meshStandardMaterial color={frame} flatShading />
      </mesh>
      <mesh position={[0.13, -1.25, 0.32]}>
        <boxGeometry args={[0.13, 0.6, 0.13]} />
        <meshStandardMaterial color={frame} flatShading />
      </mesh>
      {/* dangling skis */}
      <mesh position={[-0.13, -1.55, 0.45]}>
        <boxGeometry args={[0.12, 0.05, 0.9]} />
        <meshStandardMaterial color={ski} flatShading />
      </mesh>
      <mesh position={[0.13, -1.55, 0.45]}>
        <boxGeometry args={[0.12, 0.05, 0.9]} />
        <meshStandardMaterial color={ski} flatShading />
      </mesh>
    </group>
  )
}
