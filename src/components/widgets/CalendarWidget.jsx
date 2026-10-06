import GradientOrb from '../GradientOrb.jsx'
import './widgets.css'

const layers = [
  { type: 'radial', at: '50% 0%', size: '55%', stops: [['#dc3fb4', '0%'], ['rgba(220,63,180,0)', '100%']] },
  { type: 'radial', at: '20% 100%', size: '60%', stops: [['#eaa6b8', '0%'], ['rgba(234,166,184,0)', '100%']] },
  { type: 'radial', at: '90% 60%', size: '45%', stops: [['#df6192', '0%'], ['rgba(223,97,146,0)', '100%']] },
]

export default function CalendarWidget({ weekday = 'Qua', day = 24 }) {
  return (
    <GradientOrb size={180} base="#de4cae" layers={layers}>
      <p className="calendar-widget__date">
        <span>{weekday}</span>
        <span>{day}</span>
      </p>
    </GradientOrb>
  )
}
