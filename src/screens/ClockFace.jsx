import { useNow } from '../hooks/useNow.js'

// Analog clock face from Figma "Hora" (107:1427), 650x650 coordinates, drawn in SVG + HTML numerals.
// Hands show the real time. Each hand is a segment from radius r0 to r1 around the center ring.
const CX = 325.17
const CY = 325
const DOT_ANGLES = [30, 60, 120, 150, 210, 240, 300, 330]
const DOT_RADIUS = 189.4
const CY0 = 325.35 // center ring

const NUMERALS = [
  { text: '12', left: 313.45, top: 114 },
  { text: '9', left: 125, top: 303.35 },
  { text: '3', left: 503.71, top: 303.35 },
  { text: '6', left: 313.45, top: 492.71 },
]

function Hand({ angle, r0, r1, opacity = 1 }) {
  return (
    <line
      x1={CX}
      y1={CY0 - r0}
      x2={CX}
      y2={CY0 - r1}
      strokeOpacity={opacity}
      transform={`rotate(${angle} ${CX} ${CY0})`}
    />
  )
}

export default function ClockFace() {
  const now = useNow()
  const h = now.getHours() % 12
  const m = now.getMinutes()
  const sec = now.getSeconds()
  return (
    <>
      <svg className="clock-face" width="650" height="650" viewBox="0 0 650 650" aria-hidden="true">
        {DOT_ANGLES.map((a) => {
          const r = (a * Math.PI) / 180
          return <circle key={a} cx={CX + DOT_RADIUS * Math.sin(r)} cy={CY - DOT_RADIUS * Math.cos(r)} r="6.312" fill="#fff" />
        })}
        <g stroke="#fff" strokeWidth="5.41" strokeLinecap="round" fill="none">
          <Hand angle={(h + m / 60) * 30} r0={12} r1={95} />
          <Hand angle={(m + sec / 60) * 6} r0={11.18} r1={151.84} />
          <Hand angle={sec * 6} r0={11.5} r1={142.9} opacity={0.3} />
          <circle cx={CX} cy={CY0} r="10.82" />
        </g>
      </svg>
      {NUMERALS.map((n) => (
        <span key={n.text} className="clock-face__numeral" style={{ left: n.left, top: n.top }}>{n.text}</span>
      ))}
    </>
  )
}
