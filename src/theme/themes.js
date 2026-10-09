// The four color themes: Roxo (default), Azul, Verde, Laranja. Every theme is built from roles:
//   - base tones: the colors of the orb's gradient layers (explicit color per layer slot, see ORB_COLORS / LARANJA_COLORS);
//   - depth: soft dark regions (`--depth`, and a second one, `--depth-2`, in Azul) kept inside the orb so orbs never melt
//     into the dark display; ~28% of the area each (the cap is ~35%);
//   - accent: a strong soft glow, ~20–28% of the orb (`--sun`; Laranja has a second accent, `--sun-alt`, one per orb).
// The foreground on the gradients is white in every theme. Gradients are static; the compositions (positions, sizes, stops)
// are in orbs.js, the glows' positions below. The same glow positions are used by all themes, so a theme switch only morphs colors.

// Glow layers: center + radius (% of the orb). Depth is inside the orb (the disc never reaches the edge) and offset in a different
// direction per orb. Colored by `--depth`.
export const DEPTH_GLOWS = {
  mic: { at: '42% 40%', size: '28%' },
  tasks: { at: '58% 40%', size: '28%' },
  recording: { at: '40% 58%', size: '28%' },
  calendar: { at: '56% 60%', size: '28%' },
  calendarFull: { at: '40% 44%', size: '28%' },
  battery: { at: '60% 42%', size: '28%' },
  batteryFull: { at: '58% 58%', size: '28%' },
  clock: { at: '42% 58%', size: '28%' },
  clockFull: { at: '56% 42%', size: '28%' },
  tasksFull: { at: '44% 60%', size: '28%' },
  digital: { at: '60% 60%', size: '28%' },
  weather: { at: '50% 40%', size: '28%' },
  weatherFull: { at: '50% 60%', size: '28%' },
}
// Azul's second depth (vivid blue, `--depth-2`): a smaller disc (~20% of the area) on the other side of the orb, on some orbs.
export const DEPTH2_GLOWS = {
  mic: { at: '62% 60%', size: '20%' },
  recording: { at: '62% 42%', size: '20%' },
  calendar: { at: '44% 40%', size: '20%' },
  clock: { at: '58% 42%', size: '20%' },
  tasksFull: { at: '58% 40%', size: '20%' },
  batteryFull: { at: '42% 42%', size: '20%' },
}
// The accent glow (`--sun`, or `--sun-alt` for the orbs in GOLD_ORBS): mostly toward the bottom/sides, ~20–28% of the orb.
export const SUN_GLOWS = {
  mic: { at: '100% 72%', size: '40%' },
  tasks: { at: '85% 82%', size: '38%' },
  tasksFull: { at: '80% 95%', size: '45%' },
  weather: { at: '15% 92%', size: '42%' },
  weatherFull: { at: '10% 95%', size: '50%' },
  recording: { at: '62% 104%', size: '44%' },
  calendar: { at: '10% 15%', size: '37%' },
  calendarFull: { at: '12% 12%', size: '37%' },
  battery: { at: '50% 102%', size: '41%' },
  batteryFull: { at: '90% 90%', size: '47%' },
  clock: { at: '95% 88%', size: '41%' },
}
// Laranja only: orbs whose accent is gold; every other orb with an accent glow gets lime.
export const GOLD_ORBS = new Set(['tasks', 'tasksFull', 'weather', 'weatherFull', 'recording', 'calendar', 'calendarFull', 'clock'])

// Orb compositions as tone letters, one per layer slot (slot 0 = the orb's base color; the slot order/positions are in orbs.js).
// A = darkest base tone … E = lightest. The light orbs (mic, weather, battery) carry large light areas; the text, icons and
// rings sit over the depth region or a darker tone. Tasks and recording are mid, calendar and the clocks darker.
const TEMPLATES = {
  mic: 'ECEDBEEC',
  tasks: 'BABABBAA',
  weather: 'DADCBA',
  recording: 'BBBBAACCBB',
  calendar: 'ABAB',
  battery: 'DEDDEBCC',
  clock: 'AABABBAAB',
  tasksFull: 'BABBBAA',
  weatherFull: 'DADBDAB',
  batteryFull: 'CABABBAA',
  calendarFull: 'ABABA',
  clockFull: 'AABABBAAB',
  digital: 'CBDCBAABC',
}
const fromTemplates = (ramp) => Object.fromEntries(Object.entries(TEMPLATES).map(([id, letters]) => [id, [...letters].map((l) => ramp[l])]))

export const ROXO = {
  main: '#B6A4F1', // selector swatch
  ramp: { A: '#7560B9', B: '#9683D5', C: '#A49BDC', D: '#B2A3CC', E: '#B6A4F1' },
  depth: '#6B0B41',
  sun: '#FC7B89',
}
// Azul has three bases and all of them are light, so white would not be readable on the dark-leaning orbs (tasks, recording, calendar,
// clocks): its darkest ramp tone is the steel depth tone #2E5F7A (used as a base there, beyond its soft-region role) and the
// second depth (vivid blue) adds variety.
export const AZUL = {
  main: '#68ADD2', // selector swatch
  ramp: { A: '#2E5F7A', B: '#68ADD2', C: '#A6D7E8', D: '#D7EAF2', E: '#D7EAF2' },
  depth: '#2E5F7A',
  depth2: '#2635BA',
  sun: '#FF8EDF',
}
export const VERDE = {
  main: '#C2D09F', // selector swatch
  ramp: { A: '#758256', B: '#758256', C: '#C2D09F', D: '#C9EBDA', E: '#E3E9CD' },
  depth: '#090F45',
  sun: '#F6EE45',
}
// Laranja: explicit compositions so the palette is spread out: light pink leads the mic, weather and battery; red leads tasks
// and calendar (and a band in recording); the rest is orange. Wherever pink is a large light area, the text/icons sit over the
// depth region or orange. Two accents, one per orb: lime or gold (GOLD_ORBS).
export const LARANJA = {
  main: '#EB684A', // selector swatch
  red: '#E50706',
  orange: '#EB684A',
  pink: '#FFD0C5',
  depth: '#340945',
  lime: '#C8EC5E',
  gold: '#DCAD5B',
}
const { red: R, orange: O, pink: P } = LARANJA
const LARANJA_COLORS = {
  mic: [P, O, P, P, O, P, P, O], // pink (the lime glow sits on it) + orange
  tasks: [R, O, R, O, R, R, O, O], // red + orange · gold
  weather: [P, O, P, O, P, O], // pink sides, orange behind the cloud and under the text · gold
  recording: [O, O, O, O, O, O, R, R, O, O], // orange with a red band · gold
  calendar: [R, O, R, O], // red + orange · gold
  battery: [P, P, P, P, P, P, P, P], // pink (the lime glow sits on it)
  clock: [O, O, R, O, O, O, O, O, O], // orange with a touch of red · gold
  tasksFull: [R, O, R, R, O, O, O],
  weatherFull: [P, O, P, O, P, O, O],
  batteryFull: [P, O, O, O, O, O, O, O], // orange (the ring), with a soft pink sheen along the diagonal
  calendarFull: [R, O, R, O, R],
  clockFull: [O, O, R, O, O, O, O, O, O],
  digital: [O, O, P, O, O, R, R, O, O], // orange, a red band behind the time, a little pink low-left
}

const theme = (id, label, main, extra) => ({
  id,
  label,
  swatch: main,
  fg: '#ffffff',
  okBg: main, // OK button: the theme's main color, dark check (black has good contrast on all four)
  okFg: '#000000',
  grain: true,
  charBg: main, // rest-screen character circle background (the Figma flat color; equals the theme's main color)
  ...extra,
})

export const THEMES = {
  roxo: theme('roxo', 'Roxo', ROXO.main, { fgContrast: ROXO.depth, depth: ROXO.depth, sun: ROXO.sun, orbs: fromTemplates(ROXO.ramp) }),
  azul: theme('azul', 'Azul', AZUL.main, { fgContrast: AZUL.depth, depth: AZUL.depth, depth2: AZUL.depth2, sun: AZUL.sun, orbs: fromTemplates(AZUL.ramp) }),
  verde: theme('verde', 'Verde', VERDE.main, { fgContrast: VERDE.depth, depth: VERDE.depth, sun: VERDE.sun, orbs: fromTemplates(VERDE.ramp) }),
  laranja: theme('laranja', 'Laranja', LARANJA.main, { fgContrast: LARANJA.depth, depth: LARANJA.depth, sun: LARANJA.lime, sunAlt: LARANJA.gold, orbs: LARANJA_COLORS }),
}

// Order shown in the selectors (and on the Cores screen).
export const THEME_ORDER = ['roxo', 'azul', 'verde', 'laranja']
export const DEFAULT_THEME = 'roxo'
