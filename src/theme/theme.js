import { useSyncExternalStore } from 'react'
import { ORBS, COLORIDO_COLORS } from './orbs.js'
import { THEMES, DEFAULT_THEME, glowOf, DEPTH_GLOWS, EDGE_DEPTH_GLOWS, SUN_GLOWS } from './themes.js'
import { registerModeVars, initMode, MODE_VARS, FADE_MS as MODE_FADE_MS } from './mode.js'

// Theme runtime. Every theme color is a CSS custom property registered as a <color>, set on <html>:
//   --o-<orb>-<slot>   gradient colors of each orb (the orb compositions live in orbs.js)
//   --fg / --fg-contrast   foreground on gradients (text, icons, rings, hands, page dots) and its inverse
//   --ok-bg / --ok-fg      Result OK button and its check icon
//   --grain                1 when the theme uses the grain overlay, else 0 (the overlay is always mounted; its opacity follows this)
//   --accent               complementary glow added to every orb (transparent in Colorido)
//   --depth / --depth-edge / --sun   extra dark shadow (big / edge-only) and light glow layers on the orbs that define one (transparent unless a theme sets them: Verde)
// Components only reference these variables (never literal colors), so switching themes restyles every screen, and
// the registered properties let the browser crossfade between themes without touching the animated gradient layers.
const KEY = 'hardware.theme'
const FADE_MS = 600 // theme colors and grain morph (mode tokens keep their own 400ms, see mode.js)

const orbVar = (id, slot) => `--o-${id}-${slot}`
const TOKEN_VARS = ['--fg', '--fg-contrast', '--ok-bg', '--ok-fg', '--accent', '--depth', '--depth-edge', '--sun']
const GRAIN_VAR = '--grain'
const ALL_VARS = [...TOKEN_VARS, ...Object.entries(COLORIDO_COLORS).flatMap(([id, colors]) => colors.map((_, i) => orbVar(id, i)))]

// Props for <GradientOrb>: base color + layers, with every color as a theme variable.
const cache = {}
export function orbProps(id) {
  if (cache[id]) return cache[id]
  const color = (slot) => (slot === 'transparent' ? 'transparent' : `var(${orbVar(id, slot)})`)
  cache[id] = {
    base: color(0),
    layers: ORBS[id].layers.map((l) => ({ ...l, stops: l.stops.map(([c, pos]) => [color(c), pos]) })),
    // top first: depth, sun, accent (the accent keeps its position in the layer order)
    glows: [
      DEPTH_GLOWS[id] && { ...DEPTH_GLOWS[id], hold: 40, color: 'var(--depth)' },
      EDGE_DEPTH_GLOWS[id] && { ...EDGE_DEPTH_GLOWS[id], hold: 20, color: 'var(--depth-edge)' },
      SUN_GLOWS[id] && { ...SUN_GLOWS[id], hold: 30, color: 'var(--sun)' },
      { ...glowOf(id), color: 'var(--accent)' },
    ].filter(Boolean),
  }
  return cache[id]
}

let current = DEFAULT_THEME
const listeners = new Set()


function readStored() {
  try {
    const v = window.localStorage.getItem(KEY)
    return v && THEMES[v] ? v : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

function register() {
  if (typeof CSS === 'undefined' || !CSS.registerProperty) {
    console.warn('[tema] CSS.registerProperty indisponível: a troca de tema funciona, mas sem o crossfade de 400ms.')
    return false
  }
  for (const name of ALL_VARS) {
    try {
      CSS.registerProperty({ name, syntax: '<color>', inherits: true, initialValue: '#000000' })
    } catch {
      /* already registered (hot reload) */
    }
  }
  try {
    CSS.registerProperty({ name: GRAIN_VAR, syntax: '<number>', inherits: true, initialValue: 0 })
  } catch {
    /* already registered (hot reload) */
  }
  return true
}

export function applyTheme(id) {
  const t = THEMES[id]
  const root = document.documentElement
  root.style.setProperty('--fg', t.fg)
  root.style.setProperty('--fg-contrast', t.fgContrast)
  root.style.setProperty('--ok-bg', t.okBg)
  root.style.setProperty('--ok-fg', t.okFg)
  root.style.setProperty('--accent', t.accent)
  root.style.setProperty('--depth', t.depth ?? 'transparent')
  root.style.setProperty('--depth-edge', t.depthEdge ?? 'transparent')
  root.style.setProperty('--sun', t.sun ?? 'transparent')
  root.style.setProperty(GRAIN_VAR, t.grain ? '1' : '0')
  for (const [orb, colors] of Object.entries(t.orbs)) colors.forEach((c, i) => root.style.setProperty(orbVar(orb, i), c))
  root.dataset.theme = id
}

// Call once before the first render: registers the properties and applies the stored theme (no flash, no fade).
export function initTheme() {
  const registered = register() && registerModeVars()
  initMode()
  current = readStored()
  applyTheme(current)
  if (registered) {
    // Enable the crossfade only after the first paint, so the initial theme is not animated.
    setTimeout(() => {
      document.documentElement.style.transition = [...ALL_VARS, GRAIN_VAR].map((n) => `${n} ${FADE_MS}ms ease-in-out`).concat(MODE_VARS.map((n) => `${n} ${MODE_FADE_MS}ms ease-in-out`)).join(',')
    }, 0)
  }
}

export function setTheme(id) {
  if (!THEMES[id] || id === current) return
  current = id
  applyTheme(id)
  try {
    window.localStorage.setItem(KEY, id)
  } catch {
    console.warn('[tema] Não foi possível salvar o tema no localStorage; a escolha vale só até recarregar a página.')
  }
  listeners.forEach((l) => l())
}

export function useTheme() {
  const id = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
  return [id, setTheme]
}
