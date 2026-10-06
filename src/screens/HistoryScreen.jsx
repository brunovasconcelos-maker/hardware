import { useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import { VOICE_RESULTS } from '../mocks/voiceResults.js'
import WidgetHit from '../components/WidgetHit.jsx'
import { loadHistory, historyLabel } from '../history.js'
import { useDragScroll } from '../hooks/useDragScroll.js'
import './history.css'

// Histórico (Figma 168:2273 top of the list, 204:2923 scrolled). The title and the close icon are fixed, the list
// scrolls behind the title and fades out through a gradient mask. It lists the answers saved from the voice flow (OK on
// the Result screen), newest first; `items` ([{ id, label }]) overrides that. `onClose` is called by the X icon.
export default function HistoryScreen({ items, onClose }) {
  const [saved] = useState(() => loadHistory().reverse().map((e, i) => ({ id: `${e.timestamp}-${i}`, label: historyLabel(e, VOICE_RESULTS) })))
  const list = items ?? saved
  const scroll = useRef(null)
  useDragScroll(scroll) // click-and-drag scrolling with momentum (same as the Result screen); the wheel is native
  return (
    <div className="voice-screen history-screen">
      <div ref={scroll} className="history-screen__scroll">
        <ul className="history-screen__list">
          {list.map((item) => (
            <li key={item.id} className="history-screen__item">
              <svg className="history-screen__dot" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="history-screen__label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="history-screen__title">Histórico</p>
      <WidgetHit label="Fechar histórico" className="history-screen__close" onActivate={() => onClose?.()}>
        <X size={56} weight="regular" color="currentColor" />
      </WidgetHit>
    </div>
  )
}
