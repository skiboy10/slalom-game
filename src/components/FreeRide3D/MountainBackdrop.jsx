import { memo } from 'react'
import * as THREE from 'three'
import { palette } from './mountains'

// The big distant mountain silhouette behind/around the slope, per theme.backdrop:
// 'matterhorn' | 'fuji' | 'whistler' | 'teton'.
//
// Style: blocky/voxel (Minecraft-y). Peaks are built from stacked boxes and
// low-segment (4-sided) cones/pyramids with flatShading. A slightly darker rock
// material is used on one side of each massif to fake one-directional shading.
// The hero mountain sits far down-slope (z ~ -150..-280) and towers on the
// horizon; side ridges/foothills at large ±X surround the rider on all sides.
// Everything is static (no per-frame work, no Math.random in render).

// ---- small color helpers ---------------------------------------------------
// Reuse one Color instance to avoid allocating on every shade() call.
const _tmpColor = new THREE.Color()
const shade = (hex, f) => '#' + _tmpColor.set(hex).multiplyScalar(f).getHexString()

// A blocky pyramid built from a 4-sided cone (voxel-ish silhouette).
function Pyramid({ position = [0, 0, 0], radius, height, color, rotation = [0, Math.PI / 4, 0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[radius, height, 4]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

// A plain box block.
function Block({ position, size, color, rotation }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

// ---- MATTERHORN: one steep sharp pyramid with a hooked summit --------------
function Matterhorn({ p }) {
  const rock = p.rock
  const darkRock = shade(rock, 0.7)
  const snow = p.peakSnow
  return (
    <group position={[0, 0, -210]}>
      {/* broad rocky base, two stacked blocks for a chunky voxel footing */}
      <Block position={[0, 14, 0]} size={[110, 28, 110]} color={darkRock} />
      <Block position={[0, 36, 0]} size={[86, 22, 86]} color={rock} />
      {/* main steep pyramid (tall + narrow) */}
      <Pyramid position={[0, 78, 0]} radius={42} height={96} color={rock} />
      {/* darker shaded face offset to one side for depth */}
      <Pyramid position={[-9, 76, -6]} radius={34} height={92} color={darkRock} />
      {/* white snow cap */}
      <Pyramid position={[0, 118, 0]} radius={17} height={34} color={snow} />
      {/* the famous slightly-bent/hooked summit — a tilted block leaning over */}
      <Block
        position={[6, 132, 0]}
        size={[12, 18, 12]}
        color={snow}
        rotation={[0, Math.PI / 4, -0.42]}
      />
      {/* a few snow streaks running down the faces (thin tilted blocks) */}
      <Block position={[-14, 92, 14]} size={[3, 40, 3]} color={snow} rotation={[0.1, 0.6, 0.12]} />
      <Block position={[12, 84, 16]} size={[3, 34, 3]} color={snow} rotation={[0.1, -0.5, -0.1]} />
      <Block position={[2, 70, 22]} size={[3, 30, 3]} color={snow} rotation={[0.1, 0.2, 0.04]} />
    </group>
  )
}

// ---- FUJI: wide smooth symmetrical cone, flattened crater top, serene ------
function Fuji({ p }) {
  const snow = p.peakSnow
  const lowerSnow = p.snow
  const rock = p.rock
  const darkRock = shade(rock, 0.72)
  return (
    <group position={[0, 0, -250]}>
      {/* very wide, low cone — Fuji's gentle symmetry. Many segments = smooth. */}
      <mesh position={[0, 36, 0]}>
        <coneGeometry args={[130, 78, 24]} />
        <meshStandardMaterial color={snow} flatShading />
      </mesh>
      {/* subtle darker side for depth (slightly offset, slightly smaller) */}
      <mesh position={[-10, 34, -6]}>
        <coneGeometry args={[120, 74, 24]} />
        <meshStandardMaterial color={shade(snow, 0.9)} flatShading />
      </mesh>
      {/* a couple of darker rock bands near the base */}
      <mesh position={[0, 14, 0]}>
        <cylinderGeometry args={[114, 124, 18, 24]} />
        <meshStandardMaterial color={rock} flatShading />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[122, 132, 8, 24]} />
        <meshStandardMaterial color={darkRock} flatShading />
      </mesh>
      {/* flattened / crater top: a short wide cylinder with a darker inset */}
      <mesh position={[0, 74, 0]}>
        <cylinderGeometry args={[20, 26, 8, 18]} />
        <meshStandardMaterial color={snow} flatShading />
      </mesh>
      <mesh position={[0, 77, 0]}>
        <cylinderGeometry args={[13, 16, 5, 18]} />
        <meshStandardMaterial color={shade(lowerSnow, 0.85)} flatShading />
      </mesh>
    </group>
  )
}

// ---- WHISTLER: two adjacent glaciated peaks, rocky shoulders, forest base --
function Whistler({ p }) {
  const rock = p.rock
  const darkRock = shade(rock, 0.7)
  const glacier = p.peakSnow
  const forest = p.accent // greenish accent for day theme
  const darkForest = shade(forest, 0.7)
  return (
    <group position={[0, 0, -230]}>
      {/* shared chunky base ridge */}
      <Block position={[0, 16, 0]} size={[200, 32, 90]} color={darkRock} />
      <Block position={[0, 40, 0]} size={[170, 24, 78]} color={rock} />

      {/* taller peak (left) */}
      <Pyramid position={[-46, 74, 0]} radius={48} height={92} color={rock} />
      <Pyramid position={[-56, 72, -6]} radius={38} height={86} color={darkRock} />
      <Pyramid position={[-46, 110, 0]} radius={20} height={40} color={glacier} />

      {/* shorter peak (right) */}
      <Pyramid position={[52, 60, 4]} radius={42} height={74} color={rock} />
      <Pyramid position={[44, 58, -4]} radius={34} height={70} color={darkRock} />
      <Pyramid position={[52, 88, 4]} radius={17} height={32} color={glacier} />

      {/* glacier shoulder slabs draping the saddle between them */}
      <Block position={[2, 70, 18]} size={[40, 10, 12]} color={glacier} rotation={[0.12, 0, 0.04]} />

      {/* hint of green forested lower slopes (a few green blocks across the front) */}
      <Block position={[-70, 30, 40]} size={[18, 16, 14]} color={forest} />
      <Block position={[-30, 28, 46]} size={[16, 14, 12]} color={darkForest} />
      <Block position={[14, 30, 48]} size={[18, 16, 14]} color={forest} />
      <Block position={[58, 28, 44]} size={[16, 14, 12]} color={darkForest} />
      <Block position={[88, 30, 38]} size={[16, 14, 12]} color={forest} />
    </group>
  )
}

// ---- TETON: jagged range of several sharp spikes crowded together ----------
function Teton({ p }) {
  const rock = p.rock
  const darkRock = shade(rock, 0.68)
  const snow = p.peakSnow
  // index-derived spike layout (no Math.random): x, baseY-ish via height, height
  const spikes = [
    { x: -84, r: 26, h: 64, z: 6 },
    { x: -52, r: 30, h: 86, z: -4 },
    { x: -18, r: 34, h: 116, z: 0 }, // the grand, tallest, center-left
    { x: 16, r: 28, h: 92, z: -6 },
    { x: 48, r: 32, h: 100, z: 2 },
    { x: 84, r: 24, h: 70, z: 8 },
  ]
  return (
    <group position={[0, 0, -215]}>
      {/* chunky base ridge tying the range together */}
      <Block position={[0, 14, 0]} size={[210, 28, 80]} color={darkRock} />
      <Block position={[0, 34, 0]} size={[185, 18, 70]} color={rock} />

      {spikes.map((s, i) => {
        const cy = 42 + s.h / 2
        return (
          <group key={i}>
            {/* main spike */}
            <Pyramid position={[s.x, cy, s.z]} radius={s.r} height={s.h} color={rock} />
            {/* shaded face on one side for depth */}
            <Pyramid
              position={[s.x - 6, cy - 2, s.z - 5]}
              radius={s.r * 0.78}
              height={s.h * 0.94}
              color={darkRock}
            />
            {/* snow caught in the crevice / on the sharp tip */}
            <Pyramid
              position={[s.x, 42 + s.h - 6, s.z]}
              radius={s.r * 0.34}
              height={s.h * 0.22}
              color={snow}
            />
          </group>
        )
      })}
    </group>
  )
}

// ---- surrounding side ridges / foothills at large ±X ------------------------
// Static, index-derived placement so the rider feels boxed in by mountains on
// all sides as they descend. Uses the same blocky pyramid language.
function SideRidges({ p }) {
  const rock = p.rock
  const darkRock = shade(rock, 0.7)
  const snow = p.peakSnow
  // each entry: side multiplier, base x offset, z, radius, height
  const ridges = [
    { s: -1, x: 78, z: -40, r: 34, h: 64 },
    { s: -1, x: 110, z: -110, r: 44, h: 88 },
    { s: -1, x: 150, z: -200, r: 52, h: 104 },
    { s: -1, x: 96, z: 10, r: 28, h: 48 },
    { s: 1, x: 80, z: -30, r: 32, h: 58 },
    { s: 1, x: 118, z: -120, r: 46, h: 92 },
    { s: 1, x: 158, z: -210, r: 54, h: 110 },
    { s: 1, x: 100, z: 20, r: 26, h: 44 },
  ]
  return (
    <group>
      {ridges.map((g, i) => {
        const x = g.s * g.x
        const cy = g.h / 2
        return (
          <group key={i} position={[x, 0, g.z]}>
            <Pyramid position={[0, cy, 0]} radius={g.r} height={g.h} color={rock} />
            {/* darker shaded inner face (toward the rider's center) */}
            <Pyramid
              position={[-g.s * 6, cy - 2, -4]}
              radius={g.r * 0.8}
              height={g.h * 0.92}
              color={darkRock}
            />
            {/* snow cap on the taller ones */}
            {g.h > 70 && (
              <Pyramid position={[0, g.h - 6, 0]} radius={g.r * 0.32} height={g.h * 0.2} color={snow} />
            )}
          </group>
        )
      })}
    </group>
  )
}

function MountainBackdrop({ theme, nightMode = false }) {
  if (!theme) return null
  const p = palette(theme, nightMode)
  const which = theme.backdrop

  return (
    <group>
      {which === 'matterhorn' && <Matterhorn p={p} />}
      {which === 'fuji' && <Fuji p={p} />}
      {which === 'whistler' && <Whistler p={p} />}
      {which === 'teton' && <Teton p={p} />}
      <SideRidges p={p} />
    </group>
  )
}

// Memoized: the backdrop is static for a given theme/nightMode, so skip
// re-rendering when the parent re-renders for unrelated reasons.
export default memo(MountainBackdrop)
