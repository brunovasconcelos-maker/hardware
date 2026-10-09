import Waveform from '../../components/Waveform.jsx'
import './recording.css'
import '../screens.css'

// Sample waveform of Tela 2 (Figma 460:6023): heights of the 21 bars left of the playhead.
export const SAMPLE_BARS = [18, 70, 158, 90, 190, 122, 94, 18, 39, 74, 94, 74, 39, 122, 190, 158, 70, 18, 18, 39, 74]

// Gravação, Tela 2 (Figma 460:6023): recording. Static sample values, visual only.
export default function GravandoScreen({ time = '00:10:04', bars = SAMPLE_BARS }) {
  return (
    <div className="voice-screen recording-screen">
      <p className="recording-timer">{time}</p>
      <Waveform bars={bars} />
      <div className="recording-button recording-button--pill recording-button--inverse" style={{ left: 'calc(50% - 7px)', transform: 'translateX(-50%)' }}>
        Finalizar
      </div>
    </div>
  )
}
