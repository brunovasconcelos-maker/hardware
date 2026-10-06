import { ORBIT_RADIUS, WIDGET_SIZE } from '../orbit.js'
import './OrbitItem.css'

// Places a child on the shared orbit. Position = rotate(angle) · translateX(radius) · rotate(-angle),
// so content stays upright. A parent can add `--orbit-rotation` to spin every item around the center.
export default function OrbitItem({ angle, radius = ORBIT_RADIUS, size = WIDGET_SIZE, children }) {
  return (
    <div
      className="orbit-item"
      style={{ '--base-angle': `${angle}deg`, '--orbit-radius': `${radius}px`, width: size, height: size, margin: `${-size / 2}px 0 0 ${-size / 2}px` }}
    >
      {children}
    </div>
  )
}
