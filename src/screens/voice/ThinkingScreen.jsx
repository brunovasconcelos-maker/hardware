import ThinkingShapes from '../../components/ThinkingShapes.jsx'
import './voice.css'

// Thinking (Figma 140:1998, 140:2003, 140:2008): three pills whose heights alternate between 3 frames.
export default function ThinkingScreen({ frame = 1, heights }) {
  return (
    <div className="voice-screen">
      <ThinkingShapes frame={frame} heights={heights} />
    </div>
  )
}
