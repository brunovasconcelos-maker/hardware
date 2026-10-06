import FullGradient from '../FullGradient.jsx'
import ProgressRing from '../../components/ProgressRing.jsx'
import PageDots from '../../components/PageDots.jsx'
import { usageWeeklyGradient } from '../gradients.js'
import '../screens.css'

// Usage semanal (Figma 107:1643): 13% of the weekly limit.
export default function UsageSemanalScreen({ percent = 13, showDots = true }) {
  return (
    <FullGradient gradient={usageWeeklyGradient} duration={23} phase={0.6}>
      <ProgressRing value={percent / 100} size={650} radius={230} stroke={24} />
      <div className="stat-group">
        <p className="stat-group__value">{percent}%</p>
        <p className="stat-group__label">Limite semanal</p>
      </div>
      {showDots && <PageDots active={0} />}
    </FullGradient>
  )
}
