import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { Microphone, CirclesFour } from '@phosphor-icons/react'
import MicButton from '../../components/MicButton.jsx'
import VoiceLines from '../../components/VoiceLines.jsx'
import ThinkingShapes, { THINKING_FRAMES } from '../../components/ThinkingShapes.jsx'
import WidgetHit from '../../components/WidgetHit.jsx'
import ResultScreen from './ResultScreen.jsx'
import { VOICE_RESULTS } from '../../mocks/voiceResults.js'
import { FIGMA_LENGTHS } from '../../components/voiceSpokes.js'
import { createVoiceSimulator } from '../../voiceSim.js'
import { speakResult, cancelSpeech } from '../../speech.js'
import { saveToHistory } from '../../history.js'
import { run, dur, prefersReducedMotion } from '../../motion.js'
import '../screens.css'
import './voice.css'
import './voiceFlow.css'

// Timings (ms)
const START_MS = 400 // Homepage -> recording look
const DOTS_HOLD_MS = 1000 // dots stay still before the fake voice starts
const SEND_MS = 550 // lines shrink + orb disappears + thinking shapes appear
const THINK_MS = 3500 // thinking loop
const THINK_SEGMENT_MS = THINK_MS / 6 // two full loops through the 3 Figma frames
const RESULT_FADE_MS = 400
const LEAVE_MS = 250 // Result fades out…
const HOME_FADE_MS = 350 // …and the Homepage fades in

const ORB_HOME = 240
const ORB_REC = 140
const MIN_LEN = 0.01

const ease = (x) => x * x * (3 - 2 * x) // smoothstep
const lerp = (a, b, t) => a + (b - a) * t
const sizeKf = (a, b) => [{ width: `${a}px`, height: `${a}px` }, { width: `${b}px`, height: `${b}px` }]
const fade = (a, b) => [{ opacity: a }, { opacity: b }]

// Heights of the 3 thinking pills at time `ms`: smooth interpolation through the 3 Figma frames (looping).
function thinkingHeights(ms) {
  const p = ms / THINK_SEGMENT_MS
  const i = Math.floor(p)
  const f = ease(p - i)
  const a = THINKING_FRAMES[i % 3]
  const b = THINKING_FRAMES[(i + 1) % 3]
  return a.map((v, k) => lerp(v, b[k], f))
}

// Simulated voice mode on the Homepage layer. Phases:
//  home -> starting (400ms) -> idle (dots, 1s) -> recording (fake voice) -> sending -> thinking (3.5s) -> result
//  result -> leaving (OK) -> home
// Visual design comes from the Homepage / recording / thinking / result screens; this component only animates them.
export default function VoiceFlow({ name = 'Bruno', result = VOICE_RESULTS[0], onGridClick, onBusyChange }) {
  const [phase, setPhase] = useState('home')
  const prevPhase = useRef(null)
  const homeUi = useRef(null)
  const orb = useRef(null)
  const icon = useRef(null)
  const linesWrap = useRef(null)
  const lines = useRef(null)
  const shapesWrap = useRef(null)
  const shapes = useRef(null)
  const resultWrap = useRef(null)
  const lengths = useRef(FIGMA_LENGTHS.map(() => MIN_LEN))
  const sim = useRef(null)

  const inHome = phase === 'home'
  const orbSize = inHome ? ORB_HOME : phase === 'starting' || phase === 'idle' || phase === 'recording' ? ORB_REC : 0
  const showLines = phase === 'starting' || phase === 'idle' || phase === 'recording'
  const showShapes = phase === 'sending' || phase === 'thinking'
  const showResult = phase === 'result' || phase === 'leaving'

  useEffect(() => {
    onBusyChange?.(phase !== 'home')
    return () => onBusyChange?.(false)
  }, [phase, onBusyChange])

  // Speech: starts when the result appears and stops when it is left (OK) or the flow unmounts.
  useEffect(() => {
    if (phase !== 'result') return undefined
    const speech = speakResult(result)
    return () => speech.cancel()
  }, [phase, result])

  // Phase transitions (Web Animations for the fades/resizes; rAF for the per-frame line / pill animation).
  useLayoutEffect(() => {
    const before = prevPhase.current
    prevPhase.current = phase
    const anims = []
    let cancelled = false
    let timer = 0
    let raf = 0
    const A = (el, keyframes, ms, opts = {}) => {
      if (!el) return Promise.resolve()
      const { anim, done } = run(el, keyframes, { duration: dur(ms), easing: 'ease-in-out', ...opts })
      anims.push(anim)
      return done
    }
    const then = (p, fn) => p.then(() => !cancelled && fn())
    const frames = (fn) => {
      let last = performance.now()
      const t0 = last
      const tick = (now) => {
        if (cancelled) return
        const dt = (now - last) / 1000
        last = now
        if (fn(now - t0, dt) !== false) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const setLines = (values) => {
      lengths.current = values
      lines.current?.setLengths(values)
    }

    switch (phase) {
      case 'home': {
        setLines(FIGMA_LENGTHS.map(() => MIN_LEN))
        shapes.current?.setHeights(THINKING_FRAMES[0])
        if (before === 'leaving') {
          A(homeUi.current, fade(0, 1), HOME_FADE_MS)
          A(orb.current, fade(0, 1), HOME_FADE_MS)
          A(icon.current, fade(0, 1), HOME_FADE_MS)
        }
        break
      }
      case 'starting': {
        const all = [
          A(homeUi.current, fade(1, 0), START_MS),
          A(orb.current, sizeKf(ORB_HOME, ORB_REC), START_MS),
          A(icon.current, fade(1, 0), START_MS * 0.6),
          A(linesWrap.current, fade(0, 1), START_MS),
        ]
        then(Promise.all(all), () => setPhase('idle'))
        break
      }
      case 'idle': {
        timer = setTimeout(() => !cancelled && setPhase('recording'), DOTS_HOLD_MS)
        break
      }
      case 'recording': {
        if (prefersReducedMotion()) {
          setLines(FIGMA_LENGTHS) // static, calm pattern instead of animated speech
          break
        }
        sim.current = createVoiceSimulator({ min: MIN_LEN })
        frames((_, dt) => setLines(sim.current.step(dt)))
        break
      }
      case 'sending': {
        const from = [...lengths.current]
        const SHRINK_MS = 300
        if (!prefersReducedMotion()) {
          frames((ms) => {
            const t = Math.min(1, ms / SHRINK_MS)
            setLines(from.map((v) => lerp(v, MIN_LEN, ease(t))))
            return t < 1
          })
        } else {
          setLines(from.map(() => MIN_LEN))
        }
        const all = [
          A(linesWrap.current, fade(1, 0), SHRINK_MS, { easing: 'ease-in' }),
          A(orb.current, sizeKf(ORB_REC, 0), SEND_MS * 0.8, { easing: 'ease-in' }),
          A(shapesWrap.current, [{ opacity: 0, transform: 'scale(0.6)' }, { opacity: 1, transform: 'scale(1)' }], SEND_MS * 0.45, { easing: 'ease-out', delay: dur(SEND_MS * 0.55), fill: 'backwards' }),
        ]
        then(Promise.all(all), () => setPhase('thinking'))
        break
      }
      case 'thinking': {
        if (prefersReducedMotion()) {
          timer = setTimeout(() => !cancelled && setPhase('result'), THINK_MS)
          break
        }
        frames((ms) => {
          if (ms >= THINK_MS) {
            shapes.current?.setHeights(THINKING_FRAMES[0])
            setPhase('result')
            return false
          }
          shapes.current?.setHeights(thinkingHeights(ms))
          return true
        })
        break
      }
      case 'result': {
        A(shapesWrap.current, fade(1, 0), RESULT_FADE_MS * 0.75)
        A(resultWrap.current, fade(0, 1), RESULT_FADE_MS, { easing: 'ease-out' })
        break
      }
      case 'leaving': {
        then(A(resultWrap.current, fade(1, 0), LEAVE_MS, { fill: 'forwards' }), () => setPhase('home'))
        break
      }
      default:
    }

    return () => {
      cancelled = true
      clearTimeout(timer)
      cancelAnimationFrame(raf)
      anims.forEach((a) => a.cancel())
    }
  }, [phase])

  const onOrbClick = () => {
    if (phase === 'home') setPhase('starting')
    else if (phase === 'recording') setPhase('sending')
  }

  const onOk = () => {
    if (phase !== 'result') return
    cancelSpeech() // stop reading immediately
    saveToHistory(result)
    setPhase('leaving')
  }

  const orbClickable = phase === 'home' || phase === 'recording'

  return (
    <div className="home-screen voice-flow" data-phase={phase}>
      <div ref={homeUi} className="voice-flow__home-ui" style={{ opacity: inHome ? 1 : 0, pointerEvents: inHome ? 'auto' : 'none' }} aria-hidden={!inHome}>
        <p className="home-screen__greeting">Olá, {name}</p>
        <p className="home-screen__prompt">Como posso ajudar?</p>
        <WidgetHit label="Abrir menu" className="home-screen__grid-hit" onActivate={() => onGridClick?.()}>
          <CirclesFour className="home-screen__grid" size={56} weight="regular" color="rgba(255,255,255,0.5)" />
        </WidgetHit>
      </div>

      <div ref={linesWrap} className="voice-flow__layer" style={{ opacity: showLines ? 1 : 0 }}>
        <VoiceLines ref={lines} idle />
      </div>

      <div ref={orb} className="voice-flow__orb" style={{ width: orbSize, height: orbSize, visibility: orbSize ? 'visible' : 'hidden', pointerEvents: orbClickable ? 'auto' : 'none' }}>
        <WidgetHit label={phase === 'recording' ? 'Enviar' : 'Falar'} className="voice-flow__orb-hit" onActivate={onOrbClick}>
          <MicButton size={ORB_HOME} showIcon={false} style={{ width: '100%', height: '100%' }} />
        </WidgetHit>
      </div>
      <Microphone ref={icon} className="voice-flow__icon" size={80} weight="light" color="#ffffff" style={{ opacity: inHome ? 1 : 0 }} />

      <div ref={shapesWrap} className="voice-flow__layer" style={{ opacity: showShapes ? 1 : 0 }}>
        <ThinkingShapes ref={shapes} frame={1} />
      </div>

      {showResult && (
        <div ref={resultWrap} className="voice-flow__result">
          <ResultScreen result={result} onGridClick={() => onGridClick?.()} onOkClick={onOk} />
        </div>
      )}
    </div>
  )
}
