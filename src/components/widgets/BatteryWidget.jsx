import { BatteryHigh, WifiHigh } from '@phosphor-icons/react'
import GradientOrb from '../GradientOrb.jsx'

const layers = [
  { type: 'radial', at: '30% 82%', size: '48%', stops: [['#86d0e4', '0%'], ['rgba(134,208,228,0)', '100%']] },
  { type: 'radial', at: '70% 45%', size: '36%', stops: [['#6a98e6', '0%'], ['rgba(106,152,230,0)', '100%']] },
  { type: 'linear', angle: '180deg', stops: [['#0511d6', '0%'], ['#0a1ed9', '38%'], ['#2f66dc', '58%'], ['#4ea6dd', '85%'], ['#3a8cdc', '100%']] },
]

export default function BatteryWidget() {
  return (
    <GradientOrb size={180} duration={20} phase={0.7} base="#2a60dc" layers={layers}>
      <BatteryHigh size={56} weight="light" color="#ffffff" style={{ position: 'absolute', left: 62, top: 29 }} />
      <WifiHigh size={56} weight="light" color="#ffffff" style={{ position: 'absolute', left: 62, top: 95 }} />
    </GradientOrb>
  )
}
