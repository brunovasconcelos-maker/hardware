import { Globe, MoonStars, Palette, Sun, CaretRight } from '@phosphor-icons/react'
import RadialSector from '../../components/RadialSector.jsx'
import WidgetHit from '../../components/WidgetHit.jsx'
import { useSoftClose } from '../../hooks/useSoftClose.js'
import '../screens.css'

// Slots from Figma 223:3040 (145px frames, 56px icons): same radial structure as the Menu. Only the palette has an action
// (opens Cores); globe, moon and sun are visual only for now. Labels are accessibility names from the icon names.
const SLOTS = [
  { key: 'globe', Icon: Globe, left: 0, top: 252, label: 'Idioma' },
  { key: 'moon', Icon: MoonStars, left: 76, top: 429, label: 'Modo escuro' },
  { key: 'palette', Icon: Palette, left: 253, top: 505, label: 'Cores', action: true },
  { key: 'sun', Icon: Sun, left: 430, top: 429, label: 'Modo claro' },
]

// Configurações. Opens like the Menu (soft fade + scale-in); the back arrow plays the reverse, then `onBack`.
export default function SettingsScreen({ onBack, onColors }) {
  const [ref, close] = useSoftClose()
  return (
    <div ref={ref} className="menu-screen">
      <RadialSector />
      <div className="menu-screen__center" />
      <p className="menu-screen__title">Configurações</p>
      {SLOTS.map(({ key, Icon, left, top, label, action }) => {
        const Slot = action ? WidgetHit : 'div'
        const props = action ? { label, onActivate: () => onColors?.(), className: 'menu-screen__slot menu-screen__slot--button' } : { className: 'menu-screen__slot', 'aria-label': label }
        return (
          <Slot key={key} style={{ left, top }} {...props}>
            <Icon size={56} weight="regular" color="currentColor" />
          </Slot>
        )
      })}
      <WidgetHit label="Voltar" className="menu-screen__slot menu-screen__slot--action" onActivate={() => close(onBack)}>
        <CaretRight size={56} weight="regular" color="currentColor" />
      </WidgetHit>
    </div>
  )
}
