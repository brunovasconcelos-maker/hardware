import GradientOrb from '../components/GradientOrb.jsx'
import { orbProps } from '../theme/theme.js'

// Full-screen (650x650) animated gradient surface; children are positioned in Figma coordinates.
export default function FullGradient({ orb, duration, phase, children }) {
  return (
    <GradientOrb size={650} {...orbProps(orb)} duration={duration} phase={phase}>
      {children}
    </GradientOrb>
  )
}
