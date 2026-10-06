import { CirclesFour } from '@phosphor-icons/react'
import MicButton from '../../components/MicButton.jsx'
import '../screens.css'

// Homepage (Figma 107:1330). The grid icon (hit area = the 145px Figma frame) returns to the rest screen.
export default function HomeScreen({ name = 'Bruno', onGridClick }) {
  return (
    <div className="home-screen">
      <p className="home-screen__greeting">Olá, {name}</p>
      <div className="home-screen__mic">
        <MicButton size={240} />
      </div>
      <p className="home-screen__prompt">Como posso ajudar?</p>
      <div
        className="home-screen__grid-hit"
        role="button"
        tabIndex={0}
        aria-label="Voltar ao descanso"
        onClick={() => onGridClick?.()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onGridClick?.()
          }
        }}
      >
        <CirclesFour className="home-screen__grid" size={56} weight="regular" color="rgba(255,255,255,0.5)" />
      </div>
    </div>
  )
}
