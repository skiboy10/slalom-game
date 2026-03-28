const DIFF_LABEL_COLOR = { easy: 'text-green-400', normal: 'text-blue-400', hard: 'text-red-400' }

export default function HUD({ raceTime, gatesCleared, speed, misses, bestTime, maxTime, difficulty }) {
  const speedKmh = (speed * 12).toFixed(0)
  const timeRemaining = Math.max(0, maxTime - raceTime)
  const seconds = Math.ceil(timeRemaining / 1000)
  const isLowTime = seconds <= 5

  return (
    <>
      {/* Top bar - Time remaining */}
      <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded ${isLowTime ? 'bg-red-600/80' : 'bg-black/70'}`}>
        <div className={`font-mono text-2xl font-bold ${isLowTime ? 'text-white animate-pulse' : 'text-white'}`}>
          {seconds}s
        </div>
      </div>

      {/* Left panel - Gates */}
      <div className="absolute top-14 left-2 bg-black/60 px-3 py-2 rounded text-white">
        <div className="text-xs opacity-70">GATES</div>
        <div className="text-xl font-bold">{gatesCleared}</div>
      </div>

      {/* Right panel - Speed */}
      <div className="absolute top-14 right-12 bg-black/60 px-3 py-2 rounded text-white text-right">
        <div className="text-xs opacity-70">SPEED</div>
        <div className="text-xl font-bold">{speedKmh}<span className="text-sm font-normal"> km/h</span></div>
      </div>

      {/* Misses */}
      <div className="absolute bottom-3 left-2 flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-3 h-3 rounded-full border-2 ${i < misses ? 'bg-red-500 border-red-400' : 'bg-transparent border-white/40'}`} />
        ))}
      </div>

      {/* Difficulty + Best score */}
      <div className="absolute bottom-3 right-2 flex gap-2 items-center">
        {difficulty && (
          <span className={`text-xs font-bold uppercase ${DIFF_LABEL_COLOR[difficulty] || 'text-white'}`}>
            {difficulty}
          </span>
        )}
        {bestTime && (
          <div className="bg-black/50 px-2 py-1 rounded text-white text-xs">
            BEST: {bestTime.gates}
          </div>
        )}
      </div>
    </>
  )
}
