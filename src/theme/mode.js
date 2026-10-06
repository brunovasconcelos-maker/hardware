import { useSyncExternalStore } from 'react'
import { readItem, writeItem } from '../storage.js'

// Light / dark mode, independent from the color theme. Mode is a set of surface tokens (CSS custom properties on <html>):
//   --surface              the display background (and every layer that blends into it: fades, gaps between circles)
//   --on-surface           text and icons that sit directly on the display background
//   --on-surface-muted     the 50% grey of the same (Homepage/Result icons, divider, voice lines)
//   --surface-raised       raised dark-grey surfaces on the display (Menu inner circle and X segment)
//   --surface-sunken       the hairlines on those surfaces
// Gradients and everything on top of them keep using the theme tokens (--fg ...). Components only reference these variables, so
// every current and future screen supports both modes. The tokens are registered as <color> so a mode change crossfades.
const KEY = 'hardware.mode'
export const FADE_MS = 400
export const DEFAULT_MODE = 'dark'

export const MODES = {
  dark: {
    '--surface': '#141515',
    '--on-surface': '#ffffff',
    '--on-surface-muted': 'rgba(255, 255, 255, 0.5)',
    '--surface-raised': '#252525',
    '--surface-sunken': '#0a0a0a',
  },
  // Light equivalents keep the dark mode's relative contrast with the background (#141515 -> #252525 is a 1.18:1 step,
  // #252525 -> #0a0a0a is 1.28:1): #F4F5F5 -> #E2E2E2 (1.18:1) and #E2E2E2 -> #C8C8C8 (1.29:1).
  light: {
    '--surface': '#F4F5F5',
    '--on-surface': '#000000',
    '--on-surface-muted': 'rgba(0, 0, 0, 0.5)',
    '--surface-raised': '#E2E2E2',
    '--surface-sunken': '#C8C8C8',
  },
}
export const MODE_VARS = Object.keys(MODES.dark)

let current = DEFAULT_MODE
const listeners = new Set()

function readStored() {
  const v = readItem(KEY)
  return v && MODES[v] ? v : DEFAULT_MODE
}

export function registerModeVars() {
  if (typeof CSS === 'undefined' || !CSS.registerProperty) return false
  for (const name of MODE_VARS) {
    try {
      CSS.registerProperty({ name, syntax: '<color>', inherits: true, initialValue: '#000000' })
    } catch {
      /* already registered (hot reload) */
    }
  }
  return true
}

export function applyMode(id) {
  const root = document.documentElement
  for (const [name, value] of Object.entries(MODES[id])) root.style.setProperty(name, value)
  root.dataset.mode = id
}

// Call once before the first render (after registerModeVars): applies the stored mode without a fade.
export function initMode() {
  current = readStored()
  applyMode(current)
}

export function setMode(id) {
  if (!MODES[id] || id === current) return
  current = id
  applyMode(id)
  if (!writeItem(KEY, id)) console.warn('[modo] Não foi possível salvar o modo no localStorage; a escolha vale só até recarregar a página.')
  listeners.forEach((l) => l())
}

export function useMode() {
  const id = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
  return [id, setMode]
}
