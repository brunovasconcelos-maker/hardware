import { WifiHigh } from '@phosphor-icons/react'
import FullGradient from '../FullGradient.jsx'
import PageDots from '../../components/PageDots.jsx'
import '../screens.css'

// Wi-fi (Figma 157:2081): connected network. Same gradient as Bateria.
export default function WifiScreen({ network = 'INNERAI-GUEST', showDots = true }) {
  return (
    <FullGradient orb="batteryFull">
      <div className="wifi-group">
        <WifiHigh size={120} weight="regular" color="currentColor" />
        <div className="wifi-group__text">
          <p className="wifi-group__name">{network}</p>
          <p className="wifi-group__status">Conectado</p>
        </div>
      </div>
      {showDots && <PageDots active={1} />}
    </FullGradient>
  )
}
