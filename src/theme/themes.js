import { COLORIDO_COLORS } from './orbs.js'

// ---------------------------------------------------------------------------------------------------------------
// Palettes: 100 lightest … 700 darkest, 400 is the base tone (used for the selector swatch, except Preto, see below).
export const PALETTES = {
  preto: { 100: '#9897D5', 200: '#7A76BF', 300: '#605AA7', 400: '#4B438E', 500: '#3C3476', 600: '#2F2863', 700: '#261F52' },
  offwhite: { 100: '#FAF6F2', 200: '#F4EFEA', 300: '#EFE9E2', 400: '#E9E2DA', 500: '#A8A097', 600: '#6C6359', 700: '#352C21' },
  roxo: { 100: '#FAF4FE', 200: '#EEE6F2', 300: '#E2D9E7', 400: '#D6CBDC', 500: '#9D90A4', 600: '#67596F', 700: '#36273E' },
  azul: { 100: '#E8FBFD', 200: '#D7EFF1', 300: '#C6E4E6', 400: '#B5D8DB', 500: '#749FA2', 600: '#35696D', 700: '#003539' },
  laranja: { 100: '#FFF4F1', 200: '#FFD0C5', 300: '#F5AE9E', 400: '#E2917F', 500: '#BD5D49', 600: '#96240C', 700: '#590C00' },
}

// Orbs that belong to the same widget share one tone combination (compact widget + its full screens).
const GROUP_OF = {
  mic: 'mic',
  tasks: 'tasks', tasksFull: 'tasks',
  weather: 'weather', weatherFull: 'weather',
  usage: 'usage', usageWeekly: 'usage',
  usageDaily: 'usageDaily',
  battery: 'battery', batteryFull: 'battery',
  calendar: 'calendar', calendarFull: 'calendar',
  clock: 'clockA', clockFull: 'clockA',
  digital: 'clockB',
}

// Gradient recipes for the monochrome themes: 2–4 palette tones per widget, a different combination for each widget.
// Each orb keeps its Colorido composition; its slots are mapped onto these tones by lightness (see mapToTones).
//   Preto: dark tones (300–700) · Off white: light tones (100–500) · Roxo/Azul/Laranja: any tones.
export const TONES = {
  preto: {
    mic: [300, 400, 500, 700], tasks: [300, 500, 700], weather: [400, 600], usage: [300, 600, 700], usageDaily: [500, 700],
    battery: [400, 500, 700], calendar: [300, 400, 600], clockA: [300, 500, 600, 700], clockB: [400, 700],
  },
  offwhite: {
    mic: [100, 400, 500], tasks: [200, 400, 500], weather: [100, 300], usage: [100, 300, 500], usageDaily: [200, 500],
    battery: [100, 200, 400], calendar: [300, 400, 500], clockA: [100, 300, 400, 500], clockB: [200, 300],
  },
  roxo: {
    mic: [100, 500, 700], tasks: [500, 600, 700], weather: [300, 500, 600], usage: [400, 600, 700], usageDaily: [200, 500, 700],
    battery: [500, 700], calendar: [400, 500, 600], clockA: [300, 600, 700], clockB: [500, 600],
  },
  azul: {
    mic: [200, 500, 600], tasks: [600, 700], weather: [300, 500, 600], usage: [200, 500, 700], usageDaily: [400, 600, 700],
    battery: [500, 600, 700], calendar: [300, 500], clockA: [400, 500, 700], clockB: [100, 500, 700],
  },
  laranja: {
    mic: [100, 500, 600], tasks: [500, 600, 700], weather: [200, 400, 600], usage: [300, 500, 700], usageDaily: [400, 500, 600],
    battery: [600, 700], calendar: [300, 500, 600], clockA: [200, 500, 700], clockB: [400, 600, 700],
  },
}

// One complementary accent per monochrome theme: an extra soft glow on every orb (part of the theme tokens, `--accent`).
const ACCENTS = { preto: '#D6812E', offwhite: '#9CC2EA', roxo: '#D5E182', azul: '#F99C7C', laranja: '#1C989E' }

// Where the glow sits on each widget group's orbs (center + radius, % of the orb), varied between groups. Each disc
// covers 19–25% of the orb's area, so the accent is never dominant.
export const ACCENT_GLOWS = {
  mic: { at: '28% 72%', size: '26%' },
  tasks: { at: '72% 70%', size: '25%' },
  weather: { at: '50% 85%', size: '28%' },
  usage: { at: '25% 25%', size: '26%' },
  usageDaily: { at: '78% 30%', size: '24%' },
  battery: { at: '50% 20%', size: '26%' },
  calendar: { at: '80% 75%', size: '27%' },
  clockA: { at: '22% 55%', size: '25%' },
  clockB: { at: '60% 78%', size: '25%' },
}
export const glowOf = (orbId) => ACCENT_GLOWS[GROUP_OF[orbId]]

// ---------------------------------------------------------------------------------------------------------------
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Replaces an orb's Colorido slot colors with the given tones, preserving the light/dark structure of the composition:
// slots are ranked by lightness and spread evenly over the tones (darkest slot -> darkest tone).
function mapToTones(colors, tones) {
  const sortedTones = [...tones].sort((a, b) => luminance(a) - luminance(b))
  const order = colors.map((c, i) => [luminance(c), i]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const out = new Array(colors.length)
  order.forEach(([, i], rank) => {
    out[i] = sortedTones[colors.length === 1 ? 0 : Math.round((rank * (sortedTones.length - 1)) / (colors.length - 1))]
  })
  return out
}

function monochrome(id, label, paletteKey, { fg, fgContrast, okTone, swatch }) {
  const palette = PALETTES[paletteKey]
  const orbs = {}
  for (const [orbId, colors] of Object.entries(COLORIDO_COLORS)) {
    orbs[orbId] = mapToTones(colors, TONES[paletteKey][GROUP_OF[orbId]].map((n) => palette[n]))
  }
  return { id, label, swatch: swatch ?? palette[400], fg, fgContrast, okBg: palette[okTone], okFg: palette[700], accent: ACCENTS[paletteKey], grain: false, orbs }
}

// Verde uses roles instead of the 100–700 scale (reference: Figma 204:2847). The orbs mix green, yellow and blue:
//  - four green base tones carry the gradients (the orb's own color slots below, matched to the reference by position),
//  - yellow is a strong soft glow, mostly at the bottom (extra `--sun` layer, up to ~30% of the orb),
//  - navy is a real gradient color: a soft dark corner in some orbs (extra `--depth` layer, up to ~25%, never on all).
// Foreground on the gradients is white, like the other themes.
export const VERDE = {
  main: '#C2D09F', // selector swatch
  base: { olive: '#758256', sage: '#9DAC79', light: '#C2D09F', mint: '#A2DCBF' },
  depth: '#090F45',
  sun: '#F6EE45',
}
const { olive: O, sage: S, light: L, mint: M } = VERDE.base
// Color per slot of each orb (slot 0 = base; the slot order/positions are the orb compositions in orbs.js).
const VERDE_COLORS = {
  mic: [L, S, M, O, O, S, M, L],
  tasks: [S, L, M, L, L, M, S, O],
  weather: [O, S, O, S, L, S],
  usage: [S, S, L, L, M, M, S, S, L, L],
  calendar: [M, O, M, L],
  battery: [S, L, M, S, S, L, L, M],
  clock: [S, S, O, L, M, S, S, M, M],
  tasksFull: [L, S, M, L, L, S, S],
  weatherFull: [O, S, O, S, L, S, S],
  usageWeekly: [S, S, L, M, M, S, S, L, L],
  usageDaily: [S, L, S, M, O, M, M, L, L],
  batteryFull: [L, L, S, L, O, S, L, M],
  calendarFull: [O, S, M, S, L],
  clockFull: [S, S, O, M, M, S, M, M, L],
  digital: [O, S, M, M, O, S, M, M, L],
}

// Extra glow layers (center + radius, % of the orb), only on the orbs that have one in the reference. The disc areas
// (clipped by the circle) are ~34–40% for navy (most orbs, soft and blurred; not on the weather orbs) and ~20–28% for yellow. Their colors are the `--depth` / `--sun` tokens,
// transparent in every theme except Verde.
export const DEPTH_GLOWS = {
  mic: { at: '50% 0%', size: '49%' },
  tasks: { at: '0% 0%', size: '64%' },
  usage: { at: '0% 0%', size: '67%' },
  usageWeekly: { at: '0% 0%', size: '69%' },
  usageDaily: { at: '0% 45%', size: '48%' },
  calendar: { at: '100% 100%', size: '67%' },
  calendarFull: { at: '100% 100%', size: '69%' },
  battery: { at: '100% 0%', size: '64%' },
  batteryFull: { at: '0% 0%', size: '66%' },
  clock: { at: '12% 92%', size: '53%' },
  clockFull: { at: '0% 100%', size: '66%' },
  tasksFull: { at: '100% 0%', size: '64%' },
  digital: { at: '100% 100%', size: '64%' },
}
export const SUN_GLOWS = {
  mic: { at: '100% 72%', size: '40%' },
  tasks: { at: '85% 82%', size: '38%' },
  tasksFull: { at: '80% 95%', size: '45%' },
  weather: { at: '15% 92%', size: '42%' },
  weatherFull: { at: '10% 95%', size: '50%' },
  usage: { at: '62% 104%', size: '44%' },
  usageWeekly: { at: '55% 108%', size: '48%' },
  usageDaily: { at: '55% 108%', size: '48%' },
  calendar: { at: '10% 15%', size: '37%' },
  calendarFull: { at: '12% 12%', size: '37%' },
  battery: { at: '50% 102%', size: '41%' },
  batteryFull: { at: '90% 90%', size: '47%' },
  clock: { at: '95% 88%', size: '41%' },
}

export const THEMES = {
  // The original design, exactly as it was before themes existed. Default.
  colorido: {
    id: 'colorido',
    label: 'Colorido',
    swatch: 'conic-gradient(from 200deg, #ff5a5f, #ffb347, #f2e66b, #6af058, #3fb7ff, #8a5cff, #ff5ac8, #ff5a5f)',
    fg: '#ffffff',
    fgContrast: '#000000',
    okBg: '#6af058',
    okFg: '#000000',
    grain: false,
    accent: 'transparent', // no accent glow: Colorido keeps its original colors
    orbs: COLORIDO_COLORS,
  },
  preto: monochrome('preto', 'Preto', 'preto', { fg: '#ffffff', fgContrast: '#000000', okTone: 100, swatch: '#272524' }),
  offwhite: monochrome('offwhite', 'Off white', 'offwhite', { fg: '#000000', fgContrast: '#ffffff', okTone: 100 }),
  roxo: monochrome('roxo', 'Roxo', 'roxo', { fg: '#ffffff', fgContrast: '#000000', okTone: 400 }),
  azul: monochrome('azul', 'Azul', 'azul', { fg: '#ffffff', fgContrast: '#000000', okTone: 400 }),
  verde: {
    id: 'verde',
    label: 'Verde',
    swatch: VERDE.main,
    fg: '#ffffff',
    fgContrast: VERDE.depth, // text on the white "today" circle
    okBg: '#E3E9CD',
    okFg: VERDE.depth,
    accent: 'transparent', // the yellow is the `sun` glow
    depth: VERDE.depth,
    sun: VERDE.sun,
    grain: true,
    orbs: VERDE_COLORS,
  },
  laranja: monochrome('laranja', 'Laranja', 'laranja', { fg: '#ffffff', fgContrast: '#000000', okTone: 400 }),
}

// Order shown in the selector.
export const THEME_ORDER = ['preto', 'offwhite', 'roxo', 'azul', 'laranja', 'verde', 'colorido']
export const DEFAULT_THEME = 'colorido'
