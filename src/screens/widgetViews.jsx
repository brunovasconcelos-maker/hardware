import TarefasScreen from './widgets/TarefasScreen.jsx'
import ClimaScreen from './widgets/ClimaScreen.jsx'
import BateriaScreen from './widgets/BateriaScreen.jsx'
import WifiScreen from './widgets/WifiScreen.jsx'
import GravacaoScreen from './recording/GravacaoScreen.jsx'
import CalendarioScreen from './widgets/CalendarioScreen.jsx'
import HoraAScreen from './widgets/HoraAScreen.jsx'
import HoraBScreen from './widgets/HoraBScreen.jsx'

// Month `offset` months away from the current one (0 = current month).
function monthAt(offset) {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  return { month: d.getMonth() + 1, year: d.getFullYear() }
}

// Full-screen content for each rest-screen widget. Multi-page widgets are carousels; pages hide their own
// dots because the viewer draws one shared indicator.
export const WIDGET_VIEWS = {
  tasks: { label: 'Tarefas', pageCount: 1, renderPage: () => <TarefasScreen /> },
  weather: { label: 'Clima', pageCount: 1, renderPage: () => <ClimaScreen /> },
  battery: {
    label: 'Bateria e Wi-fi',
    pageCount: 2,
    renderPage: (i) => (i === 0 ? <BateriaScreen showDots={false} /> : <WifiScreen showDots={false} />),
  },
  recording: { label: 'Gravação', pageCount: 1, renderPage: () => <GravacaoScreen /> },
  clock: {
    label: 'Hora',
    pageCount: 2,
    renderPage: (i) => (i === 0 ? <HoraAScreen showDots={false} /> : <HoraBScreen showDots={false} />),
  },
  calendar: {
    label: 'Calendário',
    pageCount: Infinity,
    renderPage: (i) => <CalendarioScreen {...monthAt(i)} />,
  },
}
