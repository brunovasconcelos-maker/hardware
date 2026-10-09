import { CassetteTape } from '@phosphor-icons/react'
import WidgetHit from '../../components/WidgetHit.jsx'
import './recording.css'
import '../screens.css'

// Gravação, Tela 1 (Figma 107:1643): start recording. `onRecord` (optional) makes "Gravar" a button.
export default function GravacaoScreen({ onRecord }) {
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
      <WidgetHit
        data-no-drag
        label="Gravar"
        className="recording-button recording-button--pill recording-button--theme"
        style={{ left: 'calc(50% + 0.5px)', transform: 'translateX(-50%)' }}
        onActivate={() => onRecord?.()}
      >
        Gravar
      </WidgetHit>
    </div>
  )
}
