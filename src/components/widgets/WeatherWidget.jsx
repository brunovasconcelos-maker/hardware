import { orbProps } from '../../theme/theme.js'
import GradientOrb from '../GradientOrb.jsx'
import './widgets.css'

export default function WeatherWidget({ temperature = 21 }) {
  return (
    <GradientOrb size={180} {...orbProps('weather')}>
      <p className="weather-widget__temp">{temperature}°</p>
    </GradientOrb>
  )
}
