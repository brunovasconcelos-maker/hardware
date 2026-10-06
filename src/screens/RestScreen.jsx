import OrbitItem from '../components/OrbitItem.jsx'
import MicButton from '../components/MicButton.jsx'
import TasksWidget from '../components/widgets/TasksWidget.jsx'
import WeatherWidget from '../components/widgets/WeatherWidget.jsx'
import UsageWidget from '../components/widgets/UsageWidget.jsx'
import CalendarWidget from '../components/widgets/CalendarWidget.jsx'
import BatteryWidget from '../components/widgets/BatteryWidget.jsx'
import ClockWidget from '../components/widgets/ClockWidget.jsx'
import { ORBIT_ANGLES } from '../orbit.js'
import './RestScreen.css'

// "Tela de Descanso": microphone in the center, six widgets on a shared circular orbit.
export default function RestScreen() {
  return (
    <div className="rest-screen">
      <div className="rest-screen__orbit">
        <OrbitItem angle={ORBIT_ANGLES.tasks}><TasksWidget /></OrbitItem>
        <OrbitItem angle={ORBIT_ANGLES.weather}><WeatherWidget /></OrbitItem>
        <OrbitItem angle={ORBIT_ANGLES.usage}><UsageWidget /></OrbitItem>
        <OrbitItem angle={ORBIT_ANGLES.calendar}><CalendarWidget /></OrbitItem>
        <OrbitItem angle={ORBIT_ANGLES.battery}><BatteryWidget /></OrbitItem>
        <OrbitItem angle={ORBIT_ANGLES.clock}><ClockWidget /></OrbitItem>
      </div>
      <div className="rest-screen__mic">
        <MicButton />
      </div>
    </div>
  )
}
