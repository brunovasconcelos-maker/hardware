import { Routes, Route } from 'react-router-dom'
import Stage from './pages/Stage.jsx'
import ThemeSelector from './components/ThemeSelector.jsx'
import ScreenPreview from './pages/ScreenPreview.jsx'
import { VoiceIdlePreview, VoiceRecordingPreview, VoiceThinkingPreview, VoiceResultPreview } from './pages/VoicePreview.jsx'
import WidgetViewer from './components/WidgetViewer.jsx'
import { WIDGET_VIEWS } from './screens/widgetViews.jsx'

// Temporary preview routes: each widget's full-screen view (swipe sideways to change page).
// [path, widget view, first page]
const PREVIEW_ROUTES = [
  ['/widget/bateria', 'battery', 0],
  ['/widget/wifi', 'battery', 1],
  ['/widget/tarefas', 'tasks', 0],
  ['/widget/usage-semanal', 'usage', 0],
  ['/widget/usage-diario', 'usage', 1],
  ['/widget/clima', 'weather', 0],
  ['/widget/calendario', 'calendar', 0],
  ['/widget/hora-a', 'clock', 0],
  ['/widget/hora-b', 'clock', 1],
]

export default function App() {
  return (
    <>
      <ThemeSelector />
      <Routes>
        <Route path="/" element={<Stage />} />
        <Route path="/home" element={<Stage />} />
        <Route path="/menu" element={<Stage />} />
        {PREVIEW_ROUTES.map(([path, view, page]) => (
          <Route
            key={path}
            path={path}
            element={
              <ScreenPreview>
                <WidgetViewer key={path} pageCount={WIDGET_VIEWS[view].pageCount} initialIndex={page} renderPage={WIDGET_VIEWS[view].renderPage} />
              </ScreenPreview>
            }
          />
        ))}
        <Route path="/voz/idle" element={<VoiceIdlePreview />} />
        <Route path="/voz/gravando" element={<VoiceRecordingPreview />} />
        <Route path="/voz/pensando" element={<VoiceThinkingPreview />} />
        <Route path="/voz/resultado" element={<VoiceResultPreview />} />
        <Route path="*" element={<Stage />} />
      </Routes>
    </>
  )
}
