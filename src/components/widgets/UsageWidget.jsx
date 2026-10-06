import GradientOrb from '../GradientOrb.jsx'
import ProgressRing from '../ProgressRing.jsx'
import './widgets.css'

const layers = [
  { type: 'radial', at: '5% 88%', size: '75%', stops: [['#34c070', '0%'], ['#3ec27a', '45%'], ['rgba(52,192,112,0)', '100%']] },
  { type: 'radial', at: '70% 108%', size: '38%', stops: [['#5a9a74', '0%'], ['rgba(90,154,116,0)', '100%']] },
  { type: 'linear', angle: '200deg', stops: [['#6a0b3a', '0%'], ['#6a0d3c', '36%'], ['#9a78b8', '46%'], ['#ece4f1', '54%'], ['#cdbad6', '70%'], ['#c9b4d2', '100%']] },
]

export default function UsageWidget({ percent = 13, label = 'Semanal' }) {
  return (
    <GradientOrb size={180} base="#8a6a9a" layers={layers}>
      <ProgressRing value={percent / 100} />
      <div className="usage-widget__text">
        <p className="usage-widget__value">{percent}%</p>
        <p className="usage-widget__label">{label}</p>
      </div>
    </GradientOrb>
  )
}
