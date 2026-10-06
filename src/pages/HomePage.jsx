import DeviceDisplay from '../components/DeviceDisplay.jsx'
import FadeIn from '../components/FadeIn.jsx'
import HomeScreen from '../screens/widgets/HomeScreen.jsx'
import { useFadeNavigate } from '../hooks/useFadeNavigate.js'

// Homepage route ("/home"). The grid icon fades back to the rest screen.
export default function HomePage() {
  const [ref, go] = useFadeNavigate()
  return (
    <DeviceDisplay>
      <FadeIn ref={ref}>
        <HomeScreen onGridClick={() => go('/')} />
      </FadeIn>
    </DeviceDisplay>
  )
}
