import { useState, useCallback } from 'react'

const KEY = 'hardware.usageMode'

function read() {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'diario' ? 'diario' : 'semanal'
  } catch {
    return 'semanal'
  }
}

// Usage widget mode ('semanal' | 'diario'), persisted in localStorage. Defaults to 'semanal'.
export function useUsageMode() {
  const [mode, setMode] = useState(read)
  const update = useCallback((next) => {
    setMode(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable: keep the choice in memory only */
    }
  }, [])
  return [mode, update]
}

// Compact-widget data per mode (same widget design, only the data changes).
export const USAGE_DATA = {
  semanal: { percent: 13, label: 'Semanal' },
  diario: { percent: 90, label: 'Diário' },
}
