import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameSettings'

export const generateSnowParticles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: 1 + Math.random() * 2,
    speed: 0.5 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 0.5
  }))
}

export const generateSparkles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: 1 + Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.5
  }))
}

export const generateTrees = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: (i / count) * GAME_HEIGHT * 1.2 - 50,
    size: 0.4 + Math.random() * 0.4,
    offset: Math.random() * 15
  }))
}

export const generateCrowd = (count) => {
  const jacketColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
  const hatColors = ['#1f2937', '#dc2626', '#1d4ed8', '#047857', '#7c3aed', '#be185d']

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: (i / count) * GAME_HEIGHT * 1.5 - 100,
    xOffset: Math.random() * 20,
    jacketColor: jacketColors[Math.floor(Math.random() * jacketColors.length)],
    hatColor: hatColors[Math.floor(Math.random() * hatColors.length)],
    hasHat: Math.random() > 0.3,
    hasScarf: Math.random() > 0.5,
    scarfColor: jacketColors[Math.floor(Math.random() * jacketColors.length)],
    height: 0.7 + Math.random() * 0.3,
    armRaise: Math.random(),
    cheerOffset: Math.random() * Math.PI * 2
  }))
}

// Format time as MM:SS.ss
export const formatTime = (ms) => {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`
}

// Format split time difference
export const formatSplit = (diff) => {
  const prefix = diff >= 0 ? '+' : ''
  return `${prefix}${diff.toFixed(2)}`
}
