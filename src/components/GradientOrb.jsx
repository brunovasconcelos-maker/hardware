import './GradientOrb.css'

const stopsToCss = (stops) =>
  stops.map(([color, at]) => (at === undefined ? color : `${color} ${at}`)).join(', ')

// layer: { type: 'radial', at: '20% 30%', size: '70%', stops: [[color, pos], ...] }
//     or { type: 'linear', angle: '180deg', stops: [[color, pos], ...] }
export function buildLayer(layer) {
  if (layer.type === 'linear') {
    return `linear-gradient(${layer.angle ?? '180deg'}, ${stopsToCss(layer.stops)})`
  }
  // size is a single percentage of the orb, applied to both radii (percentages are only valid on ellipses)
  const size = layer.size ? `${layer.size} ${layer.size} ` : ''
  return `radial-gradient(ellipse ${size}at ${layer.at ?? '50% 50%'}, ${stopsToCss(layer.stops)})`
}

// Circular gradient surface: a base color and stacked CSS gradient layers (first = top). Each layer is its own
// element that drifts with transform-only keyframes inside the clipped circle. `duration` (s) and `phase` (0–1)
// desynchronize orbs.
const DRIFT_VARIANTS = ['a', 'b', 'c']
export default function GradientOrb({
  size = 180,
  base,
  layers = [],
  duration = 16,
  phase = 0,
  className = '',
  style,
  children,
}) {
  return (
    <div
      className={`gradient-orb ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: base,
        '--orb-duration': `${duration}s`,
        '--orb-delay': `${-duration * phase}s`,
        ...style,
      }}
    >
      {/* first layer = top, so paint the array in reverse DOM order */}
      {layers.map((layer, i) => ({ layer, i })).reverse().map(({ layer, i }) => (
        <div
          key={i}
          className={`gradient-orb__layer gradient-orb__layer--${layer.type === 'linear' ? 'cover' : 'blob'}-${DRIFT_VARIANTS[i % 3]}`}
          style={{ background: buildLayer(layer), animationDirection: i % 2 ? 'reverse' : 'normal' }}
        />
      ))}
      <div className="gradient-orb__content">{children}</div>
    </div>
  )
}
