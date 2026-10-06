import { ORBIT_RADIUS, WIDGET_SIZE } from '../orbit.js'
import './OrbitItem.css'

// Places a child on the shared orbit at a fixed angle: rotate(angle) · translateX(radius) · rotate(-angle).
// The parent `.rest-screen__orbit` spins; `.orbit-item__upright` counter-rotates in lockstep, so content
// always stays upright (Ferris wheel).
export default function OrbitItem({ angle, radius = ORBIT_RADIUS, size = WIDGET_SIZE, children }) {
  return (
    <div
      className="orbit-item"
      style={{ '--angle': `${angle}deg`, '--orbit-radius': `${radius}px`, width: size, height: size, margin: `${-size / 2}px 0 0 ${-size / 2}px` }}
    >
      <div className="orbit-item__upright">{children}</div>
    </div>
  )
}
