import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { flushSync } from 'react-dom'
import PageDots from './PageDots.jsx'
import { run, dur, SNAP_MS } from '../motion.js'
import { FLICK_V, FLICK_MIN, lockDirection, closesOnRelease, velocity } from '../gestures.js'
import './WidgetViewer.css'

const W = 650
const SWIPE_FRACTION = 0.25 // horizontal drag (share of width) that changes page

// Full-screen widget viewer: renders pages in a horizontal track.
//  - drag horizontally: pages follow the pointer; release changes page (>25% width or fast flick)
//  - drag up (only if `onClose` is given): the viewer follows the pointer; release closes (>120px or fast flick)
// The drag direction is locked from the first movement, so vertical and horizontal gestures never conflict.
// `pageCount` may be Infinity (e.g. calendar months); `renderPage(i)` is called for any index in range.
export default function WidgetViewer({ pageCount = 1, initialIndex = 0, renderPage, onClose, disabled = false, onIndexChange }) {
  const [index, setIndex] = useState(initialIndex)
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const indexRef = useRef(initialIndex)
  const drag = useRef(null)
  const busy = useRef(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // Finite carousels span pages 0..count-1; an infinite one (calendar months) has no limit in either direction.
  const min = Number.isFinite(pageCount) ? 0 : -Infinity
  const max = pageCount - 1
  const inRange = (i) => i >= min && i <= max
  const visible = [index - 1, index, index + 1].filter(inRange)

  // Marks the pages that are not on screen (data-offscreen) for the theme color morph, which skips them. The neighbors count as
  // on screen from the moment a pointer goes down (a swipe can reveal them from the first pixel) until the viewer settles.
  // Done on the DOM (not through React) because pointer events change it between renders.
  const syncOffscreen = (revealNeighbors = false) => {
    for (const el of trackRef.current?.children ?? []) {
      const page = Number(el.dataset.page)
      if (page === indexRef.current || revealNeighbors) el.removeAttribute('data-offscreen')
      else el.setAttribute('data-offscreen', '')
    }
  }
  useLayoutEffect(() => syncOffscreen(), [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const rubber = (dx) => {
    const target = indexRef.current - Math.sign(dx)
    return inRange(target) ? dx : dx * 0.35
  }

  async function snapBack(el, from) {
    busy.current = true
    const { anim, done } = run(el, [{ transform: from }, { transform: 'translate3d(0,0,0)' }], { duration: dur(SNAP_MS), easing: 'ease-out' })
    await done
    anim.cancel()
    el.style.transform = ''
    busy.current = false
    syncOffscreen()
  }

  async function changePage(dir, fromX) {
    busy.current = true
    const track = trackRef.current
    const { anim, done } = run(
      track,
      [{ transform: `translate3d(${fromX}px,0,0)` }, { transform: `translate3d(${-dir * W}px,0,0)` }],
      { duration: dur(SNAP_MS), easing: 'ease-out', fill: 'forwards' },
    )
    await done
    if (!mounted.current) return
    const next = indexRef.current + dir
    indexRef.current = next
    flushSync(() => setIndex(next))
    track.style.transform = ''
    anim.cancel()
    busy.current = false
    onIndexChange?.(next)
  }

  function onPointerDown(e) {
    if (disabled || busy.current || drag.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (e.target.closest?.('[data-no-drag]')) return // buttons inside a page get their own clicks (no capture, no drag)
    e.preventDefault()
    syncOffscreen(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lock: null, dx: 0, dy: 0, samples: [{ t: e.timeStamp, x: e.clientX, y: e.clientY }] }
  }

  function onPointerMove(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    d.dx = e.clientX - d.x0
    d.dy = e.clientY - d.y0
    d.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY })
    if (!d.lock) d.lock = lockDirection(d.dx, d.dy)
    if (d.lock === 'h' && pageCount > 1) {
      trackRef.current.style.transform = `translate3d(${rubber(d.dx)}px,0,0)`
    } else if (d.lock === 'v' && onClose) {
      rootRef.current.style.transform = `translate3d(0,${Math.min(0, d.dy)}px,0)`
    }
  }

  function onPointerUp(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    if (e.type === 'pointercancel') d.lock = null
    if (!d.lock) syncOffscreen() // a tap or cancelled press: no snap-back will follow

    if (d.lock === 'h' && pageCount > 1) {
      const x = rubber(d.dx)
      const v = velocity(d.samples, 'x')
      const dir = d.dx < 0 ? 1 : -1 // next page when dragging left
      const commits = Math.abs(d.dx) > W * SWIPE_FRACTION || (Math.abs(v) > FLICK_V && Math.abs(d.dx) > FLICK_MIN && Math.sign(v) === Math.sign(d.dx))
      if (commits && inRange(indexRef.current + dir)) changePage(dir, x)
      else snapBack(trackRef.current, `translate3d(${x}px,0,0)`)
    } else if (d.lock === 'v' && onClose) {
      const y = Math.min(0, d.dy)
      const v = velocity(d.samples, 'y')
      if (closesOnRelease(y, v)) {
        busy.current = true
        rootRef.current.style.transform = ''
        onClose({ dy: y, index: indexRef.current })
      } else {
        snapBack(rootRef.current, `translate3d(0,${y}px,0)`)
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className="widget-viewer"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={trackRef} className="widget-viewer__track">
        {visible.map((i) => (
          <div key={i} data-page={i} className="widget-viewer__page" style={{ left: (i - index) * W }}>
            {renderPage(i)}
          </div>
        ))}
      </div>
      {pageCount > 1 && Number.isFinite(pageCount) && <PageDots active={index} count={pageCount} />}
    </div>
  )
}
