import './DeviceDisplay.css'

export default function DeviceDisplay({ children }) {
  return (
    <div className="device-display" onDragStart={(e) => e.preventDefault()}>
      {children}
    </div>
  )
}
