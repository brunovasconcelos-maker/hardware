import { COLORIDO_COLORS } from './orbs.js'

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

// The per-orb accent layer (`--accent`). No theme uses an accent glow anymore (it is transparent in all of them); the layer is
// kept because the glow layers' resting scales depend on their order. Positions (center + radius, % of the orb) per widget group.
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

// Preto: same logic. Three dark/mid blue-grey base tones (the lightest role repeats the mid tone, so white text keeps its
// contrast), a dark soft region that stays inside the orb (`--depth-inner`, see INNER_DEPTH_GLOWS: never at the edges, so
// the orbs do not melt into the dark display), a teal glow (`--sun`) and a small light highlight on some orbs (`--light`).
export const PRETO = {
  main: '#272524', // selector swatch
  base: { olive: '#30393D', sage: '#5A747D', light: '#808C90', mint: '#5A747D' },
  depth: '#1C292D',
  sun: '#22728D',
  light: '#ACCCD7',
}
const PRETO_COLORS = roleColors(PRETO.base)

// Laranja: same roles as the other themes, but each orb has its own explicit composition (slot colors below) so the palette is
// spread out: light pink dominates the mic, weather and battery; red dominates tasks and calendar (and a band in usage); the
// clocks are mostly dark purple; the rest is orange. White text stays readable: wherever pink is a large light area, the
// text/icons/rings sit over a darker area (orange or the purple inner depth, `--depth-inner`, like Preto). The pink also has
// a small rim glow (`--pink`, PINK_GLOWS). Two accents, one per orb: lime (`--sun`) or gold (`--sun-alt`, the orbs in
// GOLD_ORBS), as strong soft glows at the SUN_GLOWS positions.
export const LARANJA = {
  main: '#EB684A', // selector swatch
  red: '#E30800',
  orange: '#EB684A',
  pink: '#FBD1C6',
  depth: '#2E0A3A',
  lime: '#C2EB5E',
  gold: '#D7A94E',
}
const { red: R, orange: O, pink: P, depth: U } = LARANJA
// Color per slot of each orb (slot 0 = base; positions are the compositions in orbs.js).
const LARANJA_COLORS = {
  mic: [P, O, P, P, O, P, P, O], // pink (the lime glow sits on it) + orange · purple behind the icon
  tasks: [R, O, R, O, R, R, O, O], // red + orange · gold glow · purple
  weather: [P, O, P, O, P, O], // pink sides, orange behind the cloud and under the text · gold glow · purple center
  usage: [O, O, O, O, O, O, R, R, O, O], // orange with a red band · gold glow · purple
  calendar: [R, O, R, O], // red + orange · gold glow · purple
  battery: [P, P, P, P, P, P, P, P], // all pink (the lime glow sits on it) · purple behind the icons
  clock: [U, U, O, U, O, O, U, U, O], // dark purple with orange · gold glow
  tasksFull: [R, O, R, R, O, O, O],
  weatherFull: [P, O, P, O, P, O, O],
  usageWeekly: [O, O, O, O, O, R, R, O, O],
  usageDaily: [O, O, O, O, O, O, O, R, O],
  batteryFull: [P, O, O, O, O, O, O, O], // orange (the ring), with a soft pink sheen along the diagonal
  calendarFull: [R, O, R, O, R],
  clockFull: [U, U, O, U, O, O, U, U, O],
  digital: [O, O, P, O, O, U, U, O, O], // orange, a purple band behind the time, a little pink low-left
}
// Orbs whose accent is gold; every other orb with an accent glow gets lime.
export const GOLD_ORBS = new Set(['tasks', 'tasksFull', 'weather', 'weatherFull', 'usage', 'usageWeekly', 'usageDaily', 'calendar', 'calendarFull', 'clock'])

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
// Preto's depth: ~27% of the orb, kept inside it (the disc never reaches the edge), offset in a different direction per orb.
// Colored by `--depth-inner`.
export const INNER_DEPTH_GLOWS = {
  mic: { at: '42% 40%', size: '27%' },
  tasks: { at: '58% 40%', size: '27%' },
  usage: { at: '40% 58%', size: '27%' },
  usageWeekly: { at: '42% 42%', size: '27%' },
  usageDaily: { at: '60% 56%', size: '27%' },
  calendar: { at: '56% 60%', size: '27%' },
  calendarFull: { at: '40% 44%', size: '27%' },
  battery: { at: '60% 42%', size: '27%' },
  batteryFull: { at: '58% 58%', size: '27%' },
  clock: { at: '42% 58%', size: '27%' },
  clockFull: { at: '56% 42%', size: '27%' },
  tasksFull: { at: '44% 60%', size: '27%' },
  digital: { at: '60% 60%', size: '27%' },
  weather: { at: '50% 40%', size: '27%' },
  weatherFull: { at: '50% 60%', size: '27%' },
}
// Preto's light highlight: small (~12% of the orb), only on some orbs. Colored by `--light`.
export const LIGHT_GLOWS = {
  mic: { at: '30% 28%', size: '17%' },
  weather: { at: '70% 30%', size: '17%' },
  weatherFull: { at: '26% 34%', size: '17%' },
  usage: { at: '72% 26%', size: '17%' },
  calendar: { at: '28% 30%', size: '17%' },
  batteryFull: { at: '72% 32%', size: '17%' },
  clockFull: { at: '30% 66%', size: '17%' },
  digital: { at: '70% 66%', size: '17%' },
}
// Laranja's light pink: a small rim glow (~12% disc centered on the edge region), only on orbs whose rim is free of rings and dots.
export const PINK_GLOWS = {
  mic: { at: '82% 86%', size: '12%' },
  weather: { at: '90% 22%', size: '12%' },
  weatherFull: { at: '90% 24%', size: '12%' },
  calendar: { at: '88% 80%', size: '12%' },
  battery: { at: '88% 22%', size: '12%' },
  tasksFull: { at: '88% 84%', size: '12%' },
  calendarFull: { at: '88% 18%', size: '12%' },
  digital: { at: '86% 84%', size: '12%' },
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
  preto: {
    id: 'preto',
    label: 'Preto',
    swatch: PRETO.main,
    fg: '#ffffff',
    fgContrast: PRETO.depth, // text on the white "today" circle
    okBg: PRETO.sun, // OK button: #22728D with a white check
    okFg: '#ffffff',
    accent: 'transparent',
    depthInner: PRETO.depth,
    sun: PRETO.sun,
    light: PRETO.light,
    grain: true,
    orbs: PRETO_COLORS,
  },
  offwhite: {
    id: 'offwhite',
    label: 'Off white',
    swatch: OFFWHITE.main,
    fg: '#000000',
    fgContrast: '#ffffff',
    okBg: OFFWHITE.main, // OK button: the theme's main color, dark check
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
    okBg: ROXO.main, // OK button: the theme's main color, dark check
    okFg: '#000000',
    accent: 'transparent', // the coral is the `sun` glow
    depth: ROXO.depth,
    sun: ROXO.sun,
    grain: true,
    orbs: ROXO_COLORS,
  },
  laranja: {
    id: 'laranja',
    label: 'Laranja',
    swatch: LARANJA.main,
    fg: '#ffffff',
    fgContrast: LARANJA.depth, // text on the white "today" circle
    okBg: LARANJA.main, // OK button: the theme's main color, white check
    okFg: '#ffffff',
    accent: 'transparent',
    depthInner: LARANJA.depth,
    sun: LARANJA.lime,
    sunAlt: LARANJA.gold,
    pink: LARANJA.pink,
    grain: true,
    orbs: LARANJA_COLORS,
  },
  verde: {
    id: 'verde',
    label: 'Verde',
    swatch: VERDE.main,
    fg: '#ffffff',
    fgContrast: VERDE.depth, // text on the white "today" circle
    okBg: VERDE.main, // OK button: the theme's main color, dark check
    okFg: '#000000',
    accent: 'transparent', // the yellow is the `sun` glow
    depth: VERDE.depth,
    sun: VERDE.sun,
    grain: true,
    orbs: VERDE_COLORS,
  },
}

// Order shown in the selector.
export const THEME_ORDER = ['preto', 'offwhite', 'laranja', 'verde', 'roxo', 'colorido']
export const DEFAULT_THEME = 'colorido'
