import './ThinkingShapes.css'

export const THINKING_FRAMES = [
  [26, 52, 52], // Figma 140:1998 — dot, tall, tall
  [52, 26, 52], // Figma 140:2003 — tall, dot, tall
  [52, 52, 26], // Figma 140:2008 — tall, tall, dot
]

// Three white pills (26px wide) centered in the display. Each is its own element whose height (26–52px) comes from
// `heights`, so it can be animated between the 3 Figma frames. `frame` (1–3) picks one of the frames.
export default function ThinkingShapes({ frame = 1, heights }) {
  const h = heights ?? THINKING_FRAMES[frame - 1]
  return (
    <div className="thinking-shapes" aria-hidden="true">
      {h.map((height, i) => (
        <span key={i} className="thinking-shape" style={{ '--h': height }} />
      ))}
    </div>
  )
}
