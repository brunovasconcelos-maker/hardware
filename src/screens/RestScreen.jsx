import { useRef, useState, useLayoutEffect } from 'react'
import OrbitItem from '../components/OrbitItem.jsx'
import MicButton from '../components/MicButton.jsx'
import WidgetHit from '../components/WidgetHit.jsx'
import WidgetViewer from '../components/WidgetViewer.jsx'
import TasksWidget from '../components/widgets/TasksWidget.jsx'
import WeatherWidget from '../components/widgets/WeatherWidget.jsx'
import UsageWidget from '../components/widgets/UsageWidget.jsx'
import CalendarWidget from '../components/widgets/CalendarWidget.jsx'
import BatteryWidget from '../components/widgets/BatteryWidget.jsx'
import ClockWidget from '../components/widgets/ClockWidget.jsx'
import { WIDGET_VIEWS } from './widgetViews.jsx'
import { useClockStyle } from '../hooks/useClockStyle.js'
import { useUsageMode, USAGE_DATA } from '../hooks/useUsageMode.js'
import { run, dur, OPEN_MS } from '../motion.js'
import { ORBIT_ANGLES } from '../orbit.js'
import './RestScreen.css'

const DISPLAY = 650

// "Tela de Descanso": microphone in the center, six widgets on a shared circular orbit.
// Clicking a widget grows it into its full-screen view (orbit paused); dragging that view up closes it.
// `orbitPaused` freezes (and resumes) the orbit rotation without resetting its position. While the screen is completely
// covered (`covered`, or a widget fully open) the orbit is paused too; it resumes from where it stopped.
export default function RestScreen({ orbitPaused = false, covered = false, onMicClick }) {
  const [clockStyle, setClockStyle] = useClockStyle()
  const [usageMode, setUsageMode] = useUsageMode()
  const [open, setOpen] = useState(null) // { key, from: {dx, dy, scale}, phase: 'opening' | 'open' | 'closing' }
  const rootRef = useRef(null)
  const overlayRef = useRef(null)

  // Overlay transform that places the full-screen view exactly on the widget (center + size).
  const fromTransform = (from, dy = 0) => `translate(${from.dx}px, ${from.dy + dy}px) scale(${from.scale})`

  const openWidget = (key, el) => {
    if (open) return
    const display = rootRef.current.closest('.device-display').getBoundingClientRect()
    const r = el.getBoundingClientRect()
    setOpen({
      key,
      phase: 'opening',
      from: { dx: r.x + r.width / 2 - display.x - DISPLAY / 2, dy: r.y + r.height / 2 - display.y - DISPLAY / 2, scale: r.width / DISPLAY },
    })
  }

  // Opening: grow from the widget to full screen (~450ms, ease-out) while fading in.
  useLayoutEffect(() => {
    if (open?.phase !== 'opening') return
    const { done } = run(
      overlayRef.current,
      [
        { transform: fromTransform(open.from), opacity: 0 },
        { opacity: 1, offset: 0.6 },
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
      ],
      { duration: dur(OPEN_MS), easing: 'ease-out' },
    )
    let cancelled = false
    done.then(() => {
      if (!cancelled) setOpen((o) => (o ? { ...o, phase: 'open' } : o))
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open?.key, open?.phase === 'opening'])

  // Closing: reverse of the opening, starting from wherever the drag left the view.
  const closeWidget = async ({ dy, index }) => {
    if (open.key === 'clock') setClockStyle(index === 0 ? 'a' : 'b')
    if (open.key === 'usage') setUsageMode(index === 0 ? 'semanal' : 'diario')
    const from = open.from
    setOpen((o) => ({ ...o, phase: 'closing' }))
    const { done } = run(
      overlayRef.current,
      [
        { transform: `translate(0px, ${dy}px) scale(1)`, opacity: 1 },
        { opacity: 1, offset: 0.4 },
        { transform: fromTransform(from), opacity: 0 },
      ],
      { duration: dur(OPEN_MS), easing: 'ease-in', fill: 'forwards' },
    )
    await done
    setOpen(null) // unmounts the overlay and resumes the orbit from where it paused
  }

  const view = open ? WIDGET_VIEWS[open.key] : null
  const widgets = [
    { key: 'tasks', angle: ORBIT_ANGLES.tasks, node: <TasksWidget /> },
    { key: 'weather', angle: ORBIT_ANGLES.weather, node: <WeatherWidget /> },
    { key: 'usage', angle: ORBIT_ANGLES.usage, node: <UsageWidget {...USAGE_DATA[usageMode]} /> },
    { key: 'calendar', angle: ORBIT_ANGLES.calendar, node: <CalendarWidget /> },
    { key: 'battery', angle: ORBIT_ANGLES.battery, node: <BatteryWidget /> },
    { key: 'clock', angle: ORBIT_ANGLES.clock, node: <ClockWidget style={clockStyle} /> },
  ]

  return (
    <div className="rest-screen" ref={rootRef} data-covered={covered || open?.phase === 'open' ? '' : undefined}>
      <div className="rest-screen__orbit" data-paused={orbitPaused || open !== null}>
        {widgets.map((w) => (
          <OrbitItem key={w.key} angle={w.angle}>
            <WidgetHit label={WIDGET_VIEWS[w.key].label} onActivate={(el) => openWidget(w.key, el)}>
              {w.node}
            </WidgetHit>
          </OrbitItem>
        ))}
      </div>
      <div className="rest-screen__mic">
        <div
          className="mic-hit"
          role="button"
          tabIndex={0}
          aria-label="Abrir início"
          onClick={() => onMicClick?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onMicClick?.()
            }
          }}
        >
          <MicButton />
        </div>
      </div>
      {open && (
        <div ref={overlayRef} className="rest-screen__overlay" data-phase={open.phase}>
          <WidgetViewer
            pageCount={view.pageCount}
            initialIndex={open.key === 'clock' ? (clockStyle === 'b' ? 1 : 0) : open.key === 'usage' ? (usageMode === 'diario' ? 1 : 0) : 0}
            renderPage={view.renderPage}
            disabled={open.phase !== 'open'}
            onClose={closeWidget}
          />
        </div>
      )}
    </div>
  )
}
