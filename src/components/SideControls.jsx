import ThemeSelector from './ThemeSelector.jsx'
import ModeSelector from './ModeSelector.jsx'
import './SideControls.css'

// Both selector capsules as one group: fixed 24px from the left edge of the page, vertically centered, 16px apart.
export default function SideControls() {
  return (
    <div className="side-controls">
      <ThemeSelector />
      <ModeSelector />
    </div>
  )
}
