import { forwardRef } from 'react'
import './FadeIn.css'

// Full-size wrapper that fades its content in on mount (route transitions).
const FadeIn = forwardRef(function FadeIn({ children }, ref) {
  return <div ref={ref} className="fade-in">{children}</div>
})
export default FadeIn
