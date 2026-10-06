import FullGradient from '../FullGradient.jsx'
import ClockFace from '../ClockFace.jsx'
import PageDots from '../../components/PageDots.jsx'
import { clockGradient } from '../gradients.js'
import '../screens.css'

// Hora, style A (Figma 107:1427): analog clock.
export default function HoraAScreen({ showDots = true }) {
  return (
    <FullGradient gradient={clockGradient} duration={20} phase={0.05}>
      <ClockFace />
      {showDots && <PageDots active={0} />}
    </FullGradient>
  )
}
