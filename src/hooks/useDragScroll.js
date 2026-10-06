import { useEffect } from 'react'
import { lockDirection, velocity } from '../gestures.js'

const FRICTION = 0.0035 // per ms: free velocity decays as exp(-FRICTION * t)
const STOP_V = 0.02 // px/ms
const RUBBER = 150 // px: the most a drag can pull past an edge (asymptotic)
const SPRING_K = 0.0006 // /ms²: pull back toward the edge (critically damped with SPRING_C = 2 * sqrt(K))
const SPRING_C = 0.049 // /ms

// Soft resistance past an edge: follows the finger at first, then stiffens up to RUBBER.
const rubber = (o) => Math.sign(o) * RUBBER * (1 - 1 / (Math.abs(o) / RUBBER + 1))

// Click-and-drag (mouse, pen or touch) vertical scrolling for an overflow container, moving 1:1 with the pointer, with
// inertia on release (velocity decaying smoothly in requestAnimationFrame) and a soft rubber-band at the top and bottom
// edges (the first child is translated by the overshoot and springs back). The wheel is NOT intercepted: it scrolls natively
// (a wheel scroll during inertia simply takes over). The container must have touch-action: none so the browser never
// competes for touch drags.
export function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const content = el.firstElementChild
    let drag = null
    let raf = 0
    const max = () => Math.max(0, el.scrollHeight - el.clientHeight)
    const stop = () => cancelAnimationFrame(raf)

    // pos is the unclamped scroll position: the part beyond [0, max] is shown as a rubber-band translation of the content.
    const apply = (pos) => {
      const m = max()
      const clamped = Math.min(m, Math.max(0, pos))
      el.scrollTop = clamped
      const over = pos - clamped
      if (content) content.style.transform = over ? `translate3d(0, ${-rubber(over)}px, 0)` : ''
      return clamped
    }

    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stop()
      drag = { id: e.pointerId, y0: e.clientY, top0: el.scrollTop, locked: false, samples: [{ t: e.timeStamp, y: e.clientY }] }
    }
    const move = (e) => {
      if (!drag || drag.id !== e.pointerId) return
      const dy = e.clientY - drag.y0
      drag.samples.push({ t: e.timeStamp, y: e.clientY })
      if (!drag.locked && lockDirection(0, dy)) {
        drag.locked = true
        el.setPointerCapture(e.pointerId)
      }
      if (drag.locked) {
        drag.pos = drag.top0 - dy
        apply(drag.pos)
      }
    }
    const up = (e) => {
      if (!drag || drag.id !== e.pointerId) return
      const d = drag
      drag = null
      if (!d.locked) return
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
      const held = e.timeStamp - d.samples[d.samples.length - 1].t > 100 // held still before release: no inertia
      let v = e.type === 'pointercancel' || held ? 0 : -velocity(d.samples, 'y') // px/ms in scrollTop direction
      let pos = d.pos ?? el.scrollTop
      let last = performance.now()
      let lastApplied = pos
      const tick = (now) => {
        const dt = Math.min(now - last, 50)
        last = now
        const m = max()
        // someone else scrolled (the wheel, a keyboard): take over
        if (Math.abs(el.scrollTop - Math.min(m, Math.max(0, lastApplied))) > 1) return
        // integrate in small steps (<= 8ms) so a slow frame can't make the spring unstable
        const steps = Math.max(1, Math.ceil(dt / 8))
        const h = dt / steps
        for (let i = 0; i < steps; i++) {
          if (pos < 0 || pos > m) {
            const edge = pos < 0 ? 0 : m
            v += (-SPRING_K * (pos - edge) - SPRING_C * v) * h // spring back to the edge
          } else {
            v *= Math.exp(-FRICTION * h) // free inertia
          }
          pos += v * h
        }
        lastApplied = pos
        apply(pos)
        const settled = Math.abs(v) < STOP_V && (pos >= 0 && pos <= m ? true : Math.abs(pos - (pos < 0 ? 0 : m)) < 0.3)
        if (settled) {
          apply(Math.min(m, Math.max(0, pos)))
          return
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      stop()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [ref])
}
