import { useState } from 'react'
import { DIFFICULTY_PRESETS } from '../config/gameSettings'

const DIFF_COLORS = {
  easy: 'bg-green-600 hover:bg-green-700',
  normal: 'bg-blue-600 hover:bg-blue-700',
  hard: 'bg-red-600 hover:bg-red-700',
}
const DIFF_RING = {
  easy: 'ring-green-400',
  normal: 'ring-blue-400',
  hard: 'ring-red-400',
}

function MountainScene() {
  return (
    <svg viewBox="0 0 400 200" className="w-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="lobbyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="40%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="mountainGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="200" fill="url(#lobbyGradient)" />

      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx={30 + i * 32} cy={10 + (i % 3) * 12} r={0.8} fill="white" opacity={0.4 + (i % 3) * 0.2} />
      ))}

      {/* Far mountains */}
      <polygon points="0,140 50,70 100,100 150,55 200,80 250,60 300,85 350,50 400,90 400,140" fill="url(#mountainGrad1)" opacity="0.6" />
      {/* Snow caps on far mountains */}
      <polygon points="150,55 140,72 160,72" fill="white" opacity="0.8" />
      <polygon points="250,60 240,75 260,75" fill="white" opacity="0.8" />
      <polygon points="350,50 338,68 362,68" fill="white" opacity="0.8" />

      {/* Near mountains */}
      <polygon points="0,140 70,85 130,110 200,70 270,95 340,75 400,105 400,140" fill="url(#mountainGrad2)" opacity="0.8" />
      {/* Snow caps */}
      <polygon points="200,70 188,88 212,88" fill="white" opacity="0.9" />
      <polygon points="340,75 328,92 352,92" fill="white" opacity="0.9" />

      {/* Trees on mountains */}
      {[40, 90, 120, 280, 310, 370].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${115 + (i % 3) * 5})`}>
          <polygon points="0,-12 -5,0 5,0" fill="#166534" opacity="0.7" />
          <polygon points="0,-8 -4,0 4,0" fill="#15803d" opacity="0.7" />
          <rect x="-1" y="0" width="2" height="3" fill="#78350f" opacity="0.5" />
        </g>
      ))}

      {/* Snow slope at bottom */}
      <path d="M 0 130 Q 100 120 200 128 Q 300 136 400 125 L 400 200 L 0 200 Z" fill="url(#snowGrad)" />

      {/* Ski lodge */}
      <g transform="translate(300, 118)">
        <rect x="-20" y="-18" width="40" height="22" rx="1" fill="#92400e" />
        <polygon points="-24,-18 0,-32 24,-18" fill="#7f1d1d" />
        {/* Windows */}
        <rect x="-14" y="-12" width="8" height="7" rx="1" fill="#fbbf24" opacity="0.8" />
        <rect x="6" y="-12" width="8" height="7" rx="1" fill="#fbbf24" opacity="0.8" />
        {/* Door */}
        <rect x="-4" y="-6" width="8" height="10" rx="1" fill="#78350f" />
        {/* Chimney */}
        <rect x="10" y="-35" width="6" height="12" fill="#78350f" />
        {/* Smoke */}
        <circle cx="13" cy="-40" r="3" fill="white" opacity="0.3" />
        <circle cx="16" cy="-45" r="2.5" fill="white" opacity="0.2" />
      </g>

      {/* Ski lift poles */}
      {[80, 160, 240].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={125} x2={x} y2={90} stroke="#374151" strokeWidth="2" />
          <line x1={x - 3} y1={90} x2={x + 3} y2={90} stroke="#374151" strokeWidth="2" />
        </g>
      ))}
      {/* Lift cable */}
      <path d="M 77 90 Q 120 84 157 90 Q 200 84 237 90 Q 280 84 310 92" fill="none" stroke="#374151" strokeWidth="1" />
    </svg>
  )
}

function LobbySkier() {
  return (
    <svg viewBox="-30 -60 60 75" width="80" height="100">
      <defs>
        <linearGradient id="lHelmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="lSuit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="lGoggle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="0" cy="12" rx="14" ry="4" fill="rgba(0,0,0,0.15)" />

      {/* Skis - parallel, flat on ground */}
      <rect x="-18" y="8" width="36" height="3.5" rx="1.5" fill="#1a1a2e" />
      <rect x="-16" y="9" width="32" height="1.2" rx="0.5" fill="#ef4444" />
      <rect x="-8" y="8" width="16" height="3.5" rx="1.5" fill="#1a1a2e" />
      <rect x="-6" y="9" width="12" height="1.2" rx="0.5" fill="#ef4444" />

      {/* Boots */}
      <rect x="-8" y="0" width="6" height="9" rx="2" fill="#1f2937" />
      <rect x="2" y="0" width="6" height="9" rx="2" fill="#1f2937" />

      {/* Legs */}
      <rect x="-7" y="-14" width="6" height="16" rx="2" fill="#1e3a5f" />
      <rect x="1" y="-14" width="6" height="16" rx="2" fill="#1e3a5f" />

      {/* Torso */}
      <path d="M -9 -12 Q -11 -22 -8 -30 Q -4 -36 0 -38 Q 4 -36 8 -30 Q 11 -22 9 -12 Q 5 -10 0 -10 Q -5 -10 -9 -12 Z"
        fill="url(#lSuit)" />
      {/* Bib */}
      <rect x="-6" y="-28" width="12" height="10" rx="1" fill="white" />
      <text x="0" y="-20" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#111" fontFamily="Arial">42</text>

      {/* Arms - relaxed, poles at sides */}
      <g transform="translate(-10, -32) rotate(-15)">
        <rect x="-2" y="0" width="4" height="18" rx="2" fill="url(#lSuit)" />
        <ellipse cx="0" cy="19" rx="3" ry="2.5" fill="#1f2937" />
        <line x1="0" y1="18" x2="2" y2="45" stroke="#9ca3af" strokeWidth="1.5" />
        <circle cx="2" cy="42" r="3" fill="none" stroke="#9ca3af" strokeWidth="0.8" />
      </g>
      <g transform="translate(10, -32) rotate(15)">
        <rect x="-2" y="0" width="4" height="18" rx="2" fill="url(#lSuit)" />
        <ellipse cx="0" cy="19" rx="3" ry="2.5" fill="#1f2937" />
        <line x1="0" y1="18" x2="-2" y2="45" stroke="#9ca3af" strokeWidth="1.5" />
        <circle cx="-2" cy="42" r="3" fill="none" stroke="#9ca3af" strokeWidth="0.8" />
      </g>

      {/* Head */}
      <g transform="translate(0, -44)">
        <rect x="-2" y="4" width="4" height="4" rx="1" fill="#FDBF94" />
        <ellipse cx="0" cy="0" rx="8" ry="7.5" fill="url(#lHelmet)" />
        <ellipse cx="-3" cy="-2" rx="3.5" ry="2" fill="white" opacity="0.15" />
        <path d="M -7 0 Q -8 -2 -6 -3 Q 0 -5 6 -3 Q 8 -2 7 0 Q 6 2 0 3 Q -6 2 -7 0 Z"
          fill="url(#lGoggle)" stroke="#92400e" strokeWidth="0.5" />
        <path d="M -4 4 Q 0 6 4 4" fill="#FDBF94" />
      </g>
    </svg>
  )
}

function HowToPlay({ onClose }) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl p-6 max-w-[340px] text-white">
        <h3 className="text-xl font-bold mb-3 text-center">How to Play</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p><span className="text-blue-400 font-bold">Blue gate</span> = press <span className="font-bold text-white">Left arrow</span> or <span className="font-bold text-white">A</span></p>
          <p><span className="text-red-400 font-bold">Red gate</span> = press <span className="font-bold text-white">Right arrow</span> or <span className="font-bold text-white">D</span></p>
          <p className="text-green-400">Time your turn BEFORE the gate reaches you!</p>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <p><span className="text-green-400">PERFECT</span> = right on time</p>
            <p><span className="text-blue-400">GOOD</span> = close (+0.15s)</p>
            <p><span className="text-yellow-400">EARLY/LATE</span> = off (+0.35s)</p>
            <p><span className="text-red-400">MISS</span> = missed the gate (+2.0s)</p>
          </div>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <p>Miss 3 gates = <span className="text-red-400 font-bold">DNF</span> (Did Not Finish)</p>
            <p>Race lasts <span className="font-bold text-white">90 seconds</span></p>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">
          Got it!
        </button>
      </div>
    </div>
  )
}

export default function Lobby({ onStart, bestScores, runHistory, difficulty, onDifficultyChange, soundEnabled, onToggleSound }) {
  const [showHelp, setShowHelp] = useState(false)
  const recentRuns = (runHistory || []).slice(0, 5)
  const bestTime = bestScores[difficulty] || null

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900">
      {/* Mountain scene header */}
      <div className="w-full max-w-[400px] relative">
        <MountainScene />

        {/* Game title overlay */}
        <div className="absolute top-4 left-0 right-0 text-center">
          <h1 className="text-4xl font-black text-white tracking-wider" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            SLALOM
          </h1>
          <p className="text-blue-200 text-sm font-medium" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
            Timing Trainer
          </p>
        </div>
      </div>

      {/* Main lobby area */}
      <div className="w-full max-w-[400px] bg-slate-800 rounded-b-xl px-4 pb-4 -mt-1">

        {/* Skier + best score */}
        <div className="flex items-center justify-center gap-4 -mt-2">
          <LobbySkier />
          <div className="text-center">
            {bestTime ? (
              <>
                <div className="text-yellow-400 text-2xl font-bold">{bestTime.gates}</div>
                <div className="text-slate-400 text-xs">best gates</div>
              </>
            ) : (
              <div className="text-slate-500 text-sm">No runs yet!</div>
            )}
          </div>
        </div>

        {/* Difficulty picker */}
        <div className="flex justify-center gap-3 mt-3">
          {['easy', 'normal', 'hard'].map(d => (
            <button key={d} onClick={() => onDifficultyChange(d)}
              className={`px-5 py-2 rounded-lg text-sm font-bold uppercase text-white transition-all ${DIFF_COLORS[d]} ${difficulty === d ? `ring-2 ${DIFF_RING[d]} scale-105` : 'opacity-50 scale-95'}`}>
              {d}
            </button>
          ))}
        </div>

        {/* Best scores per difficulty */}
        <div className="flex justify-center gap-4 mt-3 text-xs text-slate-500">
          {['easy', 'normal', 'hard'].map(d => {
            const best = bestScores[d]
            return best ? (
              <span key={d} className={difficulty === d ? 'text-slate-300' : ''}>
                {d}: <span className="text-yellow-400">{best.gates}</span>
              </span>
            ) : null
          })}
        </div>

        {/* Recent runs */}
        {recentRuns.length > 0 && (
          <div className="mt-3 bg-slate-700/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs font-bold mb-1.5 text-center">RECENT RUNS</div>
            <div className="space-y-1">
              {recentRuns.map((run, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-400">
                  <div className="flex gap-2">
                    <span className={run.result === 'dnf' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                      {run.result === 'dnf' ? 'DNF' : 'FIN'}
                    </span>
                    <span>{run.gates} gates</span>
                    {run.difficulty && <span className="text-slate-500">({run.difficulty})</span>}
                  </div>
                  {run.timing && (
                    <div className="flex gap-1">
                      <span className="text-green-400">{run.timing.perfect}P</span>
                      <span className="text-blue-400">{run.timing.good}G</span>
                      <span className="text-red-400">{run.timing.miss}M</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* START button */}
        <button onClick={onStart}
          className="mt-4 w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl font-black text-xl text-white tracking-wide transition-all hover:scale-[1.02] active:scale-95">
          START RUN
        </button>

        {/* Bottom buttons */}
        <div className="flex justify-center gap-3 mt-3">
          <button onClick={() => setShowHelp(true)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-xs font-bold transition-colors">
            How to Play
          </button>
          <button onClick={onToggleSound}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-xs font-bold transition-colors">
            Sound: {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Controls hint */}
        <div className="mt-3 text-slate-600 text-xs text-center">
          A/← Left &bull; D/→ Right &bull; Space to start
        </div>
      </div>

      {/* How to play overlay */}
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </div>
  )
}
