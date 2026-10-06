import { COLORIDO_COLORS } from './orbs.js'

// ---------------------------------------------------------------------------------------------------------------
// Palettes: 100 lightest … 700 darkest, 400 is the base tone (used for the selector swatch, except Preto, see below).
export const PALETTES = {
  preto: { 100: '#9897D5', 200: '#7A76BF', 300: '#605AA7', 400: '#4B438E', 500: '#3C3476', 600: '#2F2863', 700: '#261F52' },
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
//   Preto: dark tones (300–700). 
export const TONES = {
  preto: {
    mic: [300, 400, 500, 700], tasks: [300, 500, 700], weather: [400, 600], usage: [300, 600, 700], usageDaily: [500, 700],
    battery: [400, 500, 700], calendar: [300, 400, 600], clockA: [300, 500, 600, 700], clockB: [400, 700],
  },
}

// One complementary accent per monochrome theme: an extra soft glow on every orb (part of the theme tokens, `--accent`).
const ACCENTS = { preto: '#D6812E' }

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

// Color per slot of each orb for a "roles" theme (Verde, Roxo): O = darkest base tone, then S, L, M. Slot 0 = base; the slot
// order/positions are the orb compositions in orbs.js. Both themes share the same layout, with their own tones.
const roleColors = ({ olive: O, sage: S, light: L, mint: M }) => ({
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
})
const VERDE_COLORS = roleColors(VERDE.base)

// Roxo: same logic as Verde — four base tones, a wine depth (soft dark regions, `--depth`) and a coral accent glow (`--sun`).
export const ROXO = {
  main: '#B6A4F1', // selector swatch
  base: { olive: '#7560B9', sage: '#A49BDC', light: '#B2A3CC', mint: '#B6A4F1' },
  depth: '#6B0B41',
  sun: '#FC7B89',
}
const ROXO_COLORS = roleColors(ROXO.base)

// Off white: same logic, light tones with black foreground. The brick depth is only a soft region toward the edges of the
// orb (`--depth-edge`, ~22% of the area, see EDGE_DEPTH_GLOWS) so black text and rings never sit on it; gold is the `--sun` glow.
export const OFFWHITE = {
  main: '#E9E2DA', // selector swatch
  base: { olive: '#D2C2AF', sage: '#D0C4B7', light: '#E9E2DA', mint: '#F4B6B0' },
  depth: '#924642',
  sun: '#F1CA87',
}
const OFFWHITE_COLORS = roleColors(OFFWHITE.base)

// Extra glow layers (center + radius, % of the orb), only on the orbs that have one in the reference. The disc areas
// (clipped by the circle) are ~34–40% for navy (most orbs, soft and blurred; not on the weather orbs) and ~20–28% for yellow. Their colors are the `--depth` / `--sun` tokens,
// transparent in every theme except the roles themes (Verde, Roxo).
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
// Off white's depth: smaller (~22%) and pushed to the edges/corners of each orb. Colored by `--depth-edge`.
export const EDGE_DEPTH_GLOWS = {
  mic: { at: '50% 0%', size: '36%' },
  tasks: { at: '100% 100%', size: '54%' },
  usage: { at: '0% 0%', size: '54%' },
  usageWeekly: { at: '0% 0%', size: '54%' },
  usageDaily: { at: '100% 0%', size: '54%' },
  calendar: { at: '100% 100%', size: '54%' },
  calendarFull: { at: '100% 100%', size: '54%' },
  battery: { at: '100% 0%', size: '54%' },
  batteryFull: { at: '0% 0%', size: '54%' },
  clock: { at: '0% 100%', size: '54%' },
  clockFull: { at: '0% 100%', size: '54%' },
  tasksFull: { at: '100% 0%', size: '54%' },
  digital: { at: '100% 100%', size: '54%' },
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
    swatch: 'conic-gradient(from 0deg, #ff00ff, #0000ff 25%, #00ffff 40%, #00ff00 57%, #ffff00 75%, #ff0000 90%, #ff00ff)', // hue wheel, Figma 204:2997
    fg: '#ffffff',
    fgContrast: '#000000',
    okBg: '#6af058',
    okFg: '#000000',
    grain: false,
    accent: 'transparent', // no accent glow: Colorido keeps its original colors
    orbs: COLORIDO_COLORS,
  },
  preto: monochrome('preto', 'Preto', 'preto', { fg: '#ffffff', fgContrast: '#000000', okTone: 100, swatch: '#272524' }),
  offwhite: {
    id: 'offwhite',
    label: 'Off white',
    swatch: OFFWHITE.main,
    fg: '#000000',
    fgContrast: '#ffffff',
    okBg: OFFWHITE.main,
    okFg: '#000000',
    accent: 'transparent', // the gold is the `sun` glow
    depthEdge: OFFWHITE.depth,
    sun: OFFWHITE.sun,
    grain: true,
    orbs: OFFWHITE_COLORS,
  },
  roxo: {
    id: 'roxo',
    label: 'Roxo',
    swatch: ROXO.main,
    fg: '#ffffff',
    fgContrast: ROXO.depth, // text on the white "today" circle
    okBg: ROXO.base.mint,
    okFg: ROXO.depth,
    accent: 'transparent', // the coral is the `sun` glow
    depth: ROXO.depth,
    sun: ROXO.sun,
    grain: true,
    orbs: ROXO_COLORS,
  },
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
}

// Order shown in the selector.
export const THEME_ORDER = ['preto', 'offwhite', 'verde', 'roxo', 'colorido']
export const DEFAULT_THEME = 'colorido'
