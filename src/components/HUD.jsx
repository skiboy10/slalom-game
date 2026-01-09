import { TOTAL_GATES } from '../config/gameSettings'
import { formatTime } from '../utils/generators'

export default function HUD({ raceTime, gatesCleared, speed, misses, bestTime }) {
  const speedKmh = (speed * 12).toFixed(0)

  return (
    <>
      {/* Top bar - Time */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-1 rounded">
        <div className="text-white font-mono text-2xl font-bold">{formatTime(raceTime)}</div>
      </div>

      {/* Left panel - Gates */}
      <div className="absolute top-14 left-2 bg-black/60 px-3 py-2 rounded text-white">
        <div className="text-xs opacity-70">GATES</div>
        <div className="text-xl font-bold">{gatesCleared}<span className="text-sm font-normal">/{TOTAL_GATES}</span></div>
      </div>

      {/* Right panel - Speed */}
      <div className="absolute top-14 right-2 bg-black/60 px-3 py-2 rounded text-white text-right">
        <div className="text-xs opacity-70">SPEED</div>
        <div className="text-xl font-bold">{speedKmh}<span className="text-sm font-normal"> km/h</span></div>
      </div>

      {/* Misses */}
      <div className="absolute bottom-3 left-2 flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-3 h-3 rounded-full border-2 ${i < misses ? 'bg-red-500 border-red-400' : 'bg-transparent border-white/40'}`} />
        ))}
      </div>

      {/* Best time */}
      {bestTime && (
        <div className="absolute bottom-3 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
          BEST: {formatTime(bestTime)}
        </div>
      )}
    </>
  )
}
