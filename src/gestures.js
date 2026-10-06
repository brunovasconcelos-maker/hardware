// Shared drag-gesture thresholds and helpers (widget viewer, Homepage drag-up, drag scrolling).
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

// Direction a drag locks to once it has moved LOCK_PX: 'h' | 'v', or null while it is still too short.
export function lockDirection(dx, dy) {
  if (Math.hypot(dx, dy) < LOCK_PX) return null
  return Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
}

// Whether an upward drag of `y` px (<= 0) released with vertical velocity `v` (px/ms) closes the screen.
export const closesOnRelease = (y, v) => y < -CLOSE_DY || (v < -FLICK_V && y < -FLICK_MIN)
