import { useId } from 'react'
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

export function buildBackground(layers = [], base = 'transparent') {
  return [...layers.map(buildLayer), `linear-gradient(${base}, ${base})`].join(', ')
}

// Circular gradient surface: a base color, stacked CSS gradient layers (first = top) and an
// SVG feTurbulence grain overlay. Layers are plain props so they can be animated later.
export default function GradientOrb({
  size = 180,
  base,
  layers,
  noise = { opacity: 0.55, frequency: 0.9, blend: 'overlay' },
  className = '',
  style,
  children,
}) {
  const filterId = `grain-${useId().replace(/:/g, '')}`
  return (
    <div
      className={`gradient-orb ${className}`}
      style={{ width: size, height: size, background: buildBackground(layers, base), ...style }}
    >
      <svg className="gradient-orb__noise" aria-hidden="true" style={{ opacity: noise.opacity, mixBlendMode: noise.blend }}>
        <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={noise.frequency} numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.5" intercept="-0.25" />
            <feFuncG type="linear" slope="1.5" intercept="-0.25" />
            <feFuncB type="linear" slope="1.5" intercept="-0.25" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
      <div className="gradient-orb__content">{children}</div>
    </div>
  )
}
