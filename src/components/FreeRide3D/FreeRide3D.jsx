import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene3D from './Scene3D'
import { MOUNTAINS, getMountain } from './mountains'

// 3D blocky Free Ride: pick a real mountain, then ski it from behind the skier.
// Props: skierStyle, nightMode, onExit, addCredits
export default function FreeRide3D({ skierStyle = {}, nightMode = false, onExit, addCredits }) {
  const [mountainId, setMountainId] = useState(null)
  const [started, setStarted] = useState(false)
  const [hud, setHud] = useState({ coins: 0, speed: 0, atBase: false })
  const hudRef = useRef({ coins: 0, speed: 0, atBase: false })
  const bridgeRef = useRef({ rideLift: () => {} })
  const theme = getMountain(mountainId)

  // poll the live HUD values written by the scene (decoupled from frame rate)
  useEffect(() => {
    const t = setInterval(() => setHud({ ...hudRef.current }), 120)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onExit && onExit()
      else if (e.key === ' ' && hudRef.current.atBase) { e.preventDefault(); bridgeRef.current.rideLift() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  const pick = (id) => { setMountainId(id); setStarted(true) }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0b1220' }}>
      <Canvas shadows="percentage" dpr={[1, 1.5]} camera={{ position: [0, 5, 9], fov: 60 }}>
        {mountainId && (
          <Scene3D theme={theme} nightMode={nightMode} started={started}
            skierStyle={skierStyle} addCredits={addCredits} hudRef={hudRef} bridgeRef={bridgeRef} />
        )}
      </Canvas>

      {/* exit always available */}
      <button onClick={onExit} style={{ position: 'absolute', top: 16, left: 16, padding: '8px 16px', background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>⏏ Lobby</button>

      {/* mountain picker */}
      {!mountainId && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, color: '#fff', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>🏔️ PICK YOUR MOUNTAIN</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 220px)', gap: 16 }}>
            {MOUNTAINS.map(m => (
              <button key={m.id} onClick={() => pick(m.id)}
                style={{ background: 'rgba(255,255,255,0.10)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: 18, color: '#fff', cursor: 'pointer', textAlign: 'left', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: '2.4rem' }}>{m.emoji}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{m.name}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{m.country}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: 6 }}>{m.blurb}</div>
              </button>
            ))}
          </div>
          <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>A/← D/→ steer • W tuck • S slow {nightMode ? '• 🌙 night' : ''}</div>
        </div>
      )}

      {/* in-run HUD */}
      {mountainId && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: 'sans-serif' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 10 }}>
            <div style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 10, padding: '6px 12px' }}>
              <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>Coins</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>🪙 {hud.coins}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 10, padding: '6px 12px', textAlign: 'right' }}>
              <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>Speed</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{Math.round(hud.speed * 70)}<span style={{ fontSize: 11 }}> km/h</span></div>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: 10, padding: '4px 14px', fontWeight: 800 }}>
            {theme.emoji} {theme.name}
          </div>
          {hud.atBase && (
            <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
              <button onClick={() => bridgeRef.current.rideLift()}
                style={{ background: '#3b82f6', color: '#fff', fontWeight: 800, padding: '12px 28px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                🚡 Ride the lift up!
              </button>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>or press Space</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
