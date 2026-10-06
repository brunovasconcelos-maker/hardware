import { Lightning } from '@phosphor-icons/react'
import FullGradient from '../FullGradient.jsx'
import ProgressRing from '../../components/ProgressRing.jsx'
import PageDots from '../../components/PageDots.jsx'
import { batteryGradient } from '../gradients.js'
import '../screens.css'

// Bateria (Figma 153:2026): charging at 72%.
export default function BateriaScreen({ percent = 72, showDots = true }) {
  return (
    <FullGradient gradient={batteryGradient} duration={21} phase={0.15}>
      <ProgressRing value={percent / 100} size={650} radius={230} stroke={24} />
      <div className="stat-group">
        <div className="stat-group__icon">
          <Lightning size={56} weight="regular" color="#ffffff" style={{ position: 'absolute', left: 0, top: -0.5 }} />
        </div>
        <p className="stat-group__value">{percent}%</p>
        <p className="stat-group__label">Carregando</p>
      </div>
      {showDots && <PageDots active={0} />}
    </FullGradient>
  )
}
