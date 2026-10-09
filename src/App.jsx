import { Routes, Route } from 'react-router-dom'
import Stage from './pages/Stage.jsx'
import SideControls from './components/SideControls.jsx'
import ScreenPreview from './pages/ScreenPreview.jsx'
import { VoiceIdlePreview, VoiceRecordingPreview, VoiceThinkingPreview, VoiceResultPreview } from './pages/VoicePreview.jsx'
import GravacaoScreen from './screens/recording/GravacaoScreen.jsx'
import GravandoScreen from './screens/recording/GravandoScreen.jsx'
import PausadoScreen from './screens/recording/PausadoScreen.jsx'
import WidgetViewer from './components/WidgetViewer.jsx'
import { WIDGET_VIEWS } from './screens/widgetViews.jsx'

// Temporary preview routes: each widget's full-screen view (swipe sideways to change page).
// [path, widget view, first page]
const PREVIEW_ROUTES = [
  ['/widget/bateria', 'battery', 0],
  ['/widget/wifi', 'battery', 1],
  ['/widget/tarefas', 'tasks', 0],
  ['/widget/clima', 'weather', 0],
  ['/widget/calendario', 'calendar', 0],
  ['/widget/hora-a', 'clock', 0],
  ['/widget/hora-b', 'clock', 1],
]

export default function App() {
  return (
    <>
      <SideControls />
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
        <Route path="/widget/gravacao" element={<ScreenPreview><GravacaoScreen /></ScreenPreview>} />
        <Route path="/widget/gravacao/gravando" element={<ScreenPreview><GravandoScreen /></ScreenPreview>} />
        <Route path="/widget/gravacao/pausado" element={<ScreenPreview><PausadoScreen /></ScreenPreview>} />
        <Route path="/voz/idle" element={<VoiceIdlePreview />} />
        <Route path="/voz/gravando" element={<VoiceRecordingPreview />} />
        <Route path="/voz/pensando" element={<VoiceThinkingPreview />} />
        <Route path="/voz/resultado" element={<VoiceResultPreview />} />
        <Route path="/voz/resultado/texto" element={<VoiceResultPreview view="texto" />} />
        <Route path="/historico" element={<Stage />} />
        <Route path="/configuracoes" element={<Stage />} />
        <Route path="/configuracoes/cores" element={<Stage />} />
        <Route path="*" element={<Stage />} />
      </Routes>
    </>
  )
}
