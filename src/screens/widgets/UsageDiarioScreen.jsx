import { Warning } from '@phosphor-icons/react'
import FullGradient from '../FullGradient.jsx'
import ProgressRing from '../../components/ProgressRing.jsx'
import PageDots from '../../components/PageDots.jsx'
import { usageDailyGradient } from '../gradients.js'
import '../screens.css'

// Usage diário (Figma 107:1941): 98% of the daily limit, with warning icon.
export default function UsageDiarioScreen({ percent = 98, showDots = true }) {
  return (
    <FullGradient gradient={usageDailyGradient} duration={14} phase={0.3}>
      <ProgressRing value={percent / 100} size={650} radius={230} stroke={24} />
      <div className="stat-group">
        <div className="stat-group__icon">
          <Warning size={56} weight="regular" color="#ffffff" style={{ position: 'absolute', left: 0, top: 0 }} />
        </div>
        <p className="stat-group__value">{percent}%</p>
        <p className="stat-group__label">Limite diário</p>
      </div>
      {showDots && <PageDots active={1} />}
    </FullGradient>
  )
}
