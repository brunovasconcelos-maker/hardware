import FullGradient from '../FullGradient.jsx'
import CalendarMonth from '../CalendarMonth.jsx'
import { calendarGradient } from '../gradients.js'
import { useNow } from '../../hooks/useNow.js'
import '../screens.css'

// Calendário (Figma 107:1529). Defaults to the current month with today highlighted.
export default function CalendarioScreen({ month, year, highlightDay }) {
  const now = useNow()
  const m = month ?? now.getMonth() + 1
  const y = year ?? now.getFullYear()
  const today = highlightDay ?? (m === now.getMonth() + 1 && y === now.getFullYear() ? now.getDate() : undefined)
  return (
    <FullGradient gradient={calendarGradient} duration={13} phase={0.7}>
      <CalendarMonth month={m} year={y} highlightDay={today} />
    </FullGradient>
  )
}
