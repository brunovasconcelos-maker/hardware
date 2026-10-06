import './GradientOrb.css'

const stopsToCss = (stops) =>
  stops.map(([color, at]) => (at === undefined ? color : `${color} ${at}`)).join(', ')

// layer: { type: 'radial', at: '20% 30%', size: '70%', stops: [[color, pos], ...] }
//     or { type: 'linear', angle: '180deg', stops: [[color, pos], ...] }
// Layers are authored in orb coordinates, but painted on a box `bx` times larger (the bleed, see below), so positions
// and sizes are remapped: the picture inside the circle stays exactly the authored composition.
const pct = (v) => parseFloat(v)
export function buildLayer(layer, bx = 1) {
  const bleed = (bx - 1) / 2 // per side, as a fraction of the orb
  if (layer.type === 'linear') {
    const stops = layer.stops.map(([c, at]) => [c, at === undefined ? at : `${50 + (pct(at) - 50) / bx}%`])
    return `linear-gradient(${layer.angle ?? '180deg'}, ${stopsToCss(stops)})`
  }
  // size is a single percentage of the orb, applied to both radii (percentages are only valid on ellipses)
  const size = layer.size ? `${pct(layer.size) / bx}% ${pct(layer.size) / bx}% ` : ''
  const [x, y] = (layer.at ?? '50% 50%').split(/\s+/).map((v) => `${(pct(v) + bleed * 100) / bx}%`)
  return `radial-gradient(ellipse ${size}at ${x} ${y}, ${stopsToCss(layer.stops)})`
}

// Softness: all layers sit in one wrapper that is blurred (BLUR_PX nominal, scaled with the orb through container
// units, so an orb that shrinks keeps the same proportions). The wrapper is oversized by BLEED_K blur radii on every
// side; the circle's overflow:hidden clips it, so the blur never fades or darkens the edge of the circle.
const blurFor = (size) => Math.min(60, Math.max(40, size * 0.085))

// Circular gradient surface: a base color and stacked CSS gradient layers (first = top). Each layer is its own
// element that drifts with transform-only keyframes inside the clipped circle. `duration` (s) and `phase` (0–1)
// desynchronize orbs. `accent` ({ at, size, color }) is an extra soft glow on top of all layers.
const DRIFT_VARIANTS = ['a', 'b', 'c']
export default function GradientOrb({
  size = 180,
  base,
  layers = [],
  accent,
  duration = 16,
  phase = 0,
  className = '',
  style,
  children,
}) {
  const blur = blurFor(size)
  const bx = 1 + 2 * ((2.5 * blur) / size) // oversized box, in orbs
  const drawn = layers.map((layer, i) => ({ layer, i }))
  if (accent) drawn.unshift({ layer: { type: 'radial', at: accent.at, size: accent.size, stops: [[accent.color, '0%'], ['transparent', '100%']] }, i: layers.length })
  return (
    <div
      className={`gradient-orb ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: base,
        '--orb-duration': `${duration}s`,
        '--orb-delay': `${-duration * phase}s`,
        '--bx': bx,
        '--blur': `${(blur / size) * 100}cqw`,
        '--blur-px': `${blur}px`,
        ...style,
      }}
    >
      <div className="gradient-orb__glow" style={{ inset: `${-((bx - 1) / 2) * 100}%` }}>
        {/* first layer = top, so paint the array in reverse DOM order */}
        {[...drawn].reverse().map(({ layer, i }) => (
          <div
            key={i}
            className={`gradient-orb__layer gradient-orb__layer--${layer.type === 'linear' ? 'cover' : 'blob'}-${DRIFT_VARIANTS[i % 3]}`}
            style={{ background: buildLayer(layer, bx), animationDirection: i % 2 ? 'reverse' : 'normal' }}
          />
        ))}
      </div>
      <div className="gradient-orb__content">{children}</div>
    </div>
  )
}
