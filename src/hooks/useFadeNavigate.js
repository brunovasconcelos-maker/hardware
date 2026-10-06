import { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { run, dur, FADE_MS } from '../motion.js'

// Soft fade-out of the current screen (ref'd element), then route change. The next screen fades in on mount (CSS).
export function useFadeNavigate() {
  const ref = useRef(null)
  const navigate = useNavigate()
  const busy = useRef(false)
  const go = useCallback(
    async (to) => {
      if (busy.current) return
      busy.current = true
      if (ref.current) {
        const { done } = run(ref.current, [{ opacity: 1 }, { opacity: 0 }], { duration: dur(FADE_MS), easing: 'ease-in-out', fill: 'forwards' })
        await done
      }
      navigate(to)
    },
    [navigate],
  )
  return [ref, go]
}
