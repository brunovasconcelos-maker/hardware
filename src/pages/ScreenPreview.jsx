import DeviceDisplay from '../components/DeviceDisplay.jsx'

// Temporary preview wrapper: renders a screen inside the device display.
export default function ScreenPreview({ children }) {
  return <DeviceDisplay>{children}</DeviceDisplay>
}
