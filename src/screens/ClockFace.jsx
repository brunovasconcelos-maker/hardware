// Analog clock face from Figma "Hora" (107:1427), 650x650 coordinates, drawn in SVG + HTML numerals.
const CX = 325.17
const CY = 325
const DOT_ANGLES = [30, 60, 120, 150, 210, 240, 300, 330]
const DOT_RADIUS = 189.4

const NUMERALS = [
  { text: '12', left: 313.45, top: 114 },
  { text: '9', left: 125, top: 303.35 },
  { text: '3', left: 503.71, top: 303.35 },
  { text: '6', left: 313.45, top: 492.71 },
]

export default function ClockFace() {
  return (
    <>
      <svg className="clock-face" width="650" height="650" viewBox="0 0 650 650" aria-hidden="true">
        {DOT_ANGLES.map((a) => {
          const r = (a * Math.PI) / 180
          return <circle key={a} cx={CX + DOT_RADIUS * Math.sin(r)} cy={CY - DOT_RADIUS * Math.cos(r)} r="6.312" fill="#fff" />
        })}
        <g stroke="#fff" strokeWidth="5.41" strokeLinecap="round" fill="none">
          <line x1="325.175" y1="173.51" x2="325.175" y2="314.17" />
          <line x1="332.45" y1="334.88" x2="373.98" y2="406.84" />
          <line x1="315.94" y1="332.19" x2="228.48" y2="430.51" strokeOpacity="0.3" />
          <circle cx={CX} cy="325.35" r="10.82" />
        </g>
      </svg>
      {NUMERALS.map((n) => (
        <span key={n.text} className="clock-face__numeral" style={{ left: n.left, top: n.top }}>{n.text}</span>
      ))}
    </>
  )
}
