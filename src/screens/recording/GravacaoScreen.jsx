import { CassetteTape } from '@phosphor-icons/react'
import './recording.css'
import '../screens.css'

// Gravação, Tela 1 (Figma 107:1643): start recording. Visual only.
export default function GravacaoScreen() {
  return (
    <div className="voice-screen recording-screen">
      <div className="recording-start__group">
        <CassetteTape className="recording-start__icon" size={120} weight="regular" color="currentColor" />
        <p className="recording-start__text">
          Clique para iniciar
          <br />
          a gravação
        </p>
      </div>
      <div className="recording-button recording-button--pill recording-button--theme" style={{ left: 'calc(50% + 0.5px)', transform: 'translateX(-50%)' }}>
        Gravar
      </div>
    </div>
  )
}
