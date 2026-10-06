import { useEffect } from 'react'
import { LOCK_PX, velocity } from '../gestures.js'

const FRICTION = 0.0035 // per ms: velocity decays as exp(-FRICTION * t)
const STOP_V = 0.02 // px/ms

// Click-and-drag (mouse, pen or touch) vertical scrolling with momentum for an overflow container. The wheel keeps its
// native behavior. The container must have touch-action: none so the browser never competes for touch drags.
export function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let drag = null
    let raf = 0
    const stop = () => cancelAnimationFrame(raf)

    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stop()
      drag = { id: e.pointerId, y0: e.clientY, top0: el.scrollTop, locked: false, samples: [{ t: e.timeStamp, y: e.clientY }] }
    }
    const move = (e) => {
      if (!drag || drag.id !== e.pointerId) return
      const dy = e.clientY - drag.y0
      drag.samples.push({ t: e.timeStamp, y: e.clientY })
      if (!drag.locked && Math.abs(dy) >= LOCK_PX) {
        drag.locked = true
        el.setPointerCapture(e.pointerId)
      }
      if (drag.locked) el.scrollTop = drag.top0 - dy
    }
    const up = (e) => {
      if (!drag || drag.id !== e.pointerId) return
      const d = drag
      drag = null
      if (!d.locked) return
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
      let v = -velocity(d.samples, 'y') // px/ms, scrollTop direction
      if (e.type === 'pointercancel' || e.timeStamp - d.samples[d.samples.length - 1].t > 100) v = 0 // held still before release
      let last = performance.now()
      const tick = (now) => {
        const dt = now - last
        last = now
        const before = el.scrollTop
        el.scrollTop = before + v * dt
        v *= Math.exp(-FRICTION * dt)
        if (Math.abs(v) > STOP_V && el.scrollTop !== before) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const wheel = () => stop()

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: true })
    return () => {
      stop()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [ref])
}
