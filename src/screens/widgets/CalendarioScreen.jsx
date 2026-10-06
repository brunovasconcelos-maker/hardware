import FullGradient from '../FullGradient.jsx'
import CalendarMonth from '../CalendarMonth.jsx'
import { calendarGradient } from '../gradients.js'
import '../screens.css'

// Calendário (Figma 107:1529). Preview month: the Figma layout is "Out" with Oct 1 on a Monday and
// day 24 highlighted on a Wednesday, which is October 2029 (also October 2018).
export default function CalendarioScreen({ month = 10, year = 2029, highlightDay = 24 }) {
  return (
    <FullGradient gradient={calendarGradient} duration={13} phase={0.7}>
      <CalendarMonth month={month} year={year} highlightDay={highlightDay} />
    </FullGradient>
  )
}
