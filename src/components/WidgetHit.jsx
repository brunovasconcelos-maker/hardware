import { useRef } from 'react'

const CLICK_SLOP = 6 // px: a press that moved this far or more is a drag, not a click

// Makes a compact widget clickable. Only a press that stays within CLICK_SLOP counts as a click.
export default function WidgetHit({ label, onActivate, className = 'widget-hit', children }) {
  const start = useRef(null)
  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY }
      }}
      onClick={(e) => {
        const s = start.current
        start.current = null
        if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) >= CLICK_SLOP) return
        onActivate(e.currentTarget)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate(e.currentTarget)
        }
      }}
    >
      {children}
    </div>
  )
}
