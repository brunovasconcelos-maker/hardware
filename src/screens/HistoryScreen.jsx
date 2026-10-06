import { useRef } from 'react'
import { X } from '@phosphor-icons/react'
import { VOICE_RESULTS } from '../mocks/voiceResults.js'
import { useDragScroll } from '../hooks/useDragScroll.js'
import './history.css'

// Histórico (Figma 168:2273 top of the list, 204:2923 scrolled). Visual only: the title and the close icon are fixed,
// the list scrolls behind the title and fades out through a gradient mask. `items` defaults to all mock responses.
export default function HistoryScreen({ items = VOICE_RESULTS }) {
  const scroll = useRef(null)
  useDragScroll(scroll) // click-and-drag scrolling with momentum (same as the Result screen); the wheel is native
  return (
    <div className="voice-screen history-screen">
      <div ref={scroll} className="history-screen__scroll">
        <ul className="history-screen__list">
          {items.map((item) => (
            <li key={item.id} className="history-screen__item">
              <svg className="history-screen__dot" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="history-screen__label">{item.historyTitle}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="history-screen__title">Histórico</p>
      <div className="history-screen__close">
        <X size={56} weight="regular" color="currentColor" />
      </div>
    </div>
  )
}
