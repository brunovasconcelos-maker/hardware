import GradientOrb from '../GradientOrb.jsx'
import { digitalClockGradient } from '../../screens/gradients.js'
import { useNow, pad2 } from '../../hooks/useNow.js'
import '../../screens/screens.css'
import './widgets.css'

const layers = [
  { type: 'radial', at: '0% 55%', size: '50%', stops: [['#b04a90', '0%'], ['rgba(176,74,144,0)', '100%']] },
  { type: 'radial', at: '100% 18%', size: '55%', stops: [['#3a34b0', '0%'], ['rgba(58,52,176,0)', '100%']] },
  { type: 'radial', at: '78% 108%', size: '55%', stops: [['#9fb0ea', '0%'], ['rgba(159,176,234,0)', '100%']] },
  { type: 'radial', at: '25% 112%', size: '55%', stops: [['#e2c4ee', '0%'], ['rgba(226,196,238,0)', '100%']] },
  { type: 'linear', angle: '180deg', stops: [['#4a2a8c', '0%'], ['#7a34b0', '48%'], ['#8c5cc4', '75%'], ['#a98fd6', '100%']] },
]

// Geometry is in the Figma 200x200 "Hora" frame, which overflows the 180px circle by 10px per side.
// Hands show the real time: each is a segment from radius r0 to r1 around the center ring.
const DOT_ANGLES = [30, 60, 120, 150, 210, 240, 300, 330]
const CX = 100
const CY = 100.1

const hand = (angle, r0, r1, opacity = 1) => (
  <line
    x1={CX}
    y1={CY - r0}
    x2={CX}
    y2={CY - r1}
    stroke="#fff"
    strokeOpacity={opacity}
    strokeWidth="1.846"
    strokeLinecap="round"
    transform={`rotate(${angle} ${CX} ${CY})`}
  />
)

const DIGITAL_SCALE = 180 / 650

// style 'a': analog clock. style 'b': the digital full-screen design (HoraB) scaled to the widget size.
export default function ClockWidget({ style = 'a' }) {
  const now = useNow()
  if (style === 'b') {
    return (
      <GradientOrb size={180} duration={15} phase={0.5} base={digitalClockGradient.base} layers={digitalClockGradient.layers}>
        <div className="clock-widget__digital" style={{ transform: `scale(${DIGITAL_SCALE})` }}>
          <p className="digital-clock">{`${pad2(now.getHours())}:${pad2(now.getMinutes())}`}</p>
        </div>
      </GradientOrb>
    )
  }
  const h = now.getHours() % 12
  const m = now.getMinutes()
  const sec = now.getSeconds()
  return (
    <GradientOrb size={180} duration={20} phase={0.4} base="#6f3aa6" layers={layers}>
      <svg className="clock-widget__face" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
        {DOT_ANGLES.map((a) => {
          const r = (a * Math.PI) / 180
          return <circle key={a} cx={CX + 64.6 * Math.sin(r)} cy={CY - 64.6 * Math.cos(r)} r="2.154" fill="#fff" />
        })}
        {hand((h + m / 60) * 30, 4.1, 32.4)}
        {hand((m + sec / 60) * 6, 3.8, 51.8)}
        {hand(sec * 6, 3.9, 48.8, 0.3)}
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
