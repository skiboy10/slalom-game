import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Sky, 
  Stars, 
  Text, 
  Environment, 
  ContactShadows, 
  BakeShadows,
  Sparkles,
  Trail,
  Html
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'

// Game settings
const SLOPE_SPEED = 0.4
const MAX_SPEED_LEVEL = 0.9
const GATE_SPACING = 20
const SKIER_X_RANGE = 4.5

// Simple Loading Indicator
function Loader() {
  return (
    <Html center>
      <div style={{ color: 'white', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2 style={{ margin: 0 }}>LOADING 3D ASSETS...</h2>
        <p style={{ opacity: 0.7 }}>Preparing the storm</p>
      </div>
    </Html>
  )
}

function SnowTrails({ skierX, distance, isPlaying }) {
  const [trails, setTrails] = useState([])
  const lastPos = useRef({ x: 0, d: 0 })
  const MAX_TRAIL_LENGTH = 80

  useFrame(() => {
    if (!isPlaying) return
    if (Math.abs(distance - lastPos.current.d) > 0.8) {
      setTrails(prev => {
        const newSegment = {
          id: Date.now(),
          x: skierX,
          z: -distance,
          rotation: (skierX - lastPos.current.x) * 2
        }
        return [newSegment, ...prev].slice(0, MAX_TRAIL_LENGTH)
      })
      lastPos.current = { x: skierX, d: distance }
    }
  })

  return (
    <group>
      {trails.map(t => (
        <group key={t.id} position={[t.x, 0.01, t.z]}>
           <mesh position={[-0.2, 0, 0]} rotation={[-Math.PI/2, 0, t.rotation]}>
              <planeGeometry args={[0.08, 1.2]} />
              <meshStandardMaterial color="#d1d5db" transparent opacity={0.3} roughness={1} />
           </mesh>
           <mesh position={[0.2, 0, 0]} rotation={[-Math.PI/2, 0, t.rotation]}>
              <planeGeometry args={[0.08, 1.2]} />
              <meshStandardMaterial color="#d1d5db" transparent opacity={0.3} roughness={1} />
           </mesh>
        </group>
      ))}
    </group>
  )
}

function Blizzard({ speed }) {
  const points = useRef()
  const count = 3000
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = Math.random() * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
      vel[i * 3] = -0.5 - Math.random() * 1.5
      vel[i * 3 + 1] = -0.1 - Math.random() * 0.1
      vel[i * 3 + 2] = 0.5 + Math.random() * 1.5
    }
    return [pos, vel]
  }, [])

  useFrame((state, delta) => {
    if (!points.current) return
    const posAttr = points.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] * (1 + speed)
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += (velocities[i * 3 + 2] + speed * 15) * delta * 60
      if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 20
      if (positions[i * 3 + 2] > 20) positions[i * 3 + 2] = -20
      if (positions[i * 3] < -20) positions[i * 3] = 20
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="white" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function SkierModel({ position, lean, speed }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -lean * 0.4, 0.1)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, lean * 0.2, 0.1)
      meshRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 15 * speed) * 0.02
    }
  })

  return (
    <group position={position}>
      <group ref={meshRef}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.1} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.9, 0.05]} castShadow>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0} metalness={0.8} />
          <mesh position={[0, 0, 0.12]}>
             <boxGeometry args={[0.25, 0.1, 0.1]} />
             <meshStandardMaterial color="#fbbf24" roughness={0} metalness={1} />
          </mesh>
        </mesh>
        <group position={[0, -0.6, 0]}>
          <Trail width={0.4} length={10} color="#ffffff">
            <mesh position={[-0.2, 0, 0]}><boxGeometry args={[0.12, 0.05, 3]} /><meshStandardMaterial color="#111" /></mesh>
          </Trail>
          <Trail width={0.4} length={10} color="#ffffff">
            <mesh position={[0.2, 0, 0]}><boxGeometry args={[0.12, 0.05, 3]} /><meshStandardMaterial color="#111" /></mesh>
          </Trail>
        </group>
      </group>
    </group>
  )
}

function Gate({ position, passed }) {
  const color = passed ? "#22c55e" : "#ef4444"
  return (
    <group position={position}>
      <mesh position={[-2.8, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.4]} />
        <meshStandardMaterial color={color} metalness={0.8} />
      </mesh>
      <mesh position={[2.8, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.4]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[5.6, 0.8, 0.02]} />
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function Scene({ isPlaying, onFinish }) {
  const [skierX, setSkierX] = useState(0)
  const [lean, setLean] = useState(0)
  const [distance, setDistance] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState(SLOPE_SPEED)
  const [gates] = useState(() => Array.from({ length: 40 }, (_, i) => ({
    id: i, x: (Math.random() - 0.5) * 6, z: -50 - i * GATE_SPACING
  })))

  const { camera } = useThree()
  const keys = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => { keys.current[e.key.toLowerCase()] = true }
    const handleKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (!isPlaying) return
    const accel = 14 * delta
    let targetLean = 0
    if (keys.current['a'] || keys.current['arrowleft']) {
      setSkierX(prev => Math.max(-SKIER_X_RANGE, prev - accel))
      targetLean = -1
    } else if (keys.current['d'] || keys.current['arrowright']) {
      setSkierX(prev => Math.min(SKIER_X_RANGE, prev + accel))
      targetLean = 1
    }
    setLean(prev => THREE.MathUtils.lerp(prev, targetLean, 0.15))
    setCurrentSpeed(prev => Math.min(MAX_SPEED_LEVEL, prev + 0.008 * delta))
    setDistance(prev => prev + currentSpeed)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, skierX * 0.3, 0.1)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.5 + currentSpeed * 2, 0.1)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 10 - currentSpeed * 5, 0.1)
    camera.lookAt(skierX, 0, -8)
    camera.fov = 50 + currentSpeed * 30
    camera.updateProjectionMatrix()
  })

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Environment preset="city" />
        <Sky sunPosition={[10, 5, 10]} />
        <fog attach="fog" args={['#cbd5e1', 5, 60]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

        <group position={[0, 0, distance]}>
           <SnowTrails skierX={skierX} distance={distance} isPlaying={isPlaying} />
        </group>

        <SkierModel position={[skierX, 0, 0]} lean={lean} speed={currentSpeed} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[100, 1000]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.1} />
        </mesh>

        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4} />

        <group position={[0, 0, distance]}>
          {gates.map(gate => (
            <Gate key={gate.id} position={[gate.x, 0, gate.z]} passed={distance + gate.z > 2} />
          ))}
          {Array.from({ length: 80 }).map((_, i) => (
            <mesh key={i} position={[(i % 2 === 0 ? 12 : -12) + (Math.sin(i) * 5), 2, -i * 10]} castShadow>
               <coneGeometry args={[1.5, 5, 6]} />
               <meshStandardMaterial color="#064e3b" />
            </mesh>
          ))}
        </group>

        <Blizzard speed={currentSpeed} />

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom luminanceThreshold={0.9} mipmapBlur intensity={0.5} />
          <Vignette darkness={0.6} />
          <SMAA />
        </EffectComposer>

        <BakeShadows />
      </Suspense>
    </>
  )
}

export default function Slalom3DPOC({ onBack }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#94a3b8', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 10], fov: 50 }}>
        <Scene isPlaying={isPlaying} onFinish={() => setIsPlaying(false)} />
      </Canvas>

      <div style={{ 
        position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
        color: 'white', textAlign: 'center', pointerEvents: 'none',
        fontFamily: 'sans-serif'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0 }}>BLIZZARD RUN</h1>
        {!isPlaying && (
          <button 
            onClick={() => setIsPlaying(true)}
            style={{ 
              padding: '18px 56px', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer',
              background: 'white', color: '#0f172a', border: 'none', borderRadius: '12px',
              marginTop: '40px', pointerEvents: 'auto'
            }}
          >
            START RACE
          </button>
        )}
      </div>

      <button 
        onClick={onBack}
        style={{ 
          position: 'absolute', top: 20, left: 20,
          padding: '10px 20px', cursor: 'pointer',
          background: 'rgba(0,0,0,0.5)', color: 'white', 
          border: '1px solid white', borderRadius: '8px',
          fontWeight: 700
        }}
      >
        ← LOBBY
      </button>
    </div>
  )
}
