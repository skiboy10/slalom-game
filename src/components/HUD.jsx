import { TOTAL_GATES } from '../config/gameSettings'
import { formatTime } from '../utils/generators'

export default function HUD({
  raceTime,
  gatesCleared,
  speed,
  misses,
  bestTime,
  modeLabel,
  practiceMode,
  combo,
  nextGateProgress,
}) {
  const speedKmh = (speed * 12).toFixed(0)
  const timingPct = Math.max(0, Math.min(1, nextGateProgress ?? 0))
  const indicatorX = `${timingPct * 100}%`

  return (
    <>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-1 rounded border border-white/15">
        <div className="text-white font-mono text-2xl font-bold tracking-wide">{formatTime(raceTime)}</div>
      </div>

      <div className="absolute top-14 left-2 bg-black/60 px-3 py-2 rounded text-white border border-white/10">
        <div className="text-xs opacity-70">GATES</div>
        <div className="text-xl font-bold">{gatesCleared}<span className="text-sm font-normal">/{TOTAL_GATES}</span></div>
      </div>

      <div className="absolute top-14 right-2 bg-black/60 px-3 py-2 rounded text-white text-right border border-white/10">
        <div className="text-xs opacity-70">SPEED</div>
        <div className="text-xl font-bold">{speedKmh}<span className="text-sm font-normal"> km/h</span></div>
      </div>

      <div className="absolute top-2 left-2 bg-black/55 px-2 py-1 rounded text-xs text-white border border-white/10">
        {modeLabel}{practiceMode ? ' • PRACTICE' : ''}
      </div>

      <div className="absolute top-2 right-2 bg-black/55 px-2 py-1 rounded text-xs text-white border border-white/10">
        COMBO x{combo.toFixed(1)}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-56 h-2 bg-black/40 rounded-full border border-white/20">
        <div className="absolute inset-0 flex justify-between px-1">
          <div className="w-[2px] h-full bg-yellow-300/60" />
          <div className="w-[2px] h-full bg-green-400/75" />
          <div className="w-[2px] h-full bg-yellow-300/60" />
        </div>
        <div className="absolute top-[-5px] w-3 h-3 rounded-full bg-white shadow" style={{ left: `calc(${indicatorX} - 6px)` }} />
      </div>

      {!practiceMode && (
        <div className="absolute bottom-3 left-2 flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border-2 ${i < misses ? 'bg-red-500 border-red-400' : 'bg-transparent border-white/40'}`}
            />
          ))}
        </div>
      )}

      {bestTime && (
        <div className="absolute bottom-3 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs border border-white/10">
          BEST: {formatTime(bestTime)}
        </div>
      )}
    </>
  )
}
