import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import DeviceDisplay from '../components/DeviceDisplay.jsx'
import DragUpLayer from '../components/DragUpLayer.jsx'
import RestScreen from '../screens/RestScreen.jsx'
import VoiceFlow from '../screens/voice/VoiceFlow.jsx'
import RadialScreen from '../screens/widgets/RadialScreen.jsx'
import HistoryScreen from '../screens/HistoryScreen.jsx'
import ResultScreen from '../screens/voice/ResultScreen.jsx'
import ColorsScreen from '../screens/widgets/ColorsScreen.jsx'
import { enter, exit } from '../transitions.js'
import '../components/FadeIn.css'
import './Stage.css'

const SCREEN_OF = { '/menu': 'menu', '/historico': 'history', '/configuracoes': 'settings', '/configuracoes/cores': 'colors', '/historico/leitura': 'reading', '/home': 'home' }
const ROOT_OF = { home: 'home', menu: 'radial', settings: 'radial', colors: 'colors', history: 'history', reading: 'reading' }
const shares = (a, b) => ROOT_OF[a] === 'radial' && ROOT_OF[b] === 'radial' // Menu <-> Configurações keep the shell

// Rest screen ("/"), Homepage / voice flow ("/home"), Menu ("/menu"), Configurações ("/configuracoes"), Cores
// ("/configuracoes/cores"), Histórico ("/historico") and its reading mode ("/historico/leitura", a saved answer shown in the
// Result's Texto view, silent) share one display.
// The voice flow (Homepage -> recording -> thinking -> result) lives in the Homepage layer, which stays mounted (hidden)
// under the other screens, so closing them returns to the same Result. The rest screen stays mounted underneath, so its
// orbit never restarts.
// Switching between those screens is sequential: the outgoing content leaves (scales down + fades, ~150ms), then the
// incoming content enters (scales in + fades, ~280ms). The display background never fades, so nothing behind is revealed;
// Menu <-> Configurações keep the center circle and the highlighted segment in place and only swap the content.
export default function Stage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [voiceBusy, setVoiceBusy] = useState(false) // drag-up is disabled while a voice session is running
  const [reading, setReading] = useState(null) // the saved answer open in reading mode (set when an item is opened)
  const target = pathname === '/historico/leitura' && !reading ? 'history' : SCREEN_OF[pathname] ?? 'rest'
  const lostReading = pathname === '/historico/leitura' && !reading // e.g. the page was reloaded on this route
  const [shown, setShown] = useState(target)
  const targetRef = useRef(target)
  const shownRef = useRef(target)
  const running = useRef(false)
  const pendingEnter = useRef(null) // { shared } when the next commit must play the enter animation
  const enterDone = useRef(Promise.resolve())
  const stage = useRef(null)
  const rootOf = (screen) => stage.current?.querySelector(`[data-screen-root="${ROOT_OF[screen]}"]`)

  useLayoutEffect(() => {
    // Runs in the same frame as the commit that mounts the incoming content, so it never shows un-animated.
    const p = pendingEnter.current
    if (!p) return
    pendingEnter.current = null
    const root = rootOf(shownRef.current)
    if (root) enterDone.current = enter(root, { shared: p.shared })
  })

  async function go() {
    running.current = true
    stage.current?.setAttribute('data-busy', '')
    await null // leave the layout effect that started us before touching React state
    while (shownRef.current !== targetRef.current) {
      const from = shownRef.current
      const to = targetRef.current
      const animated = from !== 'rest' && to !== 'rest'
      const shared = shares(from, to)
      let out = null
      const root = animated ? rootOf(from) : null
      if (root) {
        out = exit(root, { shared })
        await out.done
      }
      shownRef.current = to
      if (animated) pendingEnter.current = { shared }
      flushSync(() => setShown(to))
      out?.cancel()
      if (animated) await enterDone.current
    }
    stage.current?.removeAttribute('data-busy')
    running.current = false
  }

  // A route change starts the sequence (a change during a sequence is picked up by its loop).
  useLayoutEffect(() => {
    targetRef.current = target
    if (!running.current && shownRef.current !== target) go()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  useEffect(() => {
    if (lostReading) navigate('/historico', { replace: true })
  }, [lostReading, navigate])

  return (
    <DeviceDisplay>
      <div ref={stage} className="stage">
        <RestScreen covered={shown !== 'rest' && shown !== 'home'} onMicClick={() => navigate('/home')} />
        {shown !== 'rest' && (
          <DragUpLayer className="fade-in" enabled={shown === 'home' && !voiceBusy} onClose={() => navigate('/')}>
            <div data-screen-root="home" className={shown === 'home' ? 'stage__flow' : 'stage__flow stage__flow--hidden'}>
              <VoiceFlow onGridClick={() => navigate('/menu')} onBusyChange={setVoiceBusy} />
            </div>
          </DragUpLayer>
        )}
        {(shown === 'menu' || shown === 'settings') && (
          <RadialScreen
            screen={shown}
            onClose={() => navigate('/home')}
            onHistory={() => navigate('/historico')}
            onSettings={() => navigate('/configuracoes')}
            onBack={() => navigate('/menu')}
            onColors={() => navigate('/configuracoes/cores')}
          />
        )}
        {shown === 'colors' && <ColorsScreen onClose={() => navigate('/configuracoes')} />}
        {shown === 'history' && (
          <div data-screen-root="history" className="history-layer">
            <HistoryScreen
              onClose={() => navigate('/menu')}
              onOpen={(entry) => {
                setReading(entry)
                navigate('/historico/leitura')
              }}
            />
          </div>
        )}
        {shown === 'reading' && reading && (
          <div data-screen-root="reading" className="history-layer">
            <ResultScreen result={reading} initialView="texto" onCheck={() => navigate('/historico')} />
          </div>
        )}
      </div>
    </DeviceDisplay>
  )
}
