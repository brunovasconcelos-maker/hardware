import { useRef, useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { ChatText, Alien, Check } from '@phosphor-icons/react'
import { useDragScroll } from '../../hooks/useDragScroll.js'
import WidgetHit from '../../components/WidgetHit.jsx'
import { useTheme } from '../../theme/theme.js'
import { CHARACTER_IDS, CHARACTER_SRC, CHARACTER_FRAME } from '../../characters.js'
import { VOICE_RESULTS } from '../../mocks/voiceResults.js'
import { EASE, EXIT_MS, ENTER_MS } from '../../transitions.js'
import { dur } from '../../motion.js'
import './voice.css'

// Result, two views of the same answer: Personagem (Figma 435:5857, the theme's character) and Texto (Figma 158:2173).
// The side icons and the check are fixed and identical in both views; only the content layer changes (it leaves scaling
// down + fading, the new one enters scaling in + fading, like the screen transitions). The view state lives here, so
// switching never touches whatever the parent does with the answer (speech keeps playing).
// `initialView` is 'personagem' (default) or 'texto'; `onCheck` is called by the check icon.
const MIN_SIDE = 1300 // px: a character smaller than this would look soft at the Figma size
const warned = new Set()
const checkSize = (e) => {
  const { naturalWidth: w, naturalHeight: h, dataset } = e.currentTarget
  if (Math.max(w, h) < MIN_SIDE && !warned.has(dataset.id)) {
    warned.add(dataset.id)
    console.warn(`[personagem] ${dataset.id}.png tem ${w}×${h}px (< ${MIN_SIDE}px no lado maior); no tamanho do Figma ela pode parecer suave.`)
  }
}

// Figma 435:5857 only designs Laranja: its character box is 978px square at -164/-2 on the 650px display, clipped by the display
// circle. The other themes use the same framing relative to their rest-screen circle framing (Figma), mapped by the transform
// that takes Laranja's rest-circle box to this one (scale + offset, so Laranja itself is exactly the Figma box).
const DISPLAY = 650
const LARANJA_BOX = { left: -164 / DISPLAY, top: -2 / DISPLAY, w: 978 / DISPLAY }
const K = LARANJA_BOX.w / CHARACTER_FRAME.laranja.w
const BOX = Object.fromEntries(
  CHARACTER_IDS.map((id) => {
    const f = CHARACTER_FRAME[id]
    const px = (v) => Math.round(v * DISPLAY * 100) / 100
    return [id, { left: px(K * (f.left - CHARACTER_FRAME.laranja.left) + LARANJA_BOX.left), top: px(K * (f.top - CHARACTER_FRAME.laranja.top) + LARANJA_BOX.top), width: px(K * f.w), height: px(K * f.h) }]
  }),
)

function CharacterView() {
  const [theme] = useTheme()
  return (
    <div className="result-screen__character">
      {CHARACTER_IDS.map((id) =>
        CHARACTER_SRC[id] ? (
          <img
            key={id}
            className="result-screen__character-img"
            src={CHARACTER_SRC[id]}
            alt=""
            draggable={false}
            decoding="async"
            width={Math.round(BOX[id].width)}
            height={Math.round(BOX[id].height)}
            style={BOX[id]}
            data-id={id}
            data-active={theme === id ? '' : undefined}
            onLoad={checkSize}
          />
        ) : null,
      )}
    </div>
  )
}

// Figma 158:2173. Only the text area scrolls; the bottom fade stays fixed.
function TextView({ result }) {
  const scroll = useRef(null)
  useDragScroll(scroll)
  return (
    <>
      <div ref={scroll} className="result-screen__scroll">
        <div className="result-screen__content">
          <div className="result-screen__head">
            <p className="result-screen__title">{result.title}</p>
            <p className="result-screen__meta">{result.date}</p>
            <p className="result-screen__meta">{result.subtitle}</p>
          </div>
          <div className="result-screen__divider" />
          <p className="result-screen__body">{result.body}</p>
        </div>
      </div>
      <div className="result-screen__fade" />
    </>
  )
}

export default function ResultScreen({ result = VOICE_RESULTS[0], initialView = 'personagem', onCheck }) {
  const [view, setView] = useState(initialView)
  const layer = useRef(null)
  const busy = useRef(false)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  async function switchView() {
    const el = layer.current
    if (busy.current || !el) return
    busy.current = true
    const out = el.animate([{ opacity: 1, scale: '1' }, { opacity: 0, scale: '0.92' }], { duration: dur(EXIT_MS), easing: EASE, fill: 'forwards' })
    await out.finished.catch(() => {})
    if (alive.current) {
      flushSync(() => setView((v) => (v === 'texto' ? 'personagem' : 'texto')))
      out.cancel()
      await el.animate([{ opacity: 0, scale: '1.06' }, { opacity: 1, scale: '1' }], { duration: dur(ENTER_MS), easing: EASE, fill: 'backwards' }).finished.catch(() => {})
    }
    busy.current = false
  }

  const Left = view === 'texto' ? Alien : ChatText
  return (
    <div className="voice-screen result-screen" data-view={view}>
      <div ref={layer} className="result-screen__layer">
        {view === 'texto' ? <TextView result={result} /> : <CharacterView />}
      </div>
      <WidgetHit label={view === 'texto' ? 'Ver personagem' : 'Ver texto'} className="result-screen__icon result-screen__icon--left" onActivate={switchView}>
        <Left size={56} weight="regular" color="currentColor" />
      </WidgetHit>
      <WidgetHit label="Concluir" className="result-screen__icon result-screen__icon--right" onActivate={() => onCheck?.()}>
        <Check size={56} weight="regular" color="currentColor" />
      </WidgetHit>
    </div>
  )
}
