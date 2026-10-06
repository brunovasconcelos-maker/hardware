import { orbProps } from '../../theme/theme.js'
import GradientOrb from '../GradientOrb.jsx'
import { useNow, WEEKDAYS_SHORT } from '../../hooks/useNow.js'
import './widgets.css'

// Shows the real weekday (pt-BR, e.g. "Qua") and day of the month.
export default function CalendarWidget({ weekday, day }) {
  const now = useNow()
  return (
    <GradientOrb size={180} {...orbProps('calendar')}>
      <p className="calendar-widget__date">
        <span>{weekday ?? WEEKDAYS_SHORT[now.getDay()]}</span>
        <span>{day ?? now.getDate()}</span>
      </p>
    </GradientOrb>
  )
}
