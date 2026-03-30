// Darken a hex color by a percentage (0-100)
export function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent))
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * percent))
  const b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * percent))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}
