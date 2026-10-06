import GradientOrb from '../components/GradientOrb.jsx'

// Full-screen (650x650) animated gradient surface; children are positioned in Figma coordinates.
export default function FullGradient({ gradient, duration, phase, children }) {
  return (
    <GradientOrb size={650} base={gradient.base} layers={gradient.layers} duration={duration} phase={phase}>
      {children}
    </GradientOrb>
  )
}
