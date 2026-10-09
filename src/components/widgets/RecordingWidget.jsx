import { PlayPause } from '@phosphor-icons/react'
import { orbProps } from '../../theme/theme.js'
import GradientOrb from '../GradientOrb.jsx'

// Gravação (Figma 453:5887): the play/pause icon, 56px, centered on the orb.
export default function RecordingWidget() {
  return (
    <GradientOrb size={180} {...orbProps('recording')}>
      <PlayPause size={56} weight="light" color="currentColor" style={{ position: 'absolute', left: 62, top: 62 }} />
    </GradientOrb>
  )
}
