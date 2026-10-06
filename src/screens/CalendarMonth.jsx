import './screens.css'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

// Month grid for any month. `month` is 1–12. Weeks start on Sunday (D). Days of the adjacent months
// fill the first/last week at 50% opacity. `highlightDay` marks the current day in that month.
export default function CalendarMonth({ month, year, highlightDay }) {
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()
  const weeks = Math.ceil((firstWeekday + daysInMonth) / 7)

  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const day = i - firstWeekday + 1
    if (day < 1) return { label: daysInPrevMonth + day, muted: true }
    if (day > daysInMonth) return { label: day - daysInMonth, muted: true }
    return { label: day, muted: false, today: day === highlightDay }
  })

  return (
    <>
      <p className="calendar-month__title">{MONTHS[month - 1]}</p>
      <div className={weeks > 5 ? 'calendar-month__grid calendar-month__grid--tight' : 'calendar-month__grid'}>
        <div className="calendar-month__row calendar-month__row--muted">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="calendar-month__cell">{d}</div>
          ))}
        </div>
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="calendar-month__row">
            {cells.slice(w * 7, w * 7 + 7).map((c, i) => (
              <div
                key={i}
                className={`calendar-month__cell${c.muted ? ' calendar-month__cell--muted' : ''}${c.today ? ' calendar-month__cell--today' : ''}`}
              >
                {c.label}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
