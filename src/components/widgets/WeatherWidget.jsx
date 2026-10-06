import GradientOrb from '../GradientOrb.jsx'
import './widgets.css'

const layers = [
  { type: 'radial', at: '30% 18%', size: '45%', stops: [['#f2e6cc', '0%'], ['rgba(242,230,204,0)', '100%']] },
  { type: 'radial', at: '12% 58%', size: '48%', stops: [['#d4663c', '0%'], ['rgba(212,102,60,0)', '100%']] },
  { type: 'radial', at: '72% 52%', size: '42%', stops: [['#c24ac8', '0%'], ['rgba(194,74,200,0)', '100%']] },
  { type: 'radial', at: '88% 18%', size: '40%', stops: [['#c07cc4', '0%'], ['rgba(192,124,196,0)', '100%']] },
  { type: 'radial', at: '50% 105%', size: '55%', stops: [['#d27a8e', '0%'], ['rgba(210,122,142,0)', '100%']] },
]

export default function WeatherWidget({ temperature = 21 }) {
  return (
    <GradientOrb size={180} base="#cc9aa6" layers={layers}>
      <p className="weather-widget__temp">{temperature}°</p>
    </GradientOrb>
  )
}
