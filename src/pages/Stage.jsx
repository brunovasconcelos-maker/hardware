import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DeviceDisplay from '../components/DeviceDisplay.jsx'
import DragUpLayer from '../components/DragUpLayer.jsx'
import RestScreen from '../screens/RestScreen.jsx'
import VoiceFlow from '../screens/voice/VoiceFlow.jsx'
import MenuScreen from '../screens/widgets/MenuScreen.jsx'
import HistoryScreen from '../screens/HistoryScreen.jsx'
import '../components/FadeIn.css'

// Rest screen ("/"), Homepage / voice flow ("/home"), Menu ("/menu") and Histórico ("/historico") share one display.
// The voice flow (Homepage -> recording -> thinking -> result) lives in the Homepage layer, so opening the Menu from the
// Result and closing it returns to the Result (the layer, and its state, stay mounted). The rest screen stays mounted
// underneath, so it is visible behind the Homepage while it is dragged up, and its orbit never restarts.
export default function Stage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [voiceBusy, setVoiceBusy] = useState(false) // drag-up is disabled while a voice session is running
  const screen = pathname === '/menu' ? 'menu' : pathname === '/historico' ? 'history' : pathname === '/home' ? 'home' : 'rest'

  return (
    <DeviceDisplay>
      <RestScreen onMicClick={() => navigate('/home')} />
      {screen !== 'rest' && (
        <DragUpLayer className="fade-in" enabled={screen === 'home' && !voiceBusy} onClose={() => navigate('/')}>
          <VoiceFlow onGridClick={() => navigate('/menu')} onBusyChange={setVoiceBusy} />
        </DragUpLayer>
      )}
      {screen === 'menu' && <MenuScreen onClose={() => navigate('/home')} onHistory={() => navigate('/historico')} />}
      {screen === 'history' && (
        <div className="fade-in history-layer">
          <HistoryScreen onClose={() => navigate('/menu')} />
        </div>
      )}
    </DeviceDisplay>
  )
}
