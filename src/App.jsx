import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ScreenPreview from './pages/ScreenPreview.jsx'
import HomeScreen from './screens/widgets/HomeScreen.jsx'
import BateriaScreen from './screens/widgets/BateriaScreen.jsx'
import WifiScreen from './screens/widgets/WifiScreen.jsx'
import TarefasScreen from './screens/widgets/TarefasScreen.jsx'
import UsageSemanalScreen from './screens/widgets/UsageSemanalScreen.jsx'
import UsageDiarioScreen from './screens/widgets/UsageDiarioScreen.jsx'
import ClimaScreen from './screens/widgets/ClimaScreen.jsx'
import CalendarioScreen from './screens/widgets/CalendarioScreen.jsx'
import HoraAScreen from './screens/widgets/HoraAScreen.jsx'
import HoraBScreen from './screens/widgets/HoraBScreen.jsx'

// Temporary visual-preview routes for the full-screen views (no interactions yet).
const PREVIEW_ROUTES = [
  ['/home', HomeScreen],
  ['/widget/bateria', BateriaScreen],
  ['/widget/wifi', WifiScreen],
  ['/widget/tarefas', TarefasScreen],
  ['/widget/usage-semanal', UsageSemanalScreen],
  ['/widget/usage-diario', UsageDiarioScreen],
  ['/widget/clima', ClimaScreen],
  ['/widget/calendario', CalendarioScreen],
  ['/widget/hora-a', HoraAScreen],
  ['/widget/hora-b', HoraBScreen],
]

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {PREVIEW_ROUTES.map(([path, Screen]) => (
        <Route key={path} path={path} element={<ScreenPreview><Screen /></ScreenPreview>} />
      ))}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
