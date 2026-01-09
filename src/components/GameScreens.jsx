import { TOTAL_GATES } from '../config/gameSettings'
import { formatTime } from '../utils/generators'

export function StartScreen({ onStart, bestTime }) {
  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-5xl mb-2">⛷️</div>
      <h2 className="text-3xl font-bold mb-1">SLALOM</h2>
      <p className="text-slate-300 mb-4">Timing Trainer</p>
      <div className="text-center mb-4 px-6 text-slate-300 text-sm space-y-1">
        <p><span className="text-red-400 font-bold">← LEFT</span> for red gates</p>
        <p><span className="text-blue-400 font-bold">RIGHT →</span> for blue gates</p>
        <p className="text-green-400 mt-2">Time your turn BEFORE the gate!</p>
      </div>
      <div className="text-slate-400 text-xs mb-4">{TOTAL_GATES} gates • 3 misses = DNF</div>
      {bestTime && <div className="text-yellow-400 text-sm mb-2">Best: {formatTime(bestTime)}</div>}
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

export function FinishScreen({ raceTime, bestTime, gatesCleared, misses, onRestart }) {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-green-400 text-xl mb-1">🏁 FINISH</div>
      <div className="text-5xl font-bold font-mono text-yellow-400 mb-2">{formatTime(raceTime)}</div>
      {bestTime === raceTime && <div className="text-green-400 text-lg mb-2">🏆 NEW BEST!</div>}
      <div className="text-slate-300 text-sm mb-4">
        Gates: {gatesCleared}/{TOTAL_GATES} • Misses: {misses}
      </div>
      <button onClick={onRestart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">
        TRY AGAIN
      </button>
    </div>
  )
}

export function GameOverScreen({ gatesCleared, onRestart }) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="text-red-400 text-2xl mb-2">DNF</div>
      <div className="text-slate-300 mb-1">Too many missed gates</div>
      <div className="text-slate-400 text-sm mb-4">
        Gates cleared: {gatesCleared}/{TOTAL_GATES}
      </div>
      <button onClick={onRestart} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">
        TRY AGAIN
      </button>
    </div>
  )
}
