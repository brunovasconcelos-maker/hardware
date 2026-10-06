import { useState, useCallback } from 'react'
import { readItem, writeItem } from '../storage.js'

const KEY = 'hardware.usageMode'

const read = () => (readItem(KEY) === 'diario' ? 'diario' : 'semanal')

// Usage widget mode ('semanal' | 'diario'), persisted in localStorage. Defaults to 'semanal'.
export function useUsageMode() {
  const [mode, setMode] = useState(read)
  const update = useCallback((next) => {
    setMode(next)
    writeItem(KEY, next) // if storage is unavailable the choice stays in memory only
  }, [])
  return [mode, update]
}

// Compact-widget data per mode (same widget design, only the data changes).
export const USAGE_DATA = {
  semanal: { percent: 13, label: 'Semanal' },
  diario: { percent: 90, label: 'Diário' },
}
