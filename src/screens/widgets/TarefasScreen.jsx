import { CheckCircle, CircleDashed } from '@phosphor-icons/react'
import FullGradient from '../FullGradient.jsx'
import PageDots from '../../components/PageDots.jsx'
import '../screens.css'

// Figma copy is English ("Mapping out the screens", "Checking click reaction and", "Conecting each screen",
// "Finished"); translated to pt-BR as requested. Long labels are ellipsized at 320px like in Figma.
const TASKS = [
  { label: 'Mapeando as telas', done: true },
  { label: 'Verificando a reação ao clique e', done: true },
  { label: 'Conectando cada tela', done: true },
  { label: 'Finalizado', done: false },
]

// Tarefas (Figma 107:1656).
export default function TarefasScreen({ tasks = TASKS, showDots = true }) {
  const doneCount = tasks.filter((t) => t.done).length
  return (
    <FullGradient orb="tasksFull">
      <svg className="tasks-screen__line" width="650" height="650" viewBox="0 0 650 650" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <line x1="155" y1="216" x2="155" y2="270" />
          <line x1="155" y1="303" x2="155" y2="357" />
          <line x1="155" y1="377" x2="155" y2="427" />
          <line x1="149" y1="427" x2="161" y2="427" />
        </g>
      </svg>
      <p className="tasks-screen__count">{doneCount}/{tasks.length}</p>
      <ul className="tasks-screen__list">
        {tasks.map((t) => (
          <li key={t.label} className="tasks-screen__item">
            {t.done ? (
              <CheckCircle size={48} weight="fill" color="currentColor" />
            ) : (
              <CircleDashed size={48} weight="regular" color="currentColor" />
            )}
            <span className="tasks-screen__label">{t.label}</span>
          </li>
        ))}
      </ul>
      {showDots && <PageDots active={0} />}
    </FullGradient>
  )
}
