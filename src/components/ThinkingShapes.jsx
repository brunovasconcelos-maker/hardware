import { forwardRef, useImperativeHandle, useRef } from 'react'
import './ThinkingShapes.css'

export const THINKING_FRAMES = [
  [26, 52, 52], // Figma 140:1998 — dot, tall, tall
  [52, 26, 52], // Figma 140:2003 — tall, dot, tall
  [52, 52, 26], // Figma 140:2008 — tall, tall, dot
]

// Three white pills (26px wide) centered in the display. Each is its own element whose height (26–52px) comes from
// `heights`, so it can be animated between the 3 Figma frames. `frame` (1–3) picks one of the frames.
// The ref exposes `setHeights([h1, h2, h3])` for per-frame animation.
const ThinkingShapes = forwardRef(function ThinkingShapes({ frame = 1, heights }, ref) {
  const h = heights ?? THINKING_FRAMES[frame - 1]
  const shapes = useRef([])
  useImperativeHandle(ref, () => ({
    setHeights(values) {
      values.forEach((v, i) => shapes.current[i]?.style.setProperty('--h', String(v)))
    },
  }))
  return (
    <div className="thinking-shapes" aria-hidden="true">
      {h.map((height, i) => (
        <span key={i} ref={(el) => (shapes.current[i] = el)} className="thinking-shape" style={{ '--h': height }} />
      ))}
    </div>
  )
})

export default ThinkingShapes
