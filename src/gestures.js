// Shared drag-gesture thresholds and helpers (widget viewer, Homepage drag-up).
export const LOCK_PX = 6 // movement needed to lock the drag direction
export const CLOSE_DY = 120 // upward drag distance that closes
export const FLICK_V = 0.5 // px/ms
export const FLICK_MIN = 20 // minimum travel for a flick

// Velocity (px/ms) over the last ~100ms of pointer samples ({ t, x, y }).
export function velocity(samples, axis) {
  const last = samples[samples.length - 1]
  const first = samples.find((s) => last.t - s.t <= 100) ?? samples[0]
  const dt = last.t - first.t
  return dt > 0 ? (last[axis] - first[axis]) / dt : 0
}
