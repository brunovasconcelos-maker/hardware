import { Microphone } from '@phosphor-icons/react'
import GradientOrb from './GradientOrb.jsx'
import { orbProps } from '../theme/theme.js'

export default function MicButton({ size = 180, showIcon = true, style }) {
  return (
    <GradientOrb size={size} duration={15} phase={0.9} {...orbProps('mic')} style={style}>
      {showIcon && <Microphone size={size / 3} weight="light" color="currentColor" style={{ position: 'absolute', left: size / 3, top: size / 3 }} />}
    </GradientOrb>
  )
}
