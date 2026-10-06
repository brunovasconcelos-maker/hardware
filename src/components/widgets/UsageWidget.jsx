import { orbProps } from '../../theme/theme.js'
import GradientOrb from '../GradientOrb.jsx'
import ProgressRing from '../ProgressRing.jsx'
import './widgets.css'

export default function UsageWidget({ percent = 13, label = 'Semanal' }) {
  return (
    <GradientOrb size={180} {...orbProps('usage')}>
      <ProgressRing value={percent / 100} />
      <div className="usage-widget__text">
        <p className="usage-widget__value">{percent}%</p>
        <p className="usage-widget__label">{label}</p>
      </div>
    </GradientOrb>
  )
}
