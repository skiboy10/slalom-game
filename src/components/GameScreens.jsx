const DIFF_COLORS = { easy: 'bg-green-600 hover:bg-green-700', normal: 'bg-blue-600 hover:bg-blue-700', hard: 'bg-red-600 hover:bg-red-700' }
const DIFF_RING = { easy: 'ring-green-400', normal: 'ring-blue-400', hard: 'ring-red-400' }

export function StartScreen({ onStart, bestTime, runHistory, difficulty, onDifficultyChange }) {
  const recentRuns = (runHistory || []).slice(0, 5)
  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-1">SLALOM</h2>
      <p className="text-slate-300 mb-3">Timing Trainer</p>
      <div className="text-center mb-3 px-6 text-slate-300 text-sm space-y-1">
        <p><span className="text-blue-400 font-bold">← LEFT</span> for blue gates</p>
        <p><span className="text-red-400 font-bold">RIGHT →</span> for red gates</p>
        <p className="text-green-400 mt-2">Time your turn BEFORE the gate!</p>
      </div>
      <div className="flex gap-2 mb-3">
        {['easy', 'normal', 'hard'].map(d => (
          <button key={d} onClick={() => onDifficultyChange(d)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${DIFF_COLORS[d]} ${difficulty === d ? `ring-2 ${DIFF_RING[d]}` : 'opacity-60'}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="text-slate-400 text-xs mb-3">90 seconds • 3 misses = DNF</div>
      {bestTime && <div className="text-yellow-400 text-sm mb-1">Best: {bestTime.gates} gates</div>}
      {recentRuns.length > 0 && (
        <div className="mb-3 text-xs">
          <div className="text-slate-500 mb-1 text-center">Recent Runs</div>
          <div className="space-y-0.5">
            {recentRuns.map((run, i) => (
              <div key={i} className="flex gap-2 text-slate-400">
                <span className={run.result === 'dnf' ? 'text-red-400' : 'text-green-400'}>
                  {run.result === 'dnf' ? 'DNF' : 'FIN'}
                </span>
                <span>{run.gates} gates</span>
                {run.timing && (
                  <span className="text-slate-500">
                    <span className="text-green-400">{run.timing.perfect}P</span>{' '}
                    <span className="text-blue-400">{run.timing.good}G</span>{' '}
                    <span className="text-red-400">{run.timing.miss}M</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={onStart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-lg">
        START RUN
      </button>
    </div>
  )
}

export function CountdownScreen({ value }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-8xl font-bold text-white" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
        {value || 'GO!'}
      </div>
    </div>
  )
}

function TimingBar({ breakdown }) {
  const total = breakdown.perfect + breakdown.good + breakdown.early + breakdown.late + breakdown.miss
  if (total === 0) return null
  const items = [
    { key: 'perfect', label: 'P', color: '#22c55e', count: breakdown.perfect },
    { key: 'good', label: 'G', color: '#3b82f6', count: breakdown.good },
    { key: 'early', label: 'E', color: '#f59e0b', count: breakdown.early },
    { key: 'late', label: 'L', color: '#f59e0b', count: breakdown.late },
    { key: 'miss', label: 'M', color: '#ef4444', count: breakdown.miss },
  ]
  return (
    <div className="mb-3 w-full max-w-[280px]">
      <div className="flex h-4 rounded overflow-hidden mb-1">
        {items.map(item => item.count > 0 && (
          <div key={item.key} style={{ width: `${(item.count / total) * 100}%`, backgroundColor: item.color }} className="min-w-[2px]" />
        ))}
      </div>
      <div className="flex justify-center gap-3 text-xs">
        {items.map(item => item.count > 0 && (
          <span key={item.key} style={{ color: item.color }}>{item.label}:{item.count}</span>
        ))}
      </div>
    </div>
  )
}

export function FinishScreen({ bestTime, gatesCleared, misses, timingBreakdown, onRestart, onLobby }) {
  const isNewBest = bestTime && bestTime.gates === gatesCleared
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-green-400 text-xl mb-1">FINISH</div>
      <div className="text-5xl font-bold font-mono text-yellow-400 mb-2">{gatesCleared}</div>
      <div className="text-slate-300 text-lg mb-2">gates cleared</div>
      {isNewBest && <div className="text-green-400 text-lg mb-2">NEW BEST!</div>}
      {timingBreakdown && <TimingBar breakdown={timingBreakdown} />}
      <div className="text-slate-400 text-sm mb-4">
        Misses: {misses}
      </div>
      <div className="flex gap-3">
        <button onClick={onRestart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">
          RESTART
        </button>
        <button onClick={onLobby} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold">
          LOBBY
        </button>
      </div>
    </div>
  )
}

export function GameOverScreen({ gatesCleared, timingBreakdown, onRestart, onLobby }) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-red-400 text-2xl mb-2">DNF</div>
      <div className="text-slate-300 mb-1">Too many missed gates</div>
      <div className="text-slate-400 text-sm mb-2">
        Gates cleared: {gatesCleared}
      </div>
      {timingBreakdown && <TimingBar breakdown={timingBreakdown} />}
      <div className="flex gap-3 mt-2">
        <button onClick={onRestart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">
          RESTART
        </button>
        <button onClick={onLobby} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold">
          LOBBY
        </button>
      </div>
    </div>
  )
}
