import { useEffect, useCallback } from 'react'
import { GAME_WIDTH, GAME_HEIGHT } from '../../config/gameSettings'
import Skier from '../Skier'
import BigAir from '../BigAir'
import Mountain from './Mountain'
import NPCSkier from './NPCSkier'
import SkiPatrol from './SkiPatrol'
import Coin from './Coin'
import FreeRideHUD from './FreeRideHUD'
import { useFreeRideEngine } from './useFreeRideEngine'

// Free Ride mode — open mountain you explore freely.
// Props: skierStyle, nightMode, onExit, addCredits
export default function FreeRide({ skierStyle = {}, nightMode = false, onExit, addCredits }) {
  const onCoins = useCallback((n) => { if (addCredits) addCredits(n) }, [addCredits])
  const { snapshot, airborne, liftRiding, resolveJump, rideLift } = useFreeRideEngine({ onCoins })

  const { camX, camY, player, npcs, patrol, coins, trees, hud, atLiftBase } = snapshot

  // Space rides the lift when at the base; Esc exits.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onExit && onExit()
      else if (e.key === ' ' && atLiftBase && !liftRiding) { e.preventDefault(); rideLift() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [atLiftBase, liftRiding, rideLift, onExit])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, background: '#0b1220' }}
      >
        {/* world */}
        <Mountain camX={camX} camY={camY} trees={trees} nightMode={nightMode} />

        {/* coins */}
        {coins.map(c => c.collected ? null : (
          <Coin key={c.id} screenX={c.worldX - camX} screenY={c.worldY - camY} />
        ))}

        {/* other skiers */}
        {npcs.map(n => (
          <NPCSkier key={n.id} screenX={n.worldX - camX} screenY={n.worldY - camY}
            color={n.color} lean={n.lean} fallen={n.fallen} nightMode={nightMode} />
        ))}

        {/* ski patrol */}
        {patrol.map(p => (
          <SkiPatrol key={p.id} screenX={p.worldX - camX} screenY={p.worldY - camY}
            state={p.state} lean={p.lean} nightMode={nightMode} />
        ))}

        {/* the player (reuses the race skier) */}
        {!airborne && (
          <Skier x={player.screenX} lean={player.tumbling ? 1.6 : player.lean} style={skierStyle} />
        )}
        {player.tumbling && (
          <div className="absolute pointer-events-none" style={{ left: player.screenX, top: player.screenY - 30, transform: 'translateX(-50%)', fontSize: 22 }}>💫</div>
        )}

        {/* Big Air trick sequence */}
        {airborne && (
          <BigAir skierStyle={skierStyle} onComplete={(bonus) => resolveJump(bonus)} />
        )}

        {/* riding the lift overlay */}
        {liftRiding && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl font-bold">
            🚡 Riding to the top…
          </div>
        )}

        <FreeRideHUD coins={hud.coins} tricks={hud.tricks} speed={hud.speed}
          atLiftBase={atLiftBase} onRideLift={rideLift} onExit={onExit} />
      </div>
    </div>
  )
}
