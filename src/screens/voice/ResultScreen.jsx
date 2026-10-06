import { List, CirclesFour, Check } from '@phosphor-icons/react'
import { VOICE_RESULTS } from '../../mocks/voiceResults.js'
import './voice.css'

// Result (Figma 158:2173). Only the text area scrolls; icons, the bottom fade and the OK button stay fixed.
export default function ResultScreen({ result = VOICE_RESULTS[0] }) {
  return (
    <div className="voice-screen result-screen">
      <div className="result-screen__scroll">
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
        <List size={56} weight="regular" color="rgba(255,255,255,0.5)" />
      </div>
      <div className="result-screen__icon result-screen__icon--right">
        <CirclesFour size={56} weight="regular" color="rgba(255,255,255,0.5)" />
      </div>
      <div className="result-screen__ok">
        <Check size={40} weight="regular" color="#000000" />
      </div>
    </div>
  )
}
