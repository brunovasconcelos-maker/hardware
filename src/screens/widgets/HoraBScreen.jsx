import FullGradient from '../FullGradient.jsx'
import PageDots from '../../components/PageDots.jsx'
import { digitalClockGradient } from '../gradients.js'
import '../screens.css'

// Hora, style B (Figma 107:1857): digital clock.
export default function HoraBScreen({ time = '17:00' }) {
  return (
    <FullGradient gradient={digitalClockGradient} duration={15} phase={0.5}>
      <p className="digital-clock">{time}</p>
      <PageDots active={1} />
    </FullGradient>
  )
}
