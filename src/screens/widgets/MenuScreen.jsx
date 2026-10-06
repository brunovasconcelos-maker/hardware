import { useRef } from 'react'
import { Globe, GearSix, PlayPause, ClockCounterClockwise, Power, WifiHigh, SpeakerSimpleHigh, X } from '@phosphor-icons/react'
import WidgetHit from '../../components/WidgetHit.jsx'
import { run, dur } from '../../motion.js'
import '../screens.css'

const MENU_MS = 300

// Slots from Figma (145px frames, 56px icons centered). X closes the menu and the history slot opens Histórico.
// Labels are accessibility names inferred from the icon names (no visible text in the design).
const SLOTS = [
  { key: 'wifi', Icon: WifiHigh, left: 76, top: 75, label: 'Wi-fi' },
  { key: 'gear', Icon: GearSix, left: 253, top: 0, label: 'Ajustes' },
  { key: 'speaker', Icon: SpeakerSimpleHigh, left: 430, top: 75, label: 'Som' },
  { key: 'globe', Icon: Globe, left: 0, top: 252, label: 'Idioma' },
  { key: 'history', Icon: ClockCounterClockwise, left: 76, top: 429, label: 'Histórico' },
  { key: 'play', Icon: PlayPause, left: 253, top: 505, label: 'Gravar reunião' },
  { key: 'power', Icon: Power, left: 430, top: 429, label: 'Apagar tela' },
]

// Sector of the right-hand slot (45° wide, centered on the horizontal axis), from the center to beyond the display.
const R = 400
const A = (22.5 * Math.PI) / 180
const SECTOR = `M325 325 L${325 + R * Math.cos(A)} ${325 - R * Math.sin(A)} L${325 + R * Math.cos(A)} ${325 + R * Math.sin(A)} Z`

// Menu (Figma 107:1359). Opens with a soft fade and slight scale-in (~300ms, CSS); X plays the reverse, then `onClose`.
export default function MenuScreen({ onClose, onHistory }) {
  const ref = useRef(null)
  const closing = useRef(false)

  const close = async () => {
    if (closing.current) return
    closing.current = true
    const { done } = run(
      ref.current,
      [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }],
      { duration: dur(MENU_MS), easing: 'ease-in', fill: 'forwards' },
    )
    await done
    onClose?.()
  }

  return (
    <div ref={ref} className="menu-screen">
      <svg className="menu-screen__sector" width="650" height="650" viewBox="0 0 650 650" aria-hidden="true">
        <path d={SECTOR} fill="#252525" />
        <path
          d={`M${325 + 180 * Math.cos(A)} ${325 - 180 * Math.sin(A)} L${325 + R * Math.cos(A)} ${325 - R * Math.sin(A)} M${325 + 180 * Math.cos(A)} ${325 + 180 * Math.sin(A)} L${325 + R * Math.cos(A)} ${325 + R * Math.sin(A)}`}
          stroke="#0a0a0a"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <div className="menu-screen__center" />
      <p className="menu-screen__title">Menu</p>
      {SLOTS.map(({ key, Icon, left, top, label }) => {
        const action = key === 'history' ? onHistory : undefined
        const Slot = action ? WidgetHit : 'div'
        const props = action ? { label, onActivate: action, className: 'menu-screen__slot menu-screen__slot--button' } : { className: 'menu-screen__slot', 'aria-label': label }
        return (
          <Slot key={key} style={{ left, top }} {...props}>
            <Icon size={56} weight="regular" color="#ffffff" />
          </Slot>
        )
      })}
      <WidgetHit label="Fechar menu" className="menu-screen__slot menu-screen__slot--action" onActivate={close}>
        <X size={56} weight="regular" color="#ffffff" />
      </WidgetHit>
    </div>
  )
}
