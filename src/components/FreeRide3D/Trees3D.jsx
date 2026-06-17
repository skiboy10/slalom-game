// A single blocky/voxel tree at local origin, styled by the mountain theme's treeType.
// treeType: 'pine' (alpine), 'blossom' (cherry/birch), 'fir' (dense dark), 'rugged'.
// Each tree is a handful of flat-shaded meshes (no textures, no per-frame work,
// no Math.random) so thousands can render cheaply. ~2.5-4 units tall.

export default function Tree3D({ theme, nightMode = false }) {
  const type = theme?.treeType || 'pine'
  const dim = nightMode ? 0.62 : 1

  // Foliage greens (dark/light) per theme; nightMode darkens via multiply factor.
  const palette = {
    pine:    ['#2f6b3a', '#245a30'],
    fir:     ['#14532d', '#0f3d22'],
    rugged:  ['#3a5e44', '#2c4a36'],
    blossom: ['#f9a8d4', '#f472b6'],
  }[type] || ['#2f6b3a', '#245a30']

  const fol = (hex) => (nightMode ? darken(hex, dim) : hex)
  const trunkCol = type === 'blossom' ? '#d9cbb8' : '#5b3a1a'
  const snow = nightMode ? '#aeb8d8' : '#f4f9ff'

  if (type === 'blossom') {
    // Pale birch trunk + puffy PINK blocky canopy (cluster of boxes).
    const lo = fol(palette[0])
    const hi = fol(palette[1])
    return (
      <group>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.26, 1.1, 0.26]} />
          <meshStandardMaterial color={trunkCol} flatShading />
        </mesh>
        {/* puffy canopy: a cluster of pink boxes */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <boxGeometry args={[1.3, 1.0, 1.3]} />
          <meshStandardMaterial color={lo} flatShading />
        </mesh>
        <mesh position={[-0.55, 1.45, 0.35]} castShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color={hi} flatShading />
        </mesh>
        <mesh position={[0.55, 1.5, -0.3]} castShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color={hi} flatShading />
        </mesh>
        <mesh position={[0.1, 2.45, 0.1]} castShadow>
          <boxGeometry args={[0.85, 0.7, 0.85]} />
          <meshStandardMaterial color={lo} flatShading />
        </mesh>
        <mesh position={[-0.35, 2.0, -0.45]} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color={hi} flatShading />
        </mesh>
      </group>
    )
  }

  if (type === 'fir') {
    // Dense dark-green fir, fuller, with heavy white snow clumps ("snow ghost").
    const lo = fol(palette[0])
    const hi = fol(palette[1])
    return (
      <group>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.34, 0.8, 0.34]} />
          <meshStandardMaterial color={trunkCol} flatShading />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <coneGeometry args={[1.15, 1.7, 6]} />
          <meshStandardMaterial color={lo} flatShading />
        </mesh>
        <mesh position={[0, 2.25, 0]} castShadow>
          <coneGeometry args={[0.85, 1.4, 6]} />
          <meshStandardMaterial color={hi} flatShading />
        </mesh>
        <mesh position={[0, 3.05, 0]} castShadow>
          <coneGeometry args={[0.55, 1.1, 6]} />
          <meshStandardMaterial color={lo} flatShading />
        </mesh>
        {/* heavy snow clumps draped on the branches */}
        <mesh position={[0, 3.55, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.5]} />
          <meshStandardMaterial color={snow} flatShading />
        </mesh>
        <mesh position={[-0.5, 1.95, 0.25]}>
          <boxGeometry args={[0.55, 0.4, 0.45]} />
          <meshStandardMaterial color={snow} flatShading />
        </mesh>
        <mesh position={[0.45, 1.55, -0.3]}>
          <boxGeometry args={[0.55, 0.4, 0.45]} />
          <meshStandardMaterial color={snow} flatShading />
        </mesh>
        <mesh position={[0.2, 2.6, 0.35]}>
          <boxGeometry args={[0.4, 0.35, 0.4]} />
          <meshStandardMaterial color={snow} flatShading />
        </mesh>
      </group>
    )
  }

  if (type === 'rugged') {
    // Sparser weathered pine, slightly leaning, darker green, a little snow.
    const lo = fol(palette[0])
    const hi = fol(palette[1])
    return (
      <group rotation={[0, 0, 0.1]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.26, 1.2, 0.26]} />
          <meshStandardMaterial color={trunkCol} flatShading />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <coneGeometry args={[0.8, 1.5, 5]} />
          <meshStandardMaterial color={lo} flatShading />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[0.5, 1.1, 5]} />
          <meshStandardMaterial color={hi} flatShading />
        </mesh>
        {/* a little snow on top */}
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[0.3, 0.28, 0.3]} />
          <meshStandardMaterial color={snow} flatShading />
        </mesh>
      </group>
    )
  }

  // 'pine' (default): tall narrow alpine evergreen — stacked cone tiers + snow dust.
  const lo = fol(palette[0])
  const hi = fol(palette[1])
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.28, 0.9, 0.28]} />
        <meshStandardMaterial color={trunkCol} flatShading />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <coneGeometry args={[0.85, 1.5, 5]} />
        <meshStandardMaterial color={lo} flatShading />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[0.6, 1.3, 5]} />
        <meshStandardMaterial color={hi} flatShading />
      </mesh>
      <mesh position={[0, 3.1, 0]} castShadow>
        <coneGeometry args={[0.38, 1.0, 5]} />
        <meshStandardMaterial color={lo} flatShading />
      </mesh>
      {/* white snow dusting on top */}
      <mesh position={[0, 3.55, 0]}>
        <coneGeometry args={[0.32, 0.5, 5]} />
        <meshStandardMaterial color={snow} flatShading />
      </mesh>
    </group>
  )
}

// Deterministic darken: scale an #rrggbb hex toward black by factor f (0..1).
function darken(hex, f) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * f)
  const g = Math.round(((n >> 8) & 255) * f)
  const b = Math.round((n & 255) * f)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}
