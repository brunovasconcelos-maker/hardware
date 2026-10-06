import MicButton from '../../components/MicButton.jsx'
import VoiceLines from '../../components/VoiceLines.jsx'
import './voice.css'

// Recording / voice captured (Figma 107:1390): smaller microphone orb (no icon) surrounded by 32 radial lines.
// `idle` collapses every line to a dot; `lengths` sets each line's length (px) for later animation.
export default function RecordingScreen({ idle = false, lengths }) {
  return (
    <div className="voice-screen">
      <VoiceLines idle={idle} lengths={lengths} />
      <div className="voice-screen__orb">
        <MicButton size={140} showIcon={false} />
      </div>
    </div>
  )
}
