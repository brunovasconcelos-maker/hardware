import { useRef } from 'react'
import { List, CirclesFour, Check } from '@phosphor-icons/react'
import { useDragScroll } from '../../hooks/useDragScroll.js'
import WidgetHit from '../../components/WidgetHit.jsx'
import { VOICE_RESULTS } from '../../mocks/voiceResults.js'
import './voice.css'

// Result (Figma 158:2173). Only the text area scrolls; icons, the bottom fade and the OK button stay fixed.
// `onGridClick` / `onOkClick` are optional; the history (list) icon has no action yet.
export default function ResultScreen({ result = VOICE_RESULTS[0], onGridClick, onOkClick }) {
  const scroll = useRef(null)
  useDragScroll(scroll)
  const Grid = onGridClick ? WidgetHit : 'div'
  const gridProps = onGridClick ? { label: 'Abrir menu', onActivate: onGridClick } : {}
  const Ok = onOkClick ? WidgetHit : 'div'
  const okProps = onOkClick ? { label: 'Concluir', onActivate: onOkClick } : {}
  return (
    <div className="voice-screen result-screen">
      <div ref={scroll} className="result-screen__scroll">
        <div className="result-screen__content">
          <div className="result-screen__head">
            <p className="result-screen__title">{result.title}</p>
            <p className="result-screen__meta">{result.date}</p>
            <p className="result-screen__meta">{result.subtitle}</p>
          </div>
          <div className="result-screen__divider" />
          <p className="result-screen__body">{result.body}</p>
        </div>
      </div>
      <div className="result-screen__fade" />
      <div className="result-screen__icon result-screen__icon--left">
        <List size={56} weight="regular" color="currentColor" style={{ color: 'var(--on-surface-muted)' }} />
      </div>
      <Grid className="result-screen__icon result-screen__icon--right" {...gridProps}>
        <CirclesFour size={56} weight="regular" color="currentColor" style={{ color: 'var(--on-surface-muted)' }} />
      </Grid>
      <Ok className="result-screen__ok" {...okProps}>
        <Check size={40} weight="regular" color="currentColor" />
      </Ok>
    </div>
  )
}
