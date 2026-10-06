import { CirclesFour } from '@phosphor-icons/react'
import MicButton from '../../components/MicButton.jsx'
import '../screens.css'

// Homepage (Figma 107:1330). The grid icon on the right is visual only for now.
export default function HomeScreen({ name = 'Bruno' }) {
  return (
    <div className="home-screen">
      <p className="home-screen__greeting">Olá, {name}</p>
      <div className="home-screen__mic">
        <MicButton size={240} />
      </div>
      <p className="home-screen__prompt">Como posso ajudar?</p>
      <CirclesFour className="home-screen__grid" size={56} weight="regular" color="rgba(255,255,255,0.5)" />
    </div>
  )
}
