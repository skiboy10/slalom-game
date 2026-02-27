import { TOTAL_GATES, DIFFICULTY_PRESETS } from '../config/gameSettings'
import { formatTime } from '../utils/generators'

const MODES = Object.values(DIFFICULTY_PRESETS)

export function StartScreen({ onStart, bestTime, difficulty, setDifficulty, practiceMode, setPracticeMode }) {
  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm px-4">
      <div className="text-5xl mb-2">⛷️</div>
      <h2 className="text-3xl font-bold mb-1">SLALOM</h2>
      <p className="text-slate-300 mb-3">Timing Trainer</p>

      <div className="w-full max-w-xs bg-black/40 border border-white/20 rounded-lg p-3 mb-3">
        <div className="text-xs uppercase tracking-wider text-slate-300 mb-2">Run setup</div>

        <label className="text-xs text-slate-300">Difficulty</label>
        <select
          className="w-full mt-1 mb-3 px-2 py-2 rounded bg-slate-900 text-white border border-slate-600"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {MODES.map((mode) => (
            <option key={mode.key} value={mode.key}>{mode.label}</option>
          ))}
        </select>

        <label className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Practice mode (no DNF)</span>
          <input
            type="checkbox"
            checked={practiceMode}
            onChange={(e) => setPracticeMode(e.target.checked)}
            className="h-4 w-4"
          />
        </label>
      </div>

      <div className="text-center mb-4 px-4 text-slate-300 text-sm space-y-1">
        <p><span className="text-red-400 font-bold">← LEFT</span> for red gates</p>
        <p><span className="text-blue-400 font-bold">RIGHT →</span> for blue gates</p>
        <p className="text-green-400 mt-2">Time your turn BEFORE the gate</p>
      </div>

      <div className="text-slate-400 text-xs mb-4">
        {TOTAL_GATES} gates • {practiceMode ? 'practice session' : '3 misses = DNF'}
      </div>

      {bestTime && <div className="text-yellow-400 text-sm mb-2">Best: {formatTime(bestTime)}</div>}

      <button onClick={onStart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-lg">
        START RUN
      </button>
    </div>
  )
}

export function CountdownScreen({ value }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-8xl font-bold text-white" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
        {value || 'GO!'}
      </div>
    </div>
  )
}

export function PausedScreen({ onResume, onRestart }) {
  return (
    <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-2xl font-bold mb-2">⏸ Paused</div>
      <div className="text-slate-300 mb-5">Take a breath. Then carve harder.</div>
      <div className="flex gap-3">
        <button className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-semibold" onClick={onResume}>Resume</button>
        <button className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold" onClick={onRestart}>Restart</button>
      </div>
      <div className="text-xs text-slate-400 mt-3">Esc / P to resume</div>
    </div>
  )
}

export function FinishScreen({ raceTime, bestTime, gatesCleared, misses, onRestart, modeLabel, practiceMode }) {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-green-400 text-xl mb-1">🏁 FINISH</div>
      <div className="text-5xl font-bold font-mono text-yellow-400 mb-2">{formatTime(raceTime)}</div>
      {bestTime === raceTime && <div className="text-green-400 text-lg mb-2">🏆 NEW BEST!</div>}
      <div className="text-slate-300 text-sm mb-1">Mode: {modeLabel}{practiceMode ? ' • Practice' : ''}</div>
      <div className="text-slate-300 text-sm mb-4">Gates: {gatesCleared}/{TOTAL_GATES} • Misses: {misses}</div>
      <button onClick={onRestart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">TRY AGAIN</button>
    </div>
  )
}

export function GameOverScreen({ gatesCleared, onRestart, modeLabel }) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-red-400 text-2xl mb-2">DNF</div>
      <div className="text-slate-300 mb-1">Too many missed gates</div>
      <div className="text-slate-400 text-sm mb-1">Mode: {modeLabel}</div>
      <div className="text-slate-400 text-sm mb-4">Gates cleared: {gatesCleared}/{TOTAL_GATES}</div>
      <button onClick={onRestart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">TRY AGAIN</button>
    </div>
  )
}
