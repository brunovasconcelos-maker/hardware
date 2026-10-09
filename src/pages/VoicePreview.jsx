import { useSearchParams } from 'react-router-dom'
import DeviceDisplay from '../components/DeviceDisplay.jsx'
import RecordingScreen from '../screens/voice/RecordingScreen.jsx'
import ThinkingScreen from '../screens/voice/ThinkingScreen.jsx'
import ResultScreen from '../screens/voice/ResultScreen.jsx'

// Temporary preview routes for the voice-mode screens (visual only). Thinking accepts ?frame=1|2|3.
export function VoiceIdlePreview() {
  return <DeviceDisplay><RecordingScreen idle /></DeviceDisplay>
}

export function VoiceRecordingPreview() {
  return <DeviceDisplay><RecordingScreen /></DeviceDisplay>
}

export function VoiceThinkingPreview() {
  const [params] = useSearchParams()
  const frame = Math.min(3, Math.max(1, Number(params.get('frame')) || 1))
  return <DeviceDisplay><ThinkingScreen frame={frame} /></DeviceDisplay>
}

export function VoiceResultPreview({ view = 'personagem' }) {
  return <DeviceDisplay><ResultScreen key={view} initialView={view} /></DeviceDisplay>
}
