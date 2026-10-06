import { CirclesFour } from '@phosphor-icons/react'
import MicButton from '../../components/MicButton.jsx'
import WidgetHit from '../../components/WidgetHit.jsx'
import '../screens.css'

// Homepage (Figma 107:1330). The grid icon (hit area = the 145px Figma frame) opens the Menu.
export default function HomeScreen({ name = 'Bruno', onGridClick }) {
  return (
    <div className="home-screen">
      <p className="home-screen__greeting">Olá, {name}</p>
      <div className="home-screen__mic">
        <MicButton size={240} />
      </div>
      <p className="home-screen__prompt">Como posso ajudar?</p>
      <WidgetHit label="Abrir menu" className="home-screen__grid-hit" onActivate={() => onGridClick?.()}>
        <CirclesFour className="home-screen__grid" size={56} weight="regular" color="currentColor" style={{ color: 'var(--on-surface-muted)' }} />
      </WidgetHit>
    </div>
  )
}
