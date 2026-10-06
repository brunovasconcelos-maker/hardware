import FullGradient from '../FullGradient.jsx'
import ClockFace from '../ClockFace.jsx'
import PageDots from '../../components/PageDots.jsx'
import '../screens.css'

// Hora, style A (Figma 107:1427): analog clock.
export default function HoraAScreen({ showDots = true }) {
  return (
    <FullGradient orb="clockFull" duration={22.5} phase={0.05}>
      <ClockFace />
      {showDots && <PageDots active={0} />}
    </FullGradient>
  )
}
