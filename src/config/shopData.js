// Equipment Shop — items, prices, and credit calculation

export const SHOP_ITEMS = [
  // ===== HELMETS =====
  { id: 'helmet-sharkfin',    category: 'helmet',  name: 'Shark Fin',          price: 200,  color: '#374151' },
  { id: 'helmet-gold',        category: 'helmet',  name: 'Gold Champion',      price: 500,  color: '#fbbf24' },
  { id: 'helmet-neongreen',   category: 'helmet',  name: 'Neon Green',         price: 150,  color: '#22c55e' },
  { id: 'helmet-iceblue',     category: 'helmet',  name: 'Ice Blue',           price: 150,  color: '#06b6d4' },
  { id: 'helmet-hotpink',     category: 'helmet',  name: 'Hot Pink',           price: 200,  color: '#f472b6' },
  { id: 'helmet-midnight',    category: 'helmet',  name: 'Midnight',           price: 250,  color: '#0f172a' },
  { id: 'helmet-fire',        category: 'helmet',  name: 'Flame Red',          price: 300,  color: '#dc2626' },
  { id: 'helmet-electric',    category: 'helmet',  name: 'Electric Violet',    price: 350,  color: '#7c3aed' },
  { id: 'helmet-diamond',     category: 'helmet',  name: 'Diamond White',      price: 800,  color: '#f8fafc' },
  { id: 'helmet-toxic',       category: 'helmet',  name: 'Toxic Green',        price: 400,  color: '#4ade80' },

  // ===== SUITS =====
  { id: 'suit-lava',          category: 'suit',    name: 'Lava',               price: 300,  color: '#ef4444' },
  { id: 'suit-galaxy',        category: 'suit',    name: 'Galaxy Purple',      price: 250,  color: '#8b5cf6' },
  { id: 'suit-stealth',       category: 'suit',    name: 'Stealth Black',      price: 200,  color: '#1e293b' },
  { id: 'suit-sunset',        category: 'suit',    name: 'Sunset Orange',      price: 150,  color: '#f97316' },
  { id: 'suit-arctic',        category: 'suit',    name: 'Arctic Frost',       price: 300,  color: '#67e8f9' },
  { id: 'suit-bubblegum',     category: 'suit',    name: 'Bubblegum',          price: 200,  color: '#f9a8d4' },
  { id: 'suit-camo',          category: 'suit',    name: 'Snow Camo',          price: 350,  color: '#94a3b8' },
  { id: 'suit-neon',          category: 'suit',    name: 'Neon Lime',          price: 400,  color: '#a3e635' },
  { id: 'suit-royal',         category: 'suit',    name: 'Royal Blue',         price: 300,  color: '#1d4ed8' },
  { id: 'suit-blood',         category: 'suit',    name: 'Blood Moon',         price: 500,  color: '#991b1b' },
  { id: 'suit-phantom',       category: 'suit',    name: 'Phantom',            price: 750,  color: '#0c0a09' },
  { id: 'suit-gold',          category: 'suit',    name: 'Gold Rush',          price: 1000, color: '#d97706' },

  // ===== GOGGLES =====
  { id: 'goggles-chrome',     category: 'goggles', name: 'Mirror Chrome',      price: 200,  color: '#e2e8f0' },
  { id: 'goggles-rosegold',   category: 'goggles', name: 'Rose Gold',          price: 300,  color: '#ec4899' },
  { id: 'goggles-emerald',    category: 'goggles', name: 'Emerald',            price: 150,  color: '#22c55e' },
  { id: 'goggles-sunset',     category: 'goggles', name: 'Sunset',             price: 200,  color: '#fb923c' },
  { id: 'goggles-ice',        category: 'goggles', name: 'Ice Storm',          price: 250,  color: '#22d3ee' },
  { id: 'goggles-midnight',   category: 'goggles', name: 'Midnight Blue',      price: 300,  color: '#1e3a8a' },
  { id: 'goggles-ruby',       category: 'goggles', name: 'Ruby Red',           price: 350,  color: '#e11d48' },
  { id: 'goggles-galaxy',     category: 'goggles', name: 'Galaxy',             price: 500,  color: '#7c3aed' },
  { id: 'goggles-xray',       category: 'goggles', name: 'X-Ray',             price: 600,  color: '#86efac' },
  { id: 'goggles-inferno',    category: 'goggles', name: 'Inferno',            price: 800,  color: '#f97316' },

  // ===== SKIS =====
  { id: 'skis-gold',          category: 'skis',    name: 'Gold Skis',          price: 400,  color: '#fbbf24' },
  { id: 'skis-neonblue',      category: 'skis',    name: 'Neon Blue',          price: 200,  color: '#3b82f6' },
  { id: 'skis-arctic',        category: 'skis',    name: 'Arctic White',       price: 150,  color: '#e2e8f0' },
  { id: 'skis-flame',         category: 'skis',    name: 'Flame',              price: 300,  color: '#ef4444' },
  { id: 'skis-toxic',         category: 'skis',    name: 'Toxic Lime',         price: 250,  color: '#84cc16' },
  { id: 'skis-shadow',        category: 'skis',    name: 'Shadow',             price: 300,  color: '#1e293b' },
  { id: 'skis-bubblegum',     category: 'skis',    name: 'Bubblegum',          price: 200,  color: '#f9a8d4' },
  { id: 'skis-electric',      category: 'skis',    name: 'Electric Purple',    price: 350,  color: '#a855f7' },
  { id: 'skis-diamond',       category: 'skis',    name: 'Diamond',            price: 900,  color: '#f0f9ff' },
  { id: 'skis-dragon',        category: 'skis',    name: 'Dragon Fire',        price: 1200, color: '#dc2626' },

  // ===== BIBS (special bib numbers!) =====
  { id: 'bib-1',              category: 'bib',     name: '#1 The Champion',    price: 1000, bibNumber: 1 },
  { id: 'bib-7',              category: 'bib',     name: '#7 Lucky Seven',     price: 300,  bibNumber: 7 },
  { id: 'bib-10',             category: 'bib',     name: '#10 Perfect Ten',    price: 250,  bibNumber: 10 },
  { id: 'bib-13',             category: 'bib',     name: '#13 Unlucky',        price: 200,  bibNumber: 13 },
  { id: 'bib-23',             category: 'bib',     name: '#23 GOAT',           price: 500,  bibNumber: 23 },
  { id: 'bib-69',             category: 'bib',     name: '#69 Nice',           price: 150,  bibNumber: 69 },
  { id: 'bib-77',             category: 'bib',     name: '#77 Double Lucky',   price: 350,  bibNumber: 77 },
  { id: 'bib-99',             category: 'bib',     name: '#99 The Great One',  price: 400,  bibNumber: 99 },
  { id: 'bib-0',              category: 'bib',     name: '#0 Zero Hero',       price: 600,  bibNumber: 0 },
  { id: 'bib-42',             category: 'bib',     name: '#42 The Answer',     price: 200,  bibNumber: 42 },
]

// All shop-exclusive colors (used by Changing Room to show lock icons)
export const SHOP_EXCLUSIVE_COLORS = SHOP_ITEMS
  .filter(i => i.color)
  .map(i => ({ color: i.color, category: i.category, id: i.id }))

// Category display info
export const SHOP_CATEGORIES = [
  { key: 'helmet',  label: 'Helmets',  icon: '⛑️' },
  { key: 'suit',    label: 'Suits',    icon: '🧥' },
  { key: 'goggles', label: 'Goggles',  icon: '🥽' },
  { key: 'skis',    label: 'Skis',     icon: '🎿' },
  { key: 'bib',     label: 'Bibs',     icon: '🔢' },
]

/**
 * Calculate credits earned for a run.
 */
export function calculateRunCredits(timing, gatesCleared, maxCombo, finished) {
  let total = 0
  total += (timing.perfect || 0) * 10
  total += (timing.good || 0) * 5
  total += gatesCleared * 2
  if (finished) total += 50
  total += (maxCombo || 0) * 3
  return total
}
