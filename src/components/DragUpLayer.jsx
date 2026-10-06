import { useRef } from 'react'
import './DragUpLayer.css'
import { run, dur, SNAP_MS } from '../motion.js'
import { LOCK_PX, CLOSE_DY, FLICK_V, FLICK_MIN, velocity } from '../gestures.js'

const EXIT_MS = 300

// Full-size layer that can be dragged up to dismiss, with the same gesture as closing a widget:
// it follows the pointer, closes past ~120px or on a fast upward flick (sliding out, then `onClose`),
// otherwise snaps back. Direction locks on the first movement; the pointer is only captured once a vertical
// drag starts, so plain taps still reach the elements inside.
export default function DragUpLayer({ enabled = true, onClose, className = '', children }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const busy = useRef(false)

  function onPointerDown(e) {
    if (!enabled || busy.current || drag.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lock: null, dy: 0, samples: [{ t: e.timeStamp, x: e.clientX, y: e.clientY }] }
  }

  function onPointerMove(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x0
    d.dy = e.clientY - d.y0
    d.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY })
    if (!d.lock && Math.hypot(dx, d.dy) >= LOCK_PX) {
      d.lock = Math.abs(dx) > Math.abs(d.dy) ? 'h' : 'v'
      if (d.lock === 'v') ref.current.setPointerCapture(e.pointerId)
    }
    if (d.lock === 'v') ref.current.style.transform = `translate3d(0,${Math.min(0, d.dy)}px,0)`
  }

  async function onPointerUp(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (d.lock !== 'v' || e.type === 'pointercancel') {
      if (ref.current.style.transform) ref.current.style.transform = ''
      return
    }
    if (ref.current.hasPointerCapture?.(e.pointerId)) ref.current.releasePointerCapture(e.pointerId)
    const el = ref.current
    const y = Math.min(0, d.dy)
    const v = velocity(d.samples, 'y')
    busy.current = true
    if (y < -CLOSE_DY || (v < -FLICK_V && y < -FLICK_MIN)) {
      const { done } = run(el, [{ transform: `translate3d(0,${y}px,0)` }, { transform: 'translate3d(0,-700px,0)' }], { duration: dur(EXIT_MS), easing: 'ease-out', fill: 'forwards' })
      await done
      onClose?.()
    } else {
      const { anim, done } = run(el, [{ transform: `translate3d(0,${y}px,0)` }, { transform: 'translate3d(0,0,0)' }], { duration: dur(SNAP_MS), easing: 'ease-out' })
      await done
      anim.cancel()
      el.style.transform = ''
      busy.current = false
    }
  }

  return (
    <div
      ref={ref}
      className={`drag-up-layer ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </div>
  )
}
