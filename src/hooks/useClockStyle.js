import { useState, useCallback } from 'react'

const KEY = 'hardware.clockStyle'

function read() {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'b' ? 'b' : 'a'
  } catch {
    return 'a'
  }
}

// Clock widget style ('a' analog | 'b' digital), persisted in localStorage. Defaults to 'a'.
export function useClockStyle() {
  const [style, setStyle] = useState(read)
  const update = useCallback((next) => {
    setStyle(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable: keep the choice in memory only */
    }
  }, [])
  return [style, update]
}
