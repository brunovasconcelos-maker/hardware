import { Globe, GearSix, PlayPause, ClockCounterClockwise, Power, WifiHigh, SpeakerSimpleHigh, X, MoonStars, Palette, Sun, CaretRight } from '@phosphor-icons/react'
import RadialSector from '../../components/RadialSector.jsx'
import WidgetHit from '../../components/WidgetHit.jsx'
import '../screens.css'

// The radial screens share one shell (opaque background, center circle, highlighted right-hand segment): the Menu
// (Figma 107:1359) and Configurações (Figma 223:3040). Only the content differs: the title, the icons around the circle
// and the icon in the right-hand segment. Slots are 145px frames with 56px icons. Labels are accessibility names inferred
// from the icon names (no visible text in the designs). Stage animates the content when switching between the two.
const SCREENS = {
  menu: {
    title: 'Menu',
    slots: [
      { key: 'wifi', Icon: WifiHigh, left: 76, top: 75, label: 'Wi-fi' },
      { key: 'gear', Icon: GearSix, left: 253, top: 0, label: 'Ajustes', action: 'onSettings' },
      { key: 'speaker', Icon: SpeakerSimpleHigh, left: 430, top: 75, label: 'Som' },
      { key: 'globe', Icon: Globe, left: 0, top: 252, label: 'Idioma' },
      { key: 'history', Icon: ClockCounterClockwise, left: 76, top: 429, label: 'Histórico', action: 'onHistory' },
      { key: 'play', Icon: PlayPause, left: 253, top: 505, label: 'Gravar reunião' },
      { key: 'power', Icon: Power, left: 430, top: 429, label: 'Apagar tela' },
    ],
    side: { Icon: X, label: 'Fechar menu', action: 'onClose' },
  },
  settings: {
    title: 'Configurações',
    slots: [
      { key: 'globe', Icon: Globe, left: 0, top: 252, label: 'Idioma' },
      { key: 'moon', Icon: MoonStars, left: 76, top: 429, label: 'Modo escuro' },
      { key: 'palette', Icon: Palette, left: 253, top: 505, label: 'Cores', action: 'onColors' },
      { key: 'sun', Icon: Sun, left: 430, top: 429, label: 'Modo claro' },
    ],
    side: { Icon: CaretRight, label: 'Voltar', action: 'onBack' },
  },
}

export default function RadialScreen({ screen, ...handlers }) {
  const { title, slots, side } = SCREENS[screen]
  return (
    <div data-screen-root="radial" className="menu-screen">
      <RadialSector data-tx="shell" />
      <div data-tx="shell" className="menu-screen__center" />
      <p data-tx="static" className="menu-screen__title">{title}</p>
      {slots.map(({ key, Icon, left, top, label, action }) => {
        const onActivate = action && handlers[action]
        const Slot = onActivate ? WidgetHit : 'div'
        const props = onActivate ? { label, onActivate: () => onActivate(), className: 'menu-screen__slot menu-screen__slot--button' } : { className: 'menu-screen__slot', 'aria-label': label }
        return (
          <Slot key={`${screen}-${key}`} data-tx="item" style={{ left, top }} {...props}>
            <Icon size={56} weight="regular" color="currentColor" />
          </Slot>
        )
      })}
      <WidgetHit key={`${screen}-side`} data-tx="item" label={side.label} className="menu-screen__slot menu-screen__slot--action" onActivate={() => handlers[side.action]?.()}>
        <side.Icon size={56} weight="regular" color="currentColor" />
      </WidgetHit>
    </div>
  )
}
