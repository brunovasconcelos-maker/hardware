import { Microphone } from '@phosphor-icons/react'
import GradientOrb from './GradientOrb.jsx'

const layers = [
  { type: 'radial', at: '100% 0%', size: '75%', stops: [['#8a06d6', '0%'], ['rgba(138,6,214,0)', '100%']] },
  { type: 'radial', at: '100% 100%', size: '70%', stops: [['#c0c870', '0%'], ['rgba(192,200,112,0)', '100%']] },
  { type: 'radial', at: '0% 0%', size: '55%', stops: [['#566a6c', '0%'], ['rgba(86,106,108,0)', '100%']] },
  { type: 'linear', angle: '225deg', stops: [['#8f12cf', '0%'], ['#9a50b8', '30%'], ['#a2b392', '55%'], ['#aec598', '100%']] },
]

export default function MicButton({ size = 180 }) {
  return (
    <GradientOrb size={size} duration={15} phase={0.9} base="#9ba389" layers={layers}>
      <Microphone size={size / 3} weight="light" color="#ffffff" style={{ position: 'absolute', left: size / 3, top: size / 3 }} />
    </GradientOrb>
  )
}
