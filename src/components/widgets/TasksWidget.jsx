import GradientOrb from '../GradientOrb.jsx'
import ProgressRing from '../ProgressRing.jsx'
import './widgets.css'

const layers = [
  { type: 'radial', at: '0% 100%', size: '60%', stops: [['#6a1347', '0%'], ['rgba(106,19,71,0)', '100%']] },
  { type: 'radial', at: '95% 20%', size: '55%', stops: [['#8038cc', '0%'], ['rgba(128,56,204,0)', '100%']] },
  { type: 'radial', at: '10% 15%', size: '55%', stops: [['#2a0060', '0%'], ['rgba(42,0,96,0)', '100%']] },
  { type: 'linear', angle: '180deg', stops: [['#4a0aa4', '0%'], ['#6a1cc0', '35%'], ['#b4147a', '72%'], ['#d41a5e', '100%']] },
]

export default function TasksWidget({ done = 3, total = 4 }) {
  return (
    <GradientOrb size={180} duration={14} phase={0.1} base="#5a12b0" layers={layers}>
      <ProgressRing value={done / total} />
      <div className="tasks-widget__text">
        <p className="tasks-widget__count">{done}/{total}</p>
        <p className="tasks-widget__label">Tarefas</p>
      </div>
    </GradientOrb>
  )
}
