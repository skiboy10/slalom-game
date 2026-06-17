import { useState, useEffect, useRef, useMemo } from 'react'
import { DIFFICULTY_PRESETS, SPEED_PRESETS, DISCIPLINE_PRESETS, WORLD_TOUR_LOCATIONS } from '../config/gameSettings'
import { darkenColor } from '../utils/colorUtils'
import { SHOP_ITEMS, SHOP_CATEGORIES, SHOP_EXCLUSIVE_COLORS } from '../config/shopData'
import { getTodayString } from '../utils/generators'
import { BADGES } from '../config/badgeData'

const DIFF_COLORS = {
  easy: 'from-green-500 to-green-700 hover:from-green-400 hover:to-green-600',
  normal: 'from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600',
  hard: 'from-red-500 to-red-700 hover:from-red-400 hover:to-red-600',
}
const DIFF_RING = {
  easy: 'ring-green-400 shadow-green-500/40',
  normal: 'ring-blue-400 shadow-blue-500/40',
  hard: 'ring-red-400 shadow-red-500/40',
}
const DIFF_EMOJI = { easy: '🟢', normal: '🔵', hard: '🔴' }

const SPEED_COLORS = {
  slow: 'from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700',
  normal: 'from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600',
  fast: 'from-orange-400 to-red-600 hover:from-orange-300 hover:to-red-500',
  turbo: 'from-red-500 to-rose-700 hover:from-red-400 hover:to-rose-600',
}
const SPEED_RING = {
  slow: 'ring-amber-400 shadow-amber-500/40',
  normal: 'ring-orange-400 shadow-orange-500/40',
  fast: 'ring-orange-300 shadow-orange-400/40',
  turbo: 'ring-red-400 shadow-red-500/40',
}
const SPEED_EMOJI = { slow: '\u{1F422}', normal: '\u{1F3C3}', fast: '\u26A1', turbo: '\u{1F525}' }
const SPEED_LABELS = { slow: 'Slow', normal: 'Normal', fast: 'Fast', turbo: 'Turbo' }

const DISC_COLORS = {
  sl: 'from-sky-500 to-sky-700 hover:from-sky-400 hover:to-sky-600',
  gs: 'from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600',
}
const DISC_RING = {
  sl: 'ring-sky-400 shadow-sky-500/40',
  gs: 'ring-violet-400 shadow-violet-500/40',
}
const DISC_EMOJI = { sl: '🎿', gs: '🏔️' }

function MountainScene() {
  return (
    <svg viewBox="0 0 400 200" className="w-full">
      <defs>
        <linearGradient id="lobbyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="30%" stopColor="#1e3a5f" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="85%" stopColor="#93c5fd" />
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
        {/* Aurora effect */}
        <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="30%" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="200" fill="url(#lobbyGradient)" />

      {/* Aurora */}
      <ellipse cx="200" cy="35" rx="180" ry="20" fill="url(#aurora)" />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={20 + i * 19} cy={6 + (i % 5) * 10} r={0.6 + (i % 3) * 0.3} fill="white" opacity={0.3 + (i % 4) * 0.15} />
      ))}

      {/* Far mountains */}
      <polygon points="0,140 50,70 100,100 150,55 200,80 250,60 300,85 350,50 400,90 400,140" fill="url(#mountainGrad1)" opacity="0.6" />
      <polygon points="150,55 140,72 160,72" fill="white" opacity="0.8" />
      <polygon points="250,60 240,75 260,75" fill="white" opacity="0.8" />
      <polygon points="350,50 338,68 362,68" fill="white" opacity="0.8" />

      {/* Near mountains */}
      <polygon points="0,140 70,85 130,110 200,70 270,95 340,75 400,105 400,140" fill="url(#mountainGrad2)" opacity="0.8" />
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

      {/* Snow slope */}
      <path d="M 0 130 Q 100 120 200 128 Q 300 136 400 125 L 400 200 L 0 200 Z" fill="url(#snowGrad)" />

      {/* Ski lodge */}
      <g transform="translate(300, 118)">
        <rect x="-20" y="-18" width="40" height="22" rx="1" fill="#92400e" />
        <polygon points="-24,-18 0,-32 24,-18" fill="#7f1d1d" />
        <rect x="-14" y="-12" width="8" height="7" rx="1" fill="#fbbf24" opacity="0.8" />
        <rect x="6" y="-12" width="8" height="7" rx="1" fill="#fbbf24" opacity="0.8" />
        <rect x="-4" y="-6" width="8" height="10" rx="1" fill="#78350f" />
        <rect x="10" y="-35" width="6" height="12" fill="#78350f" />
        <circle cx="13" cy="-40" r="3" fill="white" opacity="0.3" />
        <circle cx="16" cy="-45" r="2.5" fill="white" opacity="0.2" />
      </g>

      {/* Ski lift */}
      {[80, 160, 240].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={125} x2={x} y2={90} stroke="#374151" strokeWidth="2" />
          <line x1={x - 3} y1={90} x2={x + 3} y2={90} stroke="#374151" strokeWidth="2" />
        </g>
      ))}
      <path d="M 77 90 Q 120 84 157 90 Q 200 84 237 90 Q 280 84 310 92" fill="none" stroke="#374151" strokeWidth="1" />
    </svg>
  )
}

function LobbySkier({ style = {} }) {
  const helmet = style.helmet || '#ef4444'
  const helmetDark = darkenColor(helmet, 40)
  const suit = style.suit || '#3b82f6'
  const suitDark = darkenColor(suit, 40)
  const goggles = style.goggles || '#fbbf24'
  const gogglesDark = darkenColor(goggles, 30)
  const skiAccent = style.skiAccent || '#ef4444'
  const bibNumber = style.bibNumber ?? 42

  return (
    <div className="skier-bob">
      <svg viewBox="-30 -60 60 75" width="90" height="110">
        <defs>
          <linearGradient id="lHelmet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={helmet} />
            <stop offset="100%" stopColor={helmetDark} />
          </linearGradient>
          <linearGradient id="lSuit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={suit} />
            <stop offset="100%" stopColor={suitDark} />
          </linearGradient>
          <linearGradient id="lGoggle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={goggles} />
            <stop offset="100%" stopColor={gogglesDark} />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="0" cy="12" rx="14" ry="4" fill="rgba(0,0,0,0.15)" />

        {/* Skis */}
        <rect x="-18" y="8" width="36" height="3.5" rx="1.5" fill="#1a1a2e" />
        <rect x="-16" y="9" width="32" height="1.2" rx="0.5" fill={skiAccent} />
        <rect x="-8" y="8" width="16" height="3.5" rx="1.5" fill="#1a1a2e" />
        <rect x="-6" y="9" width="12" height="1.2" rx="0.5" fill={skiAccent} />

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
        <text x="0" y="-20" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#111" fontFamily="Arial">{bibNumber}</text>

        {/* Left arm - waving! */}
        <g transform="translate(-10, -32)" style={{ transformOrigin: '-10px -32px' }}>
          <g className="skier-wave-arm" style={{ animation: 'skierWave 1.5s ease-in-out infinite' }}>
            <rect x="-2" y="0" width="4" height="18" rx="2" fill="url(#lSuit)" />
            <ellipse cx="0" cy="19" rx="3" ry="2.5" fill="#1f2937" />
            <line x1="0" y1="18" x2="2" y2="45" stroke="#9ca3af" strokeWidth="1.5" />
            <circle cx="2" cy="42" r="3" fill="none" stroke="#9ca3af" strokeWidth="0.8" />
          </g>
        </g>
        {/* Right arm */}
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
    </div>
  )
}

// Color palette options for the changing room
const COLOR_PALETTE = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'White', hex: '#e2e8f0' },
  { name: 'Black', hex: '#1e293b' },
  { name: 'Gold', hex: '#fbbf24' },
  { name: 'Lime', hex: '#84cc16' },
]

// Map category labels to shop category keys
const LABEL_TO_CATEGORY = { HELMET: 'helmet', SUIT: 'suit', GOGGLES: 'goggles', SKIS: 'skis' }
const FREE_PALETTE_HEXES = new Set(COLOR_PALETTE.map(c => c.hex))

function ColorPicker({ label, value, onChange, unlockedItems }) {
  const catKey = LABEL_TO_CATEGORY[label] || ''
  // Find shop items for this category whose color is NOT already in the free palette
  const shopExtras = SHOP_ITEMS
    .filter(item => item.category === catKey && !FREE_PALETTE_HEXES.has(item.color))
    // Deduplicate by color (in case multiple items share a color in same category)
    .filter((item, idx, arr) => arr.findIndex(x => x.color === item.color) === idx)

  return (
    <div className="mb-3">
      <div className="text-slate-300 text-xs font-bold mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {/* Free palette colors — always available */}
        {COLOR_PALETTE.map(c => (
          <button
            key={c.hex}
            onClick={() => onChange(c.hex)}
            className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
              value === c.hex ? 'border-white scale-110 shadow-lg' : 'border-slate-600'
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
        {/* Shop-exclusive colors for this category */}
        {shopExtras.map(item => {
          const isUnlocked = (unlockedItems || []).includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => isUnlocked && onChange(item.color)}
              className={`w-7 h-7 rounded-full border-2 transition-all relative ${
                !isUnlocked ? 'opacity-40 cursor-not-allowed border-slate-700' :
                value === item.color ? 'border-white scale-110 shadow-lg hover:scale-110' : 'border-slate-600 hover:scale-110'
              }`}
              style={{ backgroundColor: item.color }}
              title={isUnlocked ? item.name : `${item.name} (Shop)`}
            >
              {!isUnlocked && (
                <span className="absolute inset-0 flex items-center justify-center text-[9px]">\uD83D\uDD12</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ChangingRoom({ style, onChange, onClose, unlockedItems }) {
  const update = (key, val) => onChange({ ...style, [key]: val })

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-30 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-5 max-w-[380px] w-full mx-4 text-white border border-slate-600/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-black mb-4 text-center shimmer-text">Changing Room</h3>

        {/* Live preview */}
        <div className="flex justify-center mb-4 bg-slate-700/30 rounded-xl py-3">
          <LobbySkier style={style} />
        </div>

        {/* Color pickers */}
        <ColorPicker label="HELMET" value={style.helmet} onChange={(v) => update('helmet', v)} unlockedItems={unlockedItems} />
        <ColorPicker label="SUIT" value={style.suit} onChange={(v) => update('suit', v)} unlockedItems={unlockedItems} />
        <ColorPicker label="GOGGLES" value={style.goggles} onChange={(v) => update('goggles', v)} unlockedItems={unlockedItems} />
        <ColorPicker label="SKIS" value={style.skiAccent} onChange={(v) => update('skiAccent', v)} unlockedItems={unlockedItems} />

        {/* Bib number */}
        <div className="mb-3">
          <div className="text-slate-300 text-xs font-bold mb-1.5">BIB NUMBER</div>
          <div className="flex items-center gap-3">
            <button onClick={() => update('bibNumber', Math.max(1, (style.bibNumber || 42) - 1))}
              className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg transition-all">-</button>
            <span className="text-2xl font-black w-12 text-center">{style.bibNumber || 42}</span>
            <button onClick={() => update('bibNumber', Math.min(99, (style.bibNumber || 42) + 1))}
              className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg transition-all">+</button>
          </div>
        </div>

        {/* Done button */}
        <button onClick={onClose}
          className="mt-3 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-black text-lg text-white transition-all hover:scale-[1.02] active:scale-95">
          Done!
        </button>
      </div>
    </div>
  )
}

// Falling snow particles for the lobby
function LobbySnow() {
  const flakes = useRef(
    [...Array(35)].map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 6,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  ).current

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {flakes.map((f, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white lobby-snow"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function HowToPlay({ onClose }) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-[340px] text-white border border-slate-600/50 shadow-2xl">
        <h3 className="text-xl font-bold mb-3 text-center shimmer-text">How to Play</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p><span className="text-blue-400 font-bold">Blue gate</span> = press <span className="font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded">Left arrow</span> or <span className="font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded">A</span></p>
          <p><span className="text-red-400 font-bold">Red gate</span> = press <span className="font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded">Right arrow</span> or <span className="font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded">D</span></p>
          <p className="text-green-400 font-medium">Time your turn BEFORE the gate reaches you!</p>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <p><span className="text-green-400 font-bold">PERFECT</span> = right on time</p>
            <p><span className="text-blue-400 font-bold">GOOD</span> = close (+0.15s)</p>
            <p><span className="text-yellow-400 font-bold">EARLY/LATE</span> = off (+0.35s)</p>
            <p><span className="text-red-400 font-bold">MISS</span> = missed the gate (+2.0s)</p>
          </div>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <p>Miss 3 gates = <span className="text-red-400 font-bold">DNF</span> (Did Not Finish)</p>
            <p>Race lasts <span className="font-bold text-white">90 seconds</span></p>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95">
          Got it!
        </button>
      </div>
    </div>
  )
}

// Leaderboard component - top 10 scores per difficulty
const RANK_STYLES = {
  1: 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]',
  2: 'text-slate-300 drop-shadow-[0_0_4px_rgba(148,163,184,0.4)]',
  3: 'text-amber-600 drop-shadow-[0_0_4px_rgba(217,119,6,0.4)]',
}
const RANK_BADGES = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

const DIFF_TAB_COLORS = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/50',
  normal: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  hard: 'bg-red-500/20 text-red-400 border-red-500/50',
}
const DIFF_TAB_INACTIVE = {
  easy: 'text-green-600 hover:bg-green-500/10',
  normal: 'text-blue-600 hover:bg-blue-500/10',
  hard: 'text-red-600 hover:bg-red-500/10',
}

function Leaderboard({ leaderboard, difficulty, discipline, playerName }) {
  const [activeDiff, setActiveDiff] = useState(difficulty)
  const [activeDisc, setActiveDisc] = useState(discipline || 'sl')
  const activeKey = `${activeDisc}-${activeDiff}`
  const entries = (leaderboard && leaderboard[activeKey]) || []

  // Sync tabs when lobby selections change
  useEffect(() => { setActiveDiff(difficulty) }, [difficulty])
  useEffect(() => { setActiveDisc(discipline || 'sl') }, [discipline])

  return (
    <div className="mt-4 bg-slate-700/30 rounded-xl p-3 border border-slate-600/20">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="text-slate-300 text-xs font-black tracking-[0.2em] uppercase">
          Leaderboard
        </div>
        <div className="text-slate-600 text-[10px] mt-0.5">Top 10 Runs</div>
      </div>

      {/* Discipline tabs */}
      <div className="flex justify-center gap-1.5 mb-1.5">
        {['sl', 'gs'].map(d => (
          <button
            key={d}
            onClick={() => setActiveDisc(d)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${
              activeDisc === d
                ? d === 'sl'
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                  : 'bg-violet-500/20 text-violet-400 border-violet-500/50'
                : `border-transparent ${d === 'sl' ? 'text-sky-600 hover:bg-sky-500/10' : 'text-violet-600 hover:bg-violet-500/10'}`
            }`}
          >
            {DISC_EMOJI[d]} {DISCIPLINE_PRESETS[d].shortLabel}
          </button>
        ))}
      </div>

      {/* Difficulty tabs */}
      <div className="flex justify-center gap-1.5 mb-3">
        {['easy', 'normal', 'hard'].map(d => (
          <button
            key={d}
            onClick={() => setActiveDiff(d)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${
              activeDiff === d
                ? DIFF_TAB_COLORS[d]
                : `border-transparent ${DIFF_TAB_INACTIVE[d]}`
            }`}
          >
            {DIFF_EMOJI[d]} {d}
          </button>
        ))}
      </div>

      {/* Leaderboard entries */}
      {entries.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-slate-600 text-sm font-medium">No runs yet!</div>
          <div className="text-slate-700 text-xs mt-1">Be the first on the board!</div>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Column headers */}
          <div className="flex items-center text-[9px] text-slate-600 font-bold uppercase tracking-wider px-1 pb-1 border-b border-slate-600/20">
            <div className="w-6 text-center">#</div>
            <div className="flex-1 ml-1">Player</div>
            <div className="w-10 text-center">Gates</div>
            <div className="w-[72px] text-center">P / G / M</div>
          </div>

          {entries.map((entry, i) => {
            const rank = i + 1
            const isCurrentPlayer = playerName && entry.playerName && entry.playerName.toLowerCase() === playerName.toLowerCase()
            const rankStyle = RANK_STYLES[rank] || 'text-slate-500'
            const badge = RANK_BADGES[rank]

            return (
              <div
                key={`${entry.ts}-${i}`}
                className={`flex items-center text-xs px-1 py-1 rounded-lg transition-all ${
                  isCurrentPlayer
                    ? 'bg-blue-500/10 border border-blue-400/20 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                    : rank <= 3
                    ? 'bg-slate-700/20'
                    : ''
                }`}
              >
                {/* Rank */}
                <div className={`w-6 text-center font-black text-[11px] ${rankStyle}`}>
                  {badge || rank}
                </div>

                {/* Player name */}
                <div className={`flex-1 ml-1 truncate font-bold text-[11px] ${
                  isCurrentPlayer ? 'text-blue-300' : rank <= 3 ? 'text-slate-200' : 'text-slate-400'
                }`}>
                  {entry.playerName || 'Unknown'}
                  {isCurrentPlayer && <span className="ml-1 text-blue-400 text-[8px]">(YOU)</span>}
                </div>

                {/* Gates */}
                <div className={`w-10 text-center font-black text-[12px] ${
                  rank === 1 ? 'text-yellow-400' : rank <= 3 ? 'text-slate-200' : 'text-slate-400'
                }`}>
                  {entry.gates}
                </div>

                {/* Timing breakdown */}
                <div className="w-[72px] flex justify-center gap-1 text-[10px]">
                  <span className="text-green-400 font-bold">{entry.timing?.perfect || 0}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-blue-400 font-bold">{entry.timing?.good || 0}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-red-400 font-bold">{entry.timing?.miss || 0}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Equipment Shop overlay
function Shop({ credits, unlockedItems, skierStyle, onBuy, onEquip, onClose }) {
  const [activeCategory, setActiveCategory] = useState('helmet')
  const items = SHOP_ITEMS.filter(i => i.category === activeCategory)

  // Determine what's currently equipped for this category
  const isBibCategory = activeCategory === 'bib'
  const styleKeyMap = { helmet: 'helmet', suit: 'suit', goggles: 'goggles', skis: 'skiAccent' }
  const equippedColor = isBibCategory ? null : skierStyle[styleKeyMap[activeCategory]]
  const equippedBib = skierStyle.bibNumber

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-30 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-5 max-w-[400px] w-full mx-4 text-white border border-slate-600/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-black mb-1 text-center shimmer-text">Equipment Shop</h3>
        <div className="text-center text-yellow-300 font-bold text-sm mb-4">
          {'\uD83E\uDE99'} {credits}
        </div>

        {/* Category tabs */}
        <div className="flex justify-center gap-1.5 mb-4">
          {SHOP_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeCategory === cat.key
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                  : 'border-transparent text-slate-500 hover:bg-slate-700/40 hover:text-slate-300'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Item grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {items.map(item => {
            const isOwned = unlockedItems.includes(item.id)
            const isEquipped = isOwned && (isBibCategory
              ? equippedBib === item.bibNumber
              : equippedColor === item.color)
            const canAfford = credits >= item.price

            return (
              <div
                key={item.id}
                className={`relative rounded-xl p-3 border transition-all ${
                  isEquipped
                    ? 'bg-blue-500/15 border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : isOwned
                    ? 'bg-slate-700/40 border-slate-600/30'
                    : 'bg-slate-700/20 border-slate-700/30'
                }`}
              >
                {/* Preview */}
                <div className="flex justify-center mb-2">
                  {isBibCategory ? (
                    <div className={`w-10 h-10 rounded-lg border-2 bg-white flex items-center justify-center ${
                      isEquipped ? 'border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                      isOwned ? 'border-slate-400' : 'border-slate-600 opacity-50'
                    }`}>
                      <span className={`font-black text-sm ${isOwned ? 'text-gray-900' : 'text-gray-400'}`}>
                        {isOwned ? item.bibNumber : '🔒'}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full border-2 ${
                        isEquipped ? 'border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                        isOwned ? 'border-slate-400' :
                        'border-slate-600 opacity-50'
                      }`}
                      style={{ backgroundColor: item.color }}
                    >
                      {!isOwned && (
                        <span className="flex items-center justify-center h-full text-sm">🔒</span>
                      )}
                      {isOwned && !isEquipped && (
                        <span className="flex items-center justify-center h-full text-sm">✓</span>
                      )}
                      {isEquipped && (
                        <span className="flex items-center justify-center h-full text-sm">✨</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className={`text-center text-[11px] font-bold leading-tight mb-1.5 ${
                  isOwned ? 'text-slate-200' : 'text-slate-400'
                }`}>
                  {item.name}
                </div>

                {/* Action button */}
                {isEquipped ? (
                  <div className="text-center text-[10px] text-blue-400 font-bold py-1">EQUIPPED</div>
                ) : isOwned ? (
                  <button
                    onClick={() => onEquip(item.id)}
                    className="w-full py-1.5 bg-blue-600/40 hover:bg-blue-600/60 rounded-lg text-blue-200 text-[10px] font-bold transition-all border border-blue-500/30"
                  >
                    EQUIP
                  </button>
                ) : (
                  <button
                    onClick={() => canAfford && onBuy(item.id)}
                    disabled={!canAfford}
                    className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                      canAfford
                        ? 'bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 border-yellow-500/30'
                        : 'bg-slate-700/30 text-slate-600 border-slate-700/30 cursor-not-allowed'
                    }`}
                  >
                    {'\uD83E\uDE99'} {item.price}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Close button */}
        <button onClick={onClose}
          className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-black text-lg text-white transition-all hover:scale-[1.02] active:scale-95">
          Done!
        </button>
      </div>
    </div>
  )
}

// Player name input with fun styling
// Badge overlay — shows a 3x4 grid of all 12 badges
function BadgeOverlay({ earnedBadges, onClose }) {
  const earned = earnedBadges instanceof Set ? earnedBadges : new Set(earnedBadges || [])
  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-30 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-5 max-w-[380px] w-full mx-4 text-white border border-slate-600/50 shadow-2xl">
        <h3 className="text-xl font-black mb-1 text-center shimmer-text">Badges</h3>
        <div className="text-center text-amber-300 text-sm font-bold mb-4">
          🏆 {earned.size} / {BADGES.length}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {BADGES.map(badge => {
            const isEarned = earned.has(badge.id)
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-2.5 text-center transition-all border ${
                  isEarned
                    ? 'bg-amber-500/15 border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-800/60 border-slate-700/30 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{isEarned ? badge.emoji : '❓'}</div>
                <div className={`text-[10px] font-bold leading-tight ${isEarned ? 'text-amber-200' : 'text-slate-600'}`}>
                  {isEarned ? badge.name : '???'}
                </div>
                {isEarned && (
                  <div className="text-[8px] text-slate-500 mt-0.5 leading-tight">{badge.description}</div>
                )}
              </div>
            )
          })}
        </div>
        <button onClick={onClose}
          className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl font-black text-lg text-white transition-all hover:scale-[1.02] active:scale-95">
          Nice!
        </button>
      </div>
    </div>
  )
}

function PlayerNameInput({ name, onChange }) {
  return (
    <div className="flex flex-col items-center gap-1 mt-1">
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value.slice(0, 16))}
        placeholder="Enter your name..."
        maxLength={16}
        className="bg-slate-700/60 border border-slate-500/50 rounded-lg px-4 py-2 text-center text-white text-lg font-bold placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 w-56 transition-all"
      />
      {name && <span className="text-slate-500 text-xs">Welcome, {name}!</span>}
    </div>
  )
}

export default function Lobby({ onStart, onStartFreeRide, bestScores, runHistory, discipline, onDisciplineChange, difficulty, onDifficultyChange, speedLevel, onSpeedChange, soundEnabled, onToggleSound, playerName, onNameChange, initAudio, startLobbyMusic, stopLobbyMusic, skierStyle, onStyleChange, leaderboard, credits, unlockedItems, onBuyItem, onEquipItem, onStartDaily, dailyBest, arcadeMode = false, onArcadeModeChange, ghostEnabled, onGhostToggle, nightMode, onNightModeToggle, earnedBadges, selectedLocation, onSelectLocation }) {
  const [showHelp, setShowHelp] = useState(false)
  const [showChangingRoom, setShowChangingRoom] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showBadges, setShowBadges] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const recentRuns = (runHistory || []).slice(0, 5)
  const bestTime = bestScores[`${discipline}-${difficulty}`] || bestScores[difficulty] || null

  // Compute unlocked World Tour locations from run history
  const unlockedLocations = useMemo(() => {
    const history = runHistory || []
    const unlocked = new Set()
    const totalGatesCleared = history.reduce((sum, r) => sum + (r.gates || 0), 0)
    const hasFinishedNoDNF = history.some(r => r.result === 'finish')
    const bestCombo = history.reduce((max, r) => Math.max(max, r.maxCombo || 0), 0)

    for (const loc of WORLD_TOUR_LOCATIONS) {
      if (!loc.unlockRequirement) {
        unlocked.add(loc.id)
      } else if (loc.unlockRequirement === 'totalGates20' && totalGatesCleared >= 20) {
        unlocked.add(loc.id)
      } else if (loc.unlockRequirement === 'finishNoDNF' && hasFinishedNoDNF) {
        unlocked.add(loc.id)
      } else if (loc.unlockRequirement === 'combo15' && bestCombo >= 15) {
        unlocked.add(loc.id)
      }
    }
    return unlocked
  }, [runHistory])

  // Try to start music (only works after a user click due to browser rules)
  function tryStartMusic() {
    if (!soundEnabled || musicPlaying) return
    if (!startLobbyMusic) return
    // Music now creates its own audio context, so just call it directly
    startLobbyMusic()
    setMusicPlaying(true)
  }

  // Stop music when sound is toggled off
  useEffect(() => {
    if (!soundEnabled && stopLobbyMusic) {
      stopLobbyMusic()
      setMusicPlaying(false)
    }
  }, [soundEnabled, stopLobbyMusic])

  // Stop music when lobby unmounts (game starts)
  useEffect(() => {
    return () => {
      if (stopLobbyMusic) stopLobbyMusic()
    }
  }, [stopLobbyMusic])

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 relative"
      onClick={tryStartMusic}>

      {/* Falling snow overlay */}
      <LobbySnow />

      {/* Mountain scene header */}
      <div className="w-full max-w-[420px] relative">
        <MountainScene />

        {/* Game title overlay */}
        <div className="absolute top-3 left-0 right-0 text-center">
          <h1 className="text-5xl font-black text-white tracking-widest title-glow">
            SKI RACING
          </h1>
          <p className="shimmer-text text-sm font-semibold mt-0.5 tracking-wide">
            Hit the Slopes!
          </p>
        </div>
      </div>

      {/* Main lobby area */}
      <div className="w-full max-w-[420px] bg-gradient-to-b from-slate-800/90 to-slate-900 rounded-b-2xl px-5 pb-5 -mt-1 relative z-20 border-x border-b border-slate-700/30">

        {/* Player name */}
        <PlayerNameInput name={playerName} onChange={onNameChange} />

        {/* Credits display */}
        <div className="flex justify-center mt-2">
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-1 text-yellow-300 text-sm font-bold">
            {'\uD83E\uDE99'} {credits ?? 0}
          </div>
        </div>

        {/* Skier + best score */}
        <div className="flex items-center justify-center gap-5 mt-2">
          <div className="flex flex-col items-center">
            <LobbySkier style={skierStyle} />
            <div className="flex gap-1.5 mt-1">
              <button onClick={() => setShowChangingRoom(true)}
                className="px-3 py-1 bg-purple-600/40 hover:bg-purple-600/60 rounded-lg text-purple-200 text-[10px] font-bold transition-all border border-purple-500/30 hover:scale-105">
                Changing Room
              </button>
              <button onClick={() => setShowShop(true)}
                className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/40 rounded-lg text-yellow-300 text-[10px] font-bold transition-all border border-yellow-400/30 hover:scale-105">
                {'\uD83D\uDED2'} Shop
              </button>
            </div>
          </div>
          <div className="text-center float-anim">
            {bestTime ? (
              <>
                <div className="text-yellow-400 text-3xl font-black">{bestTime.gates}</div>
                <div className="text-slate-400 text-xs font-medium">best gates</div>
                <div className="text-yellow-400/60 text-xs mt-0.5">
                  {'★'.repeat(Math.min(5, Math.floor(bestTime.gates / 5)))}
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-sm italic">No runs yet!<br/>
                <span className="text-xs text-slate-600">Hit START to begin</span>
              </div>
            )}
          </div>
        </div>

        {/* World Tour Mountain Map */}
        <div className="mt-4">
          <div className="text-center mb-2">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">World Tour</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {WORLD_TOUR_LOCATIONS.map(loc => {
              const isUnlocked = unlockedLocations.has(loc.id)
              const isSelected = selectedLocation === loc.id
              const diffBadgeColor = loc.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : loc.difficulty === 'normal' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    if (isUnlocked && onSelectLocation) onSelectLocation(loc)
                  }}
                  disabled={!isUnlocked}
                  className={`relative rounded-xl p-2.5 text-left transition-all border ${
                    !isUnlocked
                      ? 'bg-slate-800/60 border-slate-700/40 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-2 shadow-lg scale-[1.02]'
                      : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 hover:scale-[1.01]'
                  }`}
                  style={isSelected && isUnlocked ? { borderColor: loc.themeColor, boxShadow: `0 0 12px ${loc.themeColor}33` } : {}}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl leading-none">{isUnlocked ? loc.emoji : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs font-black truncate">{loc.name}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${diffBadgeColor}`}>
                          {loc.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[9px] mt-0.5 leading-tight">
                        {isUnlocked ? loc.description : loc.unlockText}
                      </div>
                    </div>
                  </div>
                  {loc.nightMode && isUnlocked && (
                    <span className="absolute top-1 right-1 text-[10px]">🌙</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Discipline picker */}
        <div className="text-center mt-4 mb-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Discipline</span>
        </div>
        <div className="flex justify-center gap-3">
          {['sl', 'gs'].map(d => (
            <button key={d} onClick={() => onDisciplineChange(d)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase text-white transition-all bg-gradient-to-b ${DISC_COLORS[d]}
                ${discipline === d
                  ? `ring-2 ${DISC_RING[d]} scale-105 shadow-lg`
                  : 'opacity-40 scale-90 hover:opacity-60'}`}>
              {DISC_EMOJI[d]} {DISCIPLINE_PRESETS[d].shortLabel}
            </button>
          ))}
        </div>
        <div className="text-center mt-1">
          <span className="text-slate-600 text-[9px]">{DISCIPLINE_PRESETS[discipline]?.description}</span>
        </div>

        {/* Difficulty picker */}
        <div className="text-center mt-3 mb-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Difficulty</span>
        </div>
        <div className="flex justify-center gap-3">
          {['easy', 'normal', 'hard'].map(d => (
            <button key={d} onClick={() => onDifficultyChange(d)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase text-white transition-all bg-gradient-to-b ${DIFF_COLORS[d]}
                ${difficulty === d
                  ? `ring-2 ${DIFF_RING[d]} scale-105 shadow-lg`
                  : 'opacity-40 scale-90 hover:opacity-60'}`}>
              {DIFF_EMOJI[d]} {d}
            </button>
          ))}
        </div>

        {/* Speed picker */}
        <div className="text-center mt-3 mb-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Speed</span>
        </div>
        <div className="flex justify-center gap-2">
          {['slow', 'normal', 'fast', 'turbo'].map(s => (
            <button key={s} onClick={() => onSpeedChange(s)}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase text-white transition-all bg-gradient-to-b ${SPEED_COLORS[s]}
                ${speedLevel === s
                  ? `ring-2 ${SPEED_RING[s]} scale-105 shadow-lg`
                  : 'opacity-40 scale-90 hover:opacity-60'}`}>
              {SPEED_EMOJI[s]} {SPEED_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Best scores per difficulty (for current discipline) */}
        <div className="flex justify-center gap-4 mt-3 text-xs text-slate-500">
          {['easy', 'normal', 'hard'].map(d => {
            const best = bestScores[`${discipline}-${d}`] || bestScores[d]
            return best ? (
              <span key={d} className={`transition-colors ${difficulty === d ? 'text-slate-300 font-medium' : ''}`}>
                {d}: <span className="text-yellow-400 font-bold">{best.gates}</span>
              </span>
            ) : null
          })}
        </div>

        {/* Recent runs */}
        {recentRuns.length > 0 && (
          <div className="mt-4 bg-slate-700/30 rounded-xl p-3 border border-slate-600/20">
            <div className="text-slate-400 text-xs font-black mb-2 text-center tracking-wider">RECENT RUNS</div>
            <div className="space-y-1.5">
              {recentRuns.map((run, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-400">
                  <div className="flex gap-2 items-center">
                    <span className={`font-black px-1.5 py-0.5 rounded text-[10px] ${run.result === 'dnf' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {run.result === 'dnf' ? 'DNF' : 'FIN'}
                    </span>
                    <span className="font-medium">{run.gates} gates</span>
                    {run.difficulty && <span className="text-slate-600">({run.difficulty})</span>}
                  </div>
                  {run.timing && (
                    <div className="flex gap-1.5">
                      <span className="text-green-400 font-bold">{run.timing.perfect}P</span>
                      <span className="text-blue-400 font-bold">{run.timing.good}G</span>
                      <span className="text-red-400 font-bold">{run.timing.miss}M</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <Leaderboard leaderboard={leaderboard} discipline={discipline} difficulty={difficulty} playerName={playerName} />

        {/* Daily Challenge card */}
        {onStartDaily && (
          <div className="mt-4 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-900/30 to-orange-900/20 overflow-hidden">
            <button
              onClick={onStartDaily}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-500/10 transition-all active:scale-[0.98]"
            >
              <div className="text-2xl">📅</div>
              <div className="flex-1 text-left">
                <div className="text-amber-300 font-black text-sm uppercase tracking-wider">Daily Challenge</div>
                <div className="text-slate-400 text-[10px] mt-0.5">{getTodayString()} &bull; Normal SL &bull; Same course for everyone</div>
              </div>
              {dailyBest?.date === getTodayString() ? (
                <div className="text-right">
                  <div className="text-amber-400 font-black text-lg">{dailyBest.best.gates}</div>
                  <div className="text-slate-500 text-[9px]">gates today</div>
                </div>
              ) : (
                <div className="text-amber-500 text-xs font-bold opacity-70">Play!</div>
              )}
            </button>
          </div>
        )}

        {/* Arcade Mode toggle */}
        <div className="mt-4 flex items-center justify-between bg-purple-950/40 border border-purple-500/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <div>
              <div className="text-purple-200 text-sm font-black tracking-wide">ARCADE MODE</div>
              <div className="text-purple-400/70 text-[10px]">Power-ups spawn on the slope</div>
            </div>
          </div>
          <button
            onClick={() => onArcadeModeChange && onArcadeModeChange(!arcadeMode)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 border-2 ${
              arcadeMode
                ? 'bg-purple-500 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                : 'bg-slate-700 border-slate-600'
            }`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${
              arcadeMode ? 'left-6 bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]' : 'left-0.5 bg-slate-400'
            }`} />
          </button>
        </div>

        {/* START button */}
        <button onClick={onStart}
          className={`mt-4 w-full py-4 rounded-2xl font-black text-2xl text-white tracking-wider transition-all hover:scale-[1.03] active:scale-95 border ${
            arcadeMode
              ? 'bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 border-purple-400/40 shadow-[0_0_16px_rgba(139,92,246,0.4)]'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 start-glow border-green-400/30'
          }`}>
          {arcadeMode ? '⚡ START ARCADE' : 'START RUN'}
        </button>

        {/* FREE RIDE button — open mountain exploration mode */}
        {onStartFreeRide && (
          <button onClick={onStartFreeRide}
            className="mt-3 w-full py-3.5 rounded-2xl font-black text-xl text-white tracking-wider transition-all hover:scale-[1.03] active:scale-95 border border-sky-400/30 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-[0_0_16px_rgba(56,189,248,0.35)]">
            🏔️ FREE RIDE
          </button>
        )}

        {/* Music status + play button */}
        {soundEnabled && !musicPlaying && (
          <button onClick={tryStartMusic}
            className="mt-4 w-full py-3 bg-purple-600/40 hover:bg-purple-600/60 rounded-xl text-purple-200 text-sm font-bold transition-all border border-purple-500/30 animate-pulse">
            🎿 Tap here to play Ski Vibes!
          </button>
        )}
        {musicPlaying && (
          <div className="mt-4 text-center text-purple-300 text-sm font-bold animate-pulse">
            🎿 Ski Vibes playing!
          </div>
        )}

        {/* Ghost / Night / Sound toggles */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <button onClick={() => setShowHelp(true)}
            className="px-4 py-2 bg-slate-700/60 hover:bg-slate-600/60 rounded-xl text-slate-300 text-xs font-bold transition-all hover:scale-105 border border-slate-600/30">
            How to Play
          </button>
          <button onClick={() => {
              onToggleSound()
              if (!soundEnabled) {
                setTimeout(tryStartMusic, 100)
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 border ${
              soundEnabled
                ? 'bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border-blue-500/30'
                : 'bg-slate-700/60 hover:bg-slate-600/60 text-slate-500 border-slate-600/30'
            }`}>
            {soundEnabled ? '🔊 ON' : '🔇 OFF'}
          </button>
          {onGhostToggle && (
            <button onClick={onGhostToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 border ${
                ghostEnabled
                  ? 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border-cyan-500/30'
                  : 'bg-slate-700/60 hover:bg-slate-600/60 text-slate-500 border-slate-600/30'
              }`}>
              {ghostEnabled ? '👻 Ghost ON' : '👻 Ghost OFF'}
            </button>
          )}
          {onNightModeToggle && (
            <button onClick={onNightModeToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 border ${
                nightMode
                  ? 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border-indigo-500/30'
                  : 'bg-slate-700/60 hover:bg-slate-600/60 text-slate-500 border-slate-600/30'
              }`}>
              {nightMode ? '🌙 Night ON' : '🌙 Night OFF'}
            </button>
          )}
          <button onClick={() => setShowBadges(true)}
            className="px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 rounded-xl text-amber-300 text-xs font-bold transition-all hover:scale-105 border border-amber-500/30">
            🏆 Badges {earnedBadges ? `${earnedBadges.size}/12` : '0/12'}
          </button>
        </div>

        {/* Controls hint */}
        <div className="mt-4 text-slate-600 text-xs text-center font-medium tracking-wide">
          A/← Left &bull; D/→ Right &bull; Space to start
        </div>
      </div>

      {/* Overlays */}
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
      {showChangingRoom && <ChangingRoom style={skierStyle} onChange={onStyleChange} onClose={() => setShowChangingRoom(false)} unlockedItems={unlockedItems} />}
      {showShop && <Shop credits={credits} unlockedItems={unlockedItems} skierStyle={skierStyle} onBuy={onBuyItem} onEquip={onEquipItem} onClose={() => setShowShop(false)} />}
      {showBadges && <BadgeOverlay earnedBadges={earnedBadges} onClose={() => setShowBadges(false)} />}
    </div>
  )
}
