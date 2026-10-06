import { orbProps } from '../../theme/theme.js'
import GradientOrb from '../GradientOrb.jsx'
import ProgressRing from '../ProgressRing.jsx'
import './widgets.css'

export default function TasksWidget({ done = 3, total = 4 }) {
  return (
    <GradientOrb size={180} duration={18} phase={0.1} {...orbProps('tasks')}>
      <ProgressRing value={done / total} />
      <div className="tasks-widget__text">
        <p className="tasks-widget__count">{done}/{total}</p>
        <p className="tasks-widget__label">Tarefas</p>
      </div>
    </GradientOrb>
  )
}
