import { useState, useCallback } from 'react'
import { readItem, writeItem } from '../storage.js'

const KEY = 'hardware.clockStyle'

const read = () => (readItem(KEY) === 'b' ? 'b' : 'a')

// Clock widget style ('a' analog | 'b' digital), persisted in localStorage. Defaults to 'a'.
export function useClockStyle() {
  const [style, setStyle] = useState(read)
  const update = useCallback((next) => {
    setStyle(next)
    writeItem(KEY, next) // if storage is unavailable the choice stays in memory only
  }, [])
  return [style, update]
}
