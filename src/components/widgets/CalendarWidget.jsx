import GradientOrb from '../GradientOrb.jsx'
import { useNow, WEEKDAYS_SHORT } from '../../hooks/useNow.js'
import './widgets.css'

const layers = [
  { type: 'radial', at: '50% 0%', size: '55%', stops: [['#dc3fb4', '0%'], ['rgba(220,63,180,0)', '100%']] },
  { type: 'radial', at: '20% 100%', size: '60%', stops: [['#eaa6b8', '0%'], ['rgba(234,166,184,0)', '100%']] },
  { type: 'radial', at: '90% 60%', size: '45%', stops: [['#df6192', '0%'], ['rgba(223,97,146,0)', '100%']] },
]

// Shows the real weekday (pt-BR, e.g. "Qua") and day of the month.
export default function CalendarWidget({ weekday, day }) {
  const now = useNow()
  return (
    <GradientOrb size={180} duration={16} phase={0.8} base="#de4cae" layers={layers}>
      <p className="calendar-widget__date">
        <span>{weekday ?? WEEKDAYS_SHORT[now.getDay()]}</span>
        <span>{day ?? now.getDate()}</span>
      </p>
    </GradientOrb>
  )
}
