import { Play, Check } from '@phosphor-icons/react'
import Waveform from '../../components/Waveform.jsx'
import './recording.css'
import '../screens.css'

// Gravação, Tela 3 (Figma 460:6046): paused. The waveform is collapsed: every bar is a dot. Static sample values, visual only.
export default function PausadoScreen({ time = '00:15:22' }) {
  return (
    <div className="voice-screen recording-screen">
      <p className="recording-timer">{time}</p>
      <Waveform bars={Array(21).fill(6)} collapsed />
      <div className="recording-button recording-button--round recording-button--inverse" style={{ left: 209 }}>
        <Play size={45} weight="fill" color="currentColor" />
      </div>
      <div className="recording-button recording-button--round recording-button--theme" style={{ left: 333 }}>
        <Check size={56} weight="regular" color="currentColor" />
      </div>
    </div>
  )
}
