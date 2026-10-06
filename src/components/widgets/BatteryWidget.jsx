import { BatteryHigh, WifiHigh } from '@phosphor-icons/react'
import { orbProps } from '../../theme/theme.js'
import GradientOrb from '../GradientOrb.jsx'

export default function BatteryWidget() {
  return (
    <GradientOrb size={180} {...orbProps('battery')}>
      <BatteryHigh size={56} weight="light" color="currentColor" style={{ position: 'absolute', left: 62, top: 29 }} />
      <WifiHigh size={56} weight="light" color="currentColor" style={{ position: 'absolute', left: 62, top: 95 }} />
    </GradientOrb>
  )
}
