import { useId } from 'react'
import { useGrain } from '../theme/theme.js'
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
// desynchronize orbs. A static grain overlay shows when the theme's `grain` token is on. `glows` ([{ at, size, color, hold? }], first = top; `hold` keeps the color solid up to that % of the radius) are extra soft glows on top of all layers (theme accent, and Verde's depth/sun).
const DRIFT_VARIANTS = ['a', 'b', 'c']
export default function GradientOrb({
  size = 180,
  base,
  layers = [],
  glows = [],
  duration = 16,
  phase = 0,
  className = '',
  style,
  children,
}) {
  const filterId = `grain-${useId().replace(/:/g, '')}`
  const grain = useGrain() // theme token: only themes with grain: true show it
  const blur = blurFor(size)
  const bx = 1 + 2 * ((2.5 * blur) / size) // oversized box, in orbs
  const drawn = layers.map((layer, i) => ({ layer, i }))
  // bottom-most glow first, so the first glow ends up on top; the last glow (the accent) is numbered right after the layers
  for (let k = glows.length - 1; k >= 0; k--) {
    const g = glows[k]
    drawn.unshift({ layer: { type: 'radial', at: g.at, size: g.size, stops: g.hold ? [[g.color, '0%'], [g.color, `${g.hold}%`], ['transparent', '100%']] : [[g.color, '0%'], ['transparent', '100%']] }, i: layers.length + glows.length - 1 - k })
  }
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
      {grain && (
        // static (not part of the drifting/blurred layers), on top of the gradient
        <svg className="gradient-orb__noise" aria-hidden="true">
          <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.5" intercept="-0.25" />
              <feFuncG type="linear" slope="1.5" intercept="-0.25" />
              <feFuncB type="linear" slope="1.5" intercept="-0.25" />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
      )}
      <div className="gradient-orb__content">{children}</div>
    </div>
  )
}
