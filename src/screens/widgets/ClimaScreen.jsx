import { Cloud } from '@phosphor-icons/react'
import FullGradient from '../FullGradient.jsx'
import { weatherGradient } from '../gradients.js'
import '../screens.css'

// Clima (Figma 107:1626).
export default function ClimaScreen({ temperature = 21, city = 'São Paulo, SP' }) {
  return (
    <FullGradient gradient={weatherGradient} duration={20.5} phase={0.8}>
      <div className="weather-screen">
        <Cloud size={120} weight="regular" color="#ffffff" />
        <div className="weather-screen__text">
          <p className="weather-screen__temp">{temperature}°C</p>
          <p className="weather-screen__city">{city}</p>
        </div>
      </div>
    </FullGradient>
  )
}
