// Motion helpers: durations collapse to 0 when the user prefers reduced motion.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const dur = (ms) => (prefersReducedMotion() ? 0 : ms)

export const OPEN_MS = 450
export const SNAP_MS = 260

// Runs a Web Animation and resolves when it finishes (or is cancelled).
export function run(el, keyframes, options) {
  const anim = el.animate(keyframes, options)
  const done = anim.finished.then(() => anim, () => anim)
  return { anim, done }
}
