import GradientOrb from '../GradientOrb.jsx'
import './widgets.css'

const layers = [
  { type: 'radial', at: '0% 55%', size: '50%', stops: [['#b04a90', '0%'], ['rgba(176,74,144,0)', '100%']] },
  { type: 'radial', at: '100% 18%', size: '55%', stops: [['#3a34b0', '0%'], ['rgba(58,52,176,0)', '100%']] },
  { type: 'radial', at: '78% 108%', size: '55%', stops: [['#9fb0ea', '0%'], ['rgba(159,176,234,0)', '100%']] },
  { type: 'radial', at: '25% 112%', size: '55%', stops: [['#e2c4ee', '0%'], ['rgba(226,196,238,0)', '100%']] },
  { type: 'linear', angle: '180deg', stops: [['#4a2a8c', '0%'], ['#7a34b0', '48%'], ['#8c5cc4', '75%'], ['#a98fd6', '100%']] },
]

// Static time from Figma: hands at ~5:00 (hour), 12 (minute) and a faint second-hand-style line.
// Geometry is in the Figma 200x200 "Hora" frame, which overflows the 180px circle by 10px per side.
const DOT_ANGLES = [30, 60, 120, 150, 210, 240, 300, 330]
const CX = 100
const CY = 100.1

const hand = (x1, y1, x2, y2, opacity = 1) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeOpacity={opacity} strokeWidth="1.846" strokeLinecap="round" />
)

export default function ClockWidget() {
  return (
    <GradientOrb size={180} duration={20} phase={0.4} base="#6f3aa6" layers={layers}>
      <svg className="clock-widget__face" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
        {DOT_ANGLES.map((a) => {
          const r = (a * Math.PI) / 180
          return <circle key={a} cx={CX + 64.6 * Math.sin(r)} cy={CY - 64.6 * Math.cos(r)} r="2.154" fill="#fff" />
        })}
        {hand(100, 48.31, 100, 96.31)}
        {hand(102.48, 103.37, 116.66, 127.93)}
        {hand(96.85, 102.46, 66.99, 136, 0.3)}
        <circle cx={CX} cy={CY} r="3.69" fill="none" stroke="#fff" strokeWidth="1.846" />
        <g fill="#fff" fontFamily="Inter, sans-serif" fontWeight="400" fontSize="12.308" textAnchor="middle" dominantBaseline="central">
          <text x="103" y="35.5">12</text>
          <text x="35.7" y="100.1">9</text>
          <text x="164.9" y="100.1">3</text>
          <text x="100" y="164.7">6</text>
        </g>
      </svg>
    </GradientOrb>
  )
}
