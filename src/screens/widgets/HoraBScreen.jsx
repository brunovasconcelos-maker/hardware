import FullGradient from '../FullGradient.jsx'
import PageDots from '../../components/PageDots.jsx'
import { useNow, pad2 } from '../../hooks/useNow.js'
import '../screens.css'

// Hora, style B (Figma 107:1857): digital clock showing the real time (HH:MM, 24h).
export default function HoraBScreen({ time, showDots = true }) {
  const now = useNow()
  const label = time ?? `${pad2(now.getHours())}:${pad2(now.getMinutes())}`
  return (
    <FullGradient orb="digital">
      <p className="digital-clock">{label}</p>
      {showDots && <PageDots active={1} />}
    </FullGradient>
  )
}
