// Free Ride heads-up display: coins, speed, tricks, lift prompt, exit.
export default function FreeRideHUD({ coins, tricks, speed, atLiftBase, onRideLift, onExit }) {
  return (
    <>
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-2 pointer-events-none">
        <div className="bg-black/55 rounded-lg px-3 py-1.5 text-white">
          <div className="text-[10px] uppercase tracking-wide opacity-70">Coins</div>
          <div className="text-lg font-bold leading-none">🪙 {coins}</div>
        </div>
        <button onClick={onExit}
          className="pointer-events-auto bg-black/55 hover:bg-black/75 rounded-lg px-3 py-1.5 text-white text-sm font-semibold">
          ⏏ Lobby
        </button>
        <div className="bg-black/55 rounded-lg px-3 py-1.5 text-white text-right">
          <div className="text-[10px] uppercase tracking-wide opacity-70">Speed</div>
          <div className="text-lg font-bold leading-none">{Math.round(speed * 8)}<span className="text-xs"> km/h</span></div>
        </div>
      </div>

      {/* tricks badge */}
      {tricks > 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-purple-600/80 text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">
          ✨ {tricks} trick{tricks > 1 ? 's' : ''}
        </div>
      )}

      {/* lift prompt */}
      {atLiftBase && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <button onClick={onRideLift}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-full shadow-lg animate-pulse">
            🚡 Ride the lift up!
          </button>
          <div className="text-white/70 text-[11px]">or press Space</div>
        </div>
      )}

      {/* controls hint */}
      <div className="absolute bottom-1 left-0 right-0 text-center text-white/50 text-[10px] pointer-events-none">
        A/← D/→ steer • W tuck • S slow
      </div>
    </>
  )
}
