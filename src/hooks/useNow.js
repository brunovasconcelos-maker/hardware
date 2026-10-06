import { useSyncExternalStore } from 'react'

// Shared once-per-second clock. Returns the current time in ms, floored to the second.
const listeners = new Set()
let timer = null

const snapshot = () => Math.floor(Date.now() / 1000) * 1000

function subscribe(listener) {
  listeners.add(listener)
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 250)
  return () => {
    listeners.delete(listener)
    if (!listeners.size) {
      clearInterval(timer)
      timer = null
    }
  }
}

export function useNow() {
  return new Date(useSyncExternalStore(subscribe, snapshot))
}

export const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const pad2 = (n) => String(n).padStart(2, '0')
