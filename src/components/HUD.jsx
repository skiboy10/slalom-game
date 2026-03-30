const DIFF_LABEL_COLOR = { easy: 'text-green-400', normal: 'text-blue-400', hard: 'text-red-400' }
const DISC_LABEL = { sl: 'SL', gs: 'GS' }

function getComboTier(combo) {
  if (combo >= 20) return { name: 'LEGENDARY!', multiplier: 5, color: '#fbbf24', bg: 'bg-yellow-500/30', border: 'border-yellow-400', textClass: 'text-yellow-300' }
  if (combo >= 10) return { name: 'ON FIRE!', multiplier: 3, color: '#f97316', bg: 'bg-orange-500/30', border: 'border-orange-400', textClass: 'text-orange-300' }
  if (combo >= 5)  return { name: 'HOT!', multiplier: 2, color: '#ef4444', bg: 'bg-red-500/20', border: 'border-red-400', textClass: 'text-red-300' }
  return { name: '', multiplier: 1, color: '#94a3b8', bg: 'bg-black/60', border: 'border-transparent', textClass: 'text-white' }
}

export default function HUD({ raceTime, gatesCleared, speed, misses, bestTime, maxTime, difficulty, discipline, combo = 0 }) {
  const speedKmh = (speed * 12).toFixed(0)
  const timeRemaining = Math.max(0, maxTime - raceTime)
  const seconds = Math.ceil(timeRemaining / 1000)
  const isLowTime = seconds <= 5

  const tier = getComboTier(combo)
  const showCombo = combo >= 2

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
        <div className="text-xl font-bold">
          {gatesCleared}
          {tier.multiplier > 1 && (
            <span className={`text-xs ml-1 ${tier.textClass}`}>{tier.multiplier}x</span>
          )}
        </div>
      </div>

      {/* Combo meter - centered below timer */}
      {showCombo && (
        <div
          className={`absolute top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded border ${tier.bg} ${tier.border} combo-hud-pop`}
          key={combo}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono font-black text-2xl"
              style={{ color: tier.color, textShadow: combo >= 10 ? `0 0 8px ${tier.color}` : 'none' }}
            >
              {combo}
            </span>
            {tier.name && (
              <span
                className={`text-xs font-bold uppercase ${tier.textClass} ${combo >= 20 ? 'combo-legendary-text' : combo >= 10 ? 'combo-fire-text' : ''}`}
              >
                {tier.name}
              </span>
            )}
          </div>
        </div>
      )}

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

      {/* Discipline + Difficulty + Best score */}
      <div className="absolute bottom-3 right-2 flex gap-2 items-center">
        {discipline && (
          <span className="text-xs font-black text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
            {DISC_LABEL[discipline] || discipline.toUpperCase()}
          </span>
        )}
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

export { getComboTier }
