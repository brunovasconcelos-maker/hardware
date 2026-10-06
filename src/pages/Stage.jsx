import { useLocation, useNavigate } from 'react-router-dom'
import DeviceDisplay from '../components/DeviceDisplay.jsx'
import DragUpLayer from '../components/DragUpLayer.jsx'
import RestScreen from '../screens/RestScreen.jsx'
import HomeScreen from '../screens/widgets/HomeScreen.jsx'
import MenuScreen from '../screens/widgets/MenuScreen.jsx'
import '../components/FadeIn.css'

// Rest screen ("/"), Homepage ("/home") and Menu ("/menu") share one display. The rest screen stays mounted
// underneath, so it is visible behind the Homepage while it is dragged up, and its orbit never restarts.
export default function Stage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const screen = pathname === '/menu' ? 'menu' : pathname === '/home' ? 'home' : 'rest'

  return (
    <DeviceDisplay>
      <RestScreen onMicClick={() => navigate('/home')} />
      {screen !== 'rest' && (
        <DragUpLayer className="fade-in" enabled={screen === 'home'} onClose={() => navigate('/')}>
          <HomeScreen onGridClick={() => navigate('/menu')} />
        </DragUpLayer>
      )}
      {screen === 'menu' && <MenuScreen onClose={() => navigate('/home')} />}
    </DeviceDisplay>
  )
}
