import { useRef, useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Play, Check } from '@phosphor-icons/react'
import Waveform from '../../components/Waveform.jsx'
import WidgetHit from '../../components/WidgetHit.jsx'
import GravacaoScreen from './GravacaoScreen.jsx'
import { SAMPLE_BARS } from './GravandoScreen.jsx'
import { createVoiceSimulator } from '../../voiceSim.js'
import { swapContent } from '../../transitions.js'
import { prefersReducedMotion } from '../../motion.js'
import './recording.css'
import '../screens.css'

// Simulated recording flow inside the Gravação full-screen view (no microphone, no audio, nothing is stored):
//   start (Tela 1) -> recording (Tela 2) -> collapsing -> paused (Tela 3) -> expanding -> recording ... -> check closes it.
// `onStageChange(stage)` tells the parent which stage is on screen (it only allows the drag-up close on 'start'); `onFinish()` asks
// the parent to close the view (the shrink-to-widget animation). Unmounting resets everything, so a new opening starts at Tela 1.
const SLOTS = 21 // 14px slots left of the playhead
const PITCH = 14
const SAMPLE_MS = 90 // a new bar every 90ms: ~155px/s of scroll
const COLLAPSE_MS = 250
const MIN_H = 14
const MAX_H = 190 // Figma's tallest bar

const pad = (n) => String(n).padStart(2, '0')
const clock = (ms) => {
  const s = Math.floor(ms / 1000)
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`
}
const ease = (x) => x * x * (3 - 2 * x)
const INITIAL = Array(SLOTS + 1).fill(6) // dots; the extra, newest slot is born under the playhead

export default function RecordingFlow({ onStageChange, onFinish }) {
  const [stage, setStage] = useState('start') // 'start' | 'recording' | 'collapsing' | 'paused' | 'expanding'
  const [text, setText] = useState('00:00:00')
  const stageRef = useRef('start')
  const busy = useRef(false)
  const alive = useRef(true)
  const content = useRef(null)
  const controls = useRef(null)
  const wave = useRef(null)
  const timer = useRef({ acc: 0, startedAt: 0 }) // elapsed = acc + (now - startedAt) while running: computed from timestamps
  const heights = useRef([...INITIAL])
  const shift = useRef(0)
  const collapse = useRef(0)
  const parent = useRef({})
  parent.current = { onStageChange, onFinish }

  const go = (next) => {
    stageRef.current = next
    setStage(next)
    parent.current.onStageChange?.(next)
  }
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const elapsed = () => timer.current.acc + (stageRef.current === 'recording' || stageRef.current === 'expanding' ? performance.now() - timer.current.startedAt : 0)

  // Timer text: recomputed from timestamps while running (a throttled tab only delays the repaint, it never drifts).
  const running = stage === 'recording' || stage === 'expanding'
  useEffect(() => {
    if (!running) return undefined
    const tick = () => setText(clock(elapsed()))
    tick()
    const id = setInterval(tick, 200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  // Waveform scroll: requestAnimationFrame only while Tela 2 is recording; a voice-like envelope (the voice-mode simulator)
  // samples a new bar every SAMPLE_MS at the playhead and every bar slides left in between. Reduced motion: a static waveform.
  useEffect(() => {
    if (stage !== 'recording') return undefined
    if (prefersReducedMotion()) {
      heights.current = [...SAMPLE_BARS, 6]
      wave.current?.draw(heights.current, 0, 0)
      return undefined
    }
    const sim = createVoiceSimulator({ count: 3, min: 0, max: 1 })
    let raf = 0
    let last = performance.now()
    let lastSample = last - (shift.current / PITCH) * SAMPLE_MS // continue from where a pause left the scroll
    const tick = (now) => {
      if (stageRef.current !== 'recording') return
      const lv = sim.step((now - last) / 1000)
      last = now
      for (let n = 0; now - lastSample >= SAMPLE_MS && n < SLOTS + 1; n++) {
        lastSample += SAMPLE_MS
        const level = (lv[0] + lv[1] + lv[2]) / 3
        heights.current.push(MIN_H + (MAX_H - MIN_H) * level)
        heights.current.shift()
      }
      if (now - lastSample >= SAMPLE_MS) lastSample = now // a long stall: don't replay it
      shift.current = ((now - lastSample) / SAMPLE_MS) * PITCH
      wave.current?.draw(heights.current, shift.current, 0)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stage])

  // Animates the dot-collapse of every bar (from -> to, 0 = bars, 1 = dots) while the scroll is frozen.
  const animateCollapse = (from, to) =>
    new Promise((resolve) => {
      if (prefersReducedMotion()) {
        collapse.current = to
        wave.current?.draw(heights.current, shift.current, to)
        resolve()
        return
      }
      const t0 = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / COLLAPSE_MS)
        collapse.current = from + (to - from) * ease(t)
        wave.current?.draw(heights.current, shift.current, collapse.current)
        if (t < 1 && alive.current) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })

  async function onRecord() {
    if (busy.current || stageRef.current !== 'start') return
    busy.current = true
    parent.current.onStageChange?.('recording') // the drag-up close is off from this moment
    await swapContent(content.current, () => {
      timer.current = { acc: 0, startedAt: performance.now() }
      heights.current = [...INITIAL]
      shift.current = 0
      collapse.current = 0
      setText('00:00:00')
      flushSync(() => go('recording'))
    })
    busy.current = false
  }

  async function onFinalize() {
    if (busy.current || stageRef.current !== 'recording') return
    busy.current = true
    timer.current.acc += performance.now() - timer.current.startedAt // the timer stops here
    stageRef.current = 'collapsing'
    setStage('collapsing')
    setText(clock(timer.current.acc))
    await animateCollapse(0, 1)
    if (alive.current) {
      await swapContent(controls.current, () => flushSync(() => go('paused')))
    }
    busy.current = false
  }

  async function onPlay() {
    if (busy.current || stageRef.current !== 'paused') return
    busy.current = true
    timer.current.startedAt = performance.now() // continues from the paused value
    await Promise.all([
      swapContent(controls.current, () => flushSync(() => go('expanding'))),
      animateCollapse(1, 0),
    ])
    if (alive.current) go('recording')
    busy.current = false
  }

  function onCheck() {
    if (busy.current || stageRef.current !== 'paused') return
    busy.current = true // stays locked: the parent closes the view
    timer.current = { acc: 0, startedAt: 0 }
    heights.current = [...INITIAL]
    parent.current.onFinish?.()
  }

  if (stage === 'start') {
    return (
      <div className="recording-flow">
        <div ref={content} className="recording-flow__content">
          <GravacaoScreen onRecord={onRecord} />
        </div>
      </div>
    )
  }
  return (
    <div className="recording-flow">
      <div ref={content} className="recording-flow__content">
        <div className="voice-screen recording-screen">
          <p className="recording-timer">{text}</p>
          <Waveform ref={wave} bars={INITIAL} slots={SLOTS} />
          <div ref={controls} className="recording-controls">
            {stage === 'paused' ? (
              <>
                <WidgetHit data-no-drag label="Continuar gravação" className="recording-button recording-button--round recording-button--inverse" style={{ left: 209 }} onActivate={onPlay}>
                  <Play size={45} weight="fill" color="currentColor" />
                </WidgetHit>
                <WidgetHit data-no-drag label="Concluir gravação" className="recording-button recording-button--round recording-button--theme" style={{ left: 333 }} onActivate={onCheck}>
                  <Check size={56} weight="regular" color="currentColor" />
                </WidgetHit>
              </>
            ) : (
              <WidgetHit data-no-drag label="Finalizar" className="recording-button recording-button--pill recording-button--inverse" style={{ left: 'calc(50% - 7px)', transform: 'translateX(-50%)' }} onActivate={onFinalize}>
                Finalizar
              </WidgetHit>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
