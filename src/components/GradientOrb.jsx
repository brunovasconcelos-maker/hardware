import { memo, useId } from 'react'
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
const EMPTY = []
const blurFor = (size) => Math.min(60, Math.max(40, size * 0.085))

// Circular gradient surface: a base color and stacked CSS gradient layers (first = top). Nothing in it animates: each layer is
// its own element at a fixed resting scale inside the clipped circle. A static grain overlay shows when the theme's `grain` token is on. `glows` ([{ at, size, color, hold? }], first = top; `hold` keeps the color solid up to that % of the radius) are extra soft glows on top of all layers (theme accent, and Verde's depth/sun).
// Resting scale of each layer (blob = radial glow, cover = opaque linear layer), cycling over three variants so neighboring
// layers are not identical. This is the neutral pose the former drift animation started its loop from.
const REST_SCALE = { blob: [1.05, 1.3, 1.4], cover: [1.25, 1.4, 1.3] }

// The blurred, static layers. Memoized: a parent that re-renders every second (the clock widgets) must not rebuild the
// gradient strings of every layer. `layers` / `glows` come from the cached orbProps(), so they are referentially stable.
const OrbLayers = memo(function OrbLayers({ layers, glows, bx }) {
  const drawn = layers.map((layer, i) => ({ layer, i }))
  // bottom-most glow first, so the first glow ends up on top; the last glow (the accent) is numbered right after the layers
  for (let k = glows.length - 1; k >= 0; k--) {
    const g = glows[k]
    drawn.unshift({ layer: { type: 'radial', at: g.at, size: g.size, stops: g.hold ? [[g.color, '0%'], [g.color, `${g.hold}%`], ['transparent', '100%']] : [[g.color, '0%'], ['transparent', '100%']] }, i: layers.length + glows.length - 1 - k })
  }
  return (
    <div className="gradient-orb__glow" style={{ inset: `${-((bx - 1) / 2) * 100}%` }}>
      {/* first layer = top, so paint the array in reverse DOM order */}
      {[...drawn].reverse().map(({ layer, i }) => (
        <div
          key={i}
          className="gradient-orb__layer"
          style={{ background: buildLayer(layer, bx), transform: `scale(${REST_SCALE[layer.type === 'linear' ? 'cover' : 'blob'][i % 3]})` }}
        />
      ))}
    </div>
  )
})

// Static grain: not part of the blurred layers, on top of the gradient; always mounted, its opacity follows the
// theme's --grain token.
const Grain = memo(function Grain({ filterId }) {
  return (
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
  )
})

export default function GradientOrb({
  orb,
  size = 180,
  base,
  layers = EMPTY,
  glows = EMPTY,
  className = '',
  style,
  children,
}) {
  const filterId = `grain-${useId().replace(/:/g, '')}`
  const blur = blurFor(size)
  const bx = 1 + 2 * ((2.5 * blur) / size) // oversized box, in orbs
  return (
    <div
      data-orb={orb}
      className={`gradient-orb ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: base,
        '--blur': `${(blur / size) * 100}cqw`,
        '--blur-px': `${blur}px`,
        ...style,
      }}
    >
      <OrbLayers layers={layers} glows={glows} bx={bx} />
      <Grain filterId={filterId} />
      <div className="gradient-orb__content">{children}</div>
    </div>
  )
}
