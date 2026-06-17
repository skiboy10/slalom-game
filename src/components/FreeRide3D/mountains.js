// Theme definitions for the 3D Free Ride mountains. Each is a real, recognizable
// resort/peak rendered in a blocky/voxel style. Colors are plain hex so the
// low-poly meshes read clearly. Night variants darken the sky/fog/snow.

export const MOUNTAINS = [
  {
    id: 'matterhorn',
    name: 'Matterhorn',
    country: 'Switzerland',
    emoji: '🔺',
    backdrop: 'matterhorn',      // sharp grey pyramid with a snow cap
    treeType: 'pine',            // tall alpine pines
    blurb: 'The pointy Toblerone peak!',
    day:   { sky: '#7ec8f0', fog: '#cfeaff', fogNear: 22, fogFar: 130, snow: '#f4f9ff', rock: '#7c8794', peakSnow: '#ffffff', sun: [40, 60, 20], accent: '#3b82f6' },
    night: { sky: '#0a1230', fog: '#16204a', fogNear: 18, fogFar: 95,  snow: '#aeb8d8', rock: '#39414f', peakSnow: '#cbd5e1', sun: [-30, 40, -20], accent: '#60a5fa' },
  },
  {
    id: 'fuji',
    name: 'Mount Fuji',
    country: 'Japan',
    emoji: '🗻',
    backdrop: 'fuji',            // big symmetrical white cone with a crater
    treeType: 'blossom',         // pink cherry-blossom / birch
    blurb: 'A giant snowy volcano cone.',
    day:   { sky: '#ffd9e6', fog: '#ffe9f0', fogNear: 24, fogFar: 140, snow: '#fff6fb', rock: '#9aa0b0', peakSnow: '#ffffff', sun: [30, 50, 30], accent: '#f472b6' },
    night: { sky: '#1a1030', fog: '#2a1a3a', fogNear: 18, fogFar: 95,  snow: '#c9b6d6', rock: '#4a4358', peakSnow: '#e9d5f0', sun: [-20, 40, -25], accent: '#f9a8d4' },
  },
  {
    id: 'whistler',
    name: 'Whistler',
    country: 'Canada',
    emoji: '⛰️',
    backdrop: 'whistler',        // twin glaciated peaks
    treeType: 'fir',             // dense dark-green firs
    blurb: 'Twin glacier peaks & big forests.',
    day:   { sky: '#9cd3f5', fog: '#dbeeff', fogNear: 20, fogFar: 120, snow: '#eef6ff', rock: '#6b7686', peakSnow: '#ffffff', sun: [40, 55, 10], accent: '#10b981' },
    night: { sky: '#08122a', fog: '#101d3a', fogNear: 16, fogFar: 85,  snow: '#a6b4cf', rock: '#333d4d', peakSnow: '#c3d0e0', sun: [-30, 40, -15], accent: '#34d399' },
  },
  {
    id: 'teton',
    name: 'Grand Teton',
    country: 'USA',
    emoji: '🏔️',
    backdrop: 'teton',           // jagged rocky spikes
    treeType: 'rugged',          // sparse rugged pines
    blurb: 'Wild jagged rocky spikes.',
    day:   { sky: '#86bdf0', fog: '#d7e7fb', fogNear: 22, fogFar: 130, snow: '#eef4fc', rock: '#5f6b7a', peakSnow: '#ffffff', sun: [50, 50, 25], accent: '#f59e0b' },
    night: { sky: '#070f24', fog: '#0e1830', fogNear: 16, fogFar: 90,  snow: '#9fadc6', rock: '#2c3543', peakSnow: '#bcc8d8', sun: [-25, 40, -20], accent: '#fbbf24' },
  },
]

export const getMountain = (id) => MOUNTAINS.find(m => m.id === id) || MOUNTAINS[0]

// Pick the active day/night palette for a theme.
export const palette = (theme, nightMode) => (nightMode ? theme.night : theme.day)

// Slope / world tuning (shared by the 3D scene)
export const SLOPE_HALF_WIDTH = 9      // how far left/right the rider can go
export const TURN_ACCEL = 16           // lateral steering speed
export const START_SPEED = 0.35
export const CRUISE_SPEED = 0.55
export const MAX_SPEED = 1.25
export const MIN_SPEED = 0.18
export const TUCK_GAIN = 0.012
export const PLOW_DROP = 0.03
export const WARN_SPEED = 1.05
export const RUN_LENGTH = 900           // distance to the lift base
