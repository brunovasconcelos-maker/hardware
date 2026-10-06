import { SPOKES, FIGMA_LENGTHS } from './voiceSpokes.js'
import './VoiceLines.css'

export const MIN_LENGTH = 0.01 // with a 4px round-cap stroke this renders as a dot

// Radial lines around the recording orb (650x650 coordinates, center 325,325).
// Each line is its own <line>; its length comes from `lengths[i]` (px, same order as SPOKES) or the CSS variable
// --len on the element, so code (or a CSS transition on --len) can animate each one independently.
// `idle` collapses every line to a dot.
export default function VoiceLines({ lengths = FIGMA_LENGTHS, idle = false }) {
  return (
    <svg className="voice-lines" width="650" height="650" viewBox="0 0 650 650" aria-hidden="true">
      <g transform="translate(325 325)">
        {SPOKES.map((s, i) => (
          <g key={i} transform={`rotate(${s.angle}) translate(0 ${-s.inner})`}>
            <line className="voice-line" x1="0" y1="0" x2="0" y2="-1" style={{ '--len': idle ? MIN_LENGTH : Math.max(MIN_LENGTH, lengths[i] ?? FIGMA_LENGTHS[i]) }} />
          </g>
        ))}
      </g>
    </svg>
  )
}
