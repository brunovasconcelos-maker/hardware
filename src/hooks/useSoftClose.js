import { useRef } from 'react'
import { run, dur } from '../motion.js'

const MS = 300

// The Menu's soft exit for a screen that opens with the `menu-screen` fade/scale-in: the returned `close(fn)` plays the
// reverse (fade out + scale to 0.94, ~300ms) on `ref`, then calls `fn` (usually a navigation).
export function useSoftClose() {
  const ref = useRef(null)
  const closing = useRef(false)
  const close = async (then) => {
    if (closing.current || !ref.current) return
    closing.current = true
    const { done } = run(ref.current, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }], { duration: dur(MS), easing: 'ease-in', fill: 'forwards' })
    await done
    then?.()
  }
  return [ref, close]
}
