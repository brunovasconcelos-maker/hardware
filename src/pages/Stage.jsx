import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DeviceDisplay from '../components/DeviceDisplay.jsx'
import DragUpLayer from '../components/DragUpLayer.jsx'
import RestScreen from '../screens/RestScreen.jsx'
import VoiceFlow from '../screens/voice/VoiceFlow.jsx'
import MenuScreen from '../screens/widgets/MenuScreen.jsx'
import HistoryScreen from '../screens/HistoryScreen.jsx'
import SettingsScreen from '../screens/widgets/SettingsScreen.jsx'
import ColorsScreen from '../screens/widgets/ColorsScreen.jsx'
import '../components/FadeIn.css'

// Rest screen ("/"), Homepage / voice flow ("/home"), Menu ("/menu"), Histórico ("/historico"), Configurações ("/configuracoes") and Cores ("/configuracoes/cores") share one display.
// The voice flow (Homepage -> recording -> thinking -> result) lives in the Homepage layer, so opening the Menu from the
// Result and closing it returns to the Result (the layer, and its state, stay mounted). The rest screen stays mounted
// underneath, so it is visible behind the Homepage while it is dragged up, and its orbit never restarts.
export default function Stage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [voiceBusy, setVoiceBusy] = useState(false) // drag-up is disabled while a voice session is running
  const screen = { '/menu': 'menu', '/historico': 'history', '/configuracoes': 'settings', '/configuracoes/cores': 'colors', '/home': 'home' }[pathname] ?? 'rest'

  return (
    <DeviceDisplay>
      <RestScreen onMicClick={() => navigate('/home')} />
      {screen !== 'rest' && (
        <DragUpLayer className="fade-in" enabled={screen === 'home' && !voiceBusy} onClose={() => navigate('/')}>
          <VoiceFlow onGridClick={() => navigate('/menu')} onBusyChange={setVoiceBusy} />
        </DragUpLayer>
      )}
      {screen === 'menu' && <MenuScreen onClose={() => navigate('/home')} onHistory={() => navigate('/historico')} onSettings={() => navigate('/configuracoes')} />}
      {screen === 'settings' && <SettingsScreen onBack={() => navigate('/menu')} onColors={() => navigate('/configuracoes/cores')} />}
      {screen === 'colors' && <ColorsScreen onClose={() => navigate('/configuracoes')} />}
      {screen === 'history' && (
        <div className="fade-in history-layer">
          <HistoryScreen onClose={() => navigate('/menu')} />
        </div>
      )}
    </DeviceDisplay>
  )
}
