import { Cloud } from '@phosphor-icons/react'
import FullGradient from '../FullGradient.jsx'
import '../screens.css'

// Clima (Figma 107:1626).
export default function ClimaScreen({ temperature = 21, city = 'São Paulo, SP' }) {
  return (
    <FullGradient orb="weatherFull">
      <div className="weather-screen">
        <Cloud size={120} weight="regular" color="currentColor" />
        <div className="weather-screen__text">
          <p className="weather-screen__temp">{temperature}°C</p>
          <p className="weather-screen__city">{city}</p>
        </div>
      </div>
    </FullGradient>
  )
}
