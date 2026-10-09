import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Check } from '@phosphor-icons/react'
import { useDragScroll } from '../../hooks/useDragScroll.js'
import WidgetHit from '../../components/WidgetHit.jsx'
import PageDots from '../../components/PageDots.jsx'
import { useTheme } from '../../theme/theme.js'
import { CHARACTER_IDS, CHARACTER_SRC, CHARACTER_FRAME, CHARACTER_VIDEOS, characterVideoUrl } from '../../characters.js'
import { VOICE_RESULTS } from '../../mocks/voiceResults.js'
import { run, dur, SNAP_MS, prefersReducedMotion } from '../../motion.js'
import { FLICK_V, FLICK_MIN, lockDirection, velocity } from '../../gestures.js'
import './voice.css'

// Result, two pages of a horizontal carousel inside the display: Personagem (Figma 460:5958, the theme's character) and Texto
// (Figma 158:2173). Swipe (mouse/touch drag or a horizontal trackpad/wheel scroll) moves between them; the page dots (top) and the
// check button (bottom) stay fixed. The page state lives here, so switching never touches whatever the parent does with the
// answer (speech keeps playing). `initialView` is 'personagem' (default) or 'texto'; `onCheck` is called by the check button.
const W = 650 // the display
const SWIPE_FRACTION = 0.25 // horizontal drag (share of the width) that changes page
const PAGES = 2
const WHEEL_STEP = 50 // px of horizontal wheel/trackpad scroll that changes page
const MIN_SIDE = 1300 // px: a character smaller than this would look soft at the Figma size
const warned = new Set()
const checkSize = (e) => {
  const { naturalWidth: w, naturalHeight: h, dataset } = e.currentTarget
  if (Math.max(w, h) < MIN_SIDE && !warned.has(dataset.id)) {
    warned.add(dataset.id)
    console.warn(`[personagem] ${dataset.id}.png tem ${w}×${h}px (< ${MIN_SIDE}px no lado maior); no tamanho do Figma ela pode parecer suave.`)
  }
}

// Figma 460:5958 only designs Laranja: its character box is 948px square at -149/28 on the 650px display, clipped by the display
// circle. The other themes use the same framing relative to their rest-screen circle framing (Figma), mapped by the transform
// that takes Laranja's rest-circle box to this one (scale + offset, so Laranja itself is exactly the Figma box).
const DISPLAY = 650
const LARANJA_BOX = { left: -149 / DISPLAY, top: 28 / DISPLAY, w: 948 / DISPLAY }
const K = LARANJA_BOX.w / CHARACTER_FRAME.laranja.w
const BOX = Object.fromEntries(
  CHARACTER_IDS.map((id) => {
    const f = CHARACTER_FRAME[id]
    const px = (v) => Math.round(v * DISPLAY * 100) / 100
    return [id, { left: px(K * (f.left - CHARACTER_FRAME.laranja.left) + LARANJA_BOX.left), top: px(K * (f.top - CHARACTER_FRAME.laranja.top) + LARANJA_BOX.top), width: px(K * f.w), height: px(K * f.h) }]
  }),
)

// A theme's video (1080px square) is fitted to that theme's PNG with its `fit` (see characters.js). The PNG is shown `cover` in its
// box, so its square is as large as the box's longer side, centered on the box (Roxo's box is not square).
const videoBox = (id) => {
  const b = BOX[id]
  const { scale, dx, dy } = CHARACTER_VIDEOS[id].fit
  const side = Math.max(b.width, b.height)
  const left0 = b.left + (b.width - side) / 2
  const top0 = b.top + (b.height - side) / 2
  return { left: left0 + dx * side, top: top0 + dy * side, width: side * scale, height: side * scale }
}
const REDUCED = prefersReducedMotion()
// The theme whose video plays on the Personagem page (reduced motion: none, the PNG "poster" only).
export const videoThemeOf = (theme) => (!REDUCED && CHARACTER_VIDEOS[theme] ? theme : null)
const FADE_MS = 450 // a bit over the 400ms opacity crossfade

// The single <video>. It holds the video of `theme`; it plays while its page is in view (`paused` false) and is never restarted
// by pausing. `onPlaying` tells the parent that the first frame is on screen, so the PNG can hand over to it.
function CharacterVideo({ theme, paused, frozen, ready, onPlaying, elRef }) {
  const ref = elRef
  const src = characterVideoUrl(theme) // the preloaded blob URL, or the file URL
  const box = videoBox(theme)
  const startPaused = useRef(paused)
  useEffect(() => {
    const v = ref.current
    v.muted = true
    return () => {
      v.pause()
      v.removeAttribute('src') // releases the decoder and the buffered frames
      v.load()
    }
  }, [])
  useEffect(() => {
    const v = ref.current
    if (paused || frozen) v.pause()
    else v.play().catch(() => {}) // a refused play() leaves the PNG on screen
  }, [paused, frozen, src])
  return (
    <video
      ref={ref}
      className="result-screen__video"
      src={src}
      poster={CHARACTER_SRC[theme]}
      autoPlay={!startPaused.current}
      muted
      loop
      playsInline
      preload="auto"
      width={Math.round(box.width)}
      height={Math.round(box.height)}
      style={box}
      data-ready={ready ? '' : undefined}
      onPlaying={onPlaying}
    />
  )
}

function CharacterView({ videoPaused, frozen }) {
  const [theme] = useTheme()
  const wanted = videoThemeOf(theme) // the theme whose video should be on screen, if any
  const first = useRef(theme)
  const switched = useRef(false) // the theme changed while this view was open: crossfade (400ms); at opening it hands over at once
  if (theme !== first.current) switched.current = true
  // The one <video> element holds `held` (the theme whose video it has loaded). A switch fades it out, then re-points or removes
  // it, so two videos are never mounted together (Azul <-> Roxo goes through the new theme's PNG).
  const [held, setHeld] = useState(wanted)
  const [playing, setPlaying] = useState(false)
  const videoEl = useRef(null)
  useEffect(() => {
    if (wanted === held) {
      // back to the held theme before its fade-out finished: the video never stopped, so no 'playing' event will come again
      const v = videoEl.current
      if (v && v.readyState >= 3) setPlaying(true)
      return undefined
    }
    setPlaying(false)
    if (held === null) {
      setHeld(wanted)
      return undefined
    }
    const id = setTimeout(() => setHeld(wanted), FADE_MS) // lets the video fade out first
    return () => clearTimeout(id)
  }, [wanted, held])
  const videoOn = playing && held !== null && held === wanted
  return (
    <div className="result-screen__character" data-video-fade={switched.current ? 'slow' : 'instant'}>
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
            data-active={theme === id && !(videoOn && held === id) ? '' : undefined}
            onLoad={checkSize}
          />
        ) : null,
      )}
      {held !== null && <CharacterVideo theme={held} paused={videoPaused} frozen={frozen} ready={videoOn} onPlaying={() => setPlaying(true)} elRef={videoEl} />}
      <div className="result-screen__fade" />
    </div>
  )
}

// Figma 158:2173. Only the text area scrolls (behind the check button); the bottom fade stays fixed on the page.
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
  const [index, setIndex] = useState(initialView === 'texto' ? 1 : 0)
  const indexRef = useRef(index)
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const drag = useRef(null)
  const busy = useRef(false)
  const alive = useRef(true)
  const [theme] = useTheme()
  const charVideo = videoThemeOf(theme) !== null // the Personagem page of a theme with a video
  const [videoPaused, setVideoPaused] = useState(initialView === 'texto') // paused while the Personagem page is out of view
  const [frozen, setFrozen] = useState(false) // the check was pressed: stop everything

  const setX = (x) => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px,0,0)`
  }
  const baseX = () => -indexRef.current * W
  useLayoutEffect(() => setX(baseX()), []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  // Slides the track from `fromX` to page `target` (the current page again = snap back). The dots follow at once.
  async function goTo(target, fromX) {
    busy.current = true
    const toX = -target * W
    indexRef.current = target
    setIndex(target)
    if (target === 0) setVideoPaused(false)
    const { anim, done } = run(trackRef.current, [{ transform: `translate3d(${fromX}px,0,0)` }, { transform: `translate3d(${toX}px,0,0)` }], { duration: dur(SNAP_MS), easing: 'ease-out', fill: 'forwards' })
    await done
    if (!alive.current) return
    setX(toX)
    anim.cancel()
    busy.current = false
    if (target === 1) setVideoPaused(true) // the Personagem page has left the view: pause (resumes where it was)
  }

  // Soft resistance (35%) when dragging past the first or last page.
  const rubber = (dx) => {
    const target = indexRef.current - Math.sign(dx)
    return target >= 0 && target < PAGES ? dx : dx * 0.35
  }

  function onPointerDown(e) {
    if (busy.current || drag.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lock: null, dx: 0, samples: [{ t: e.timeStamp, x: e.clientX, y: e.clientY }] }
  }
  function onPointerMove(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    d.dx = e.clientX - d.x0
    d.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY })
    if (!d.lock) {
      d.lock = lockDirection(d.dx, e.clientY - d.y0) // same rule as the text's vertical drag scroll, so they never both act
      if (d.lock === 'h') {
        e.currentTarget.setPointerCapture(e.pointerId)
        setVideoPaused(false) // the Personagem page starts to appear
      }
    }
    if (d.lock === 'h') setX(baseX() + rubber(d.dx))
  }
  function onPointerUp(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    if (d.lock !== 'h') return
    const x = baseX() + rubber(d.dx)
    const v = velocity(d.samples, 'x')
    const dir = d.dx < 0 ? 1 : -1 // next page when dragging left
    const next = indexRef.current + dir
    const commits = e.type !== 'pointercancel' && (Math.abs(d.dx) > W * SWIPE_FRACTION || (Math.abs(v) > FLICK_V && Math.abs(d.dx) > FLICK_MIN && Math.sign(v) === Math.sign(d.dx)))
    goTo(commits && next >= 0 && next < PAGES ? next : indexRef.current, x)
  }

  // Horizontal trackpad / wheel scroll (only when deltaX dominates; vertical wheel scrolls the text natively). One page per
  // gesture: the momentum tail of a trackpad swipe is ignored until the wheel events stop.
  useEffect(() => {
    const el = rootRef.current
    let acc = 0
    let spent = false
    let idle = 0
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      clearTimeout(idle)
      idle = setTimeout(() => {
        acc = 0
        spent = false
      }, 140)
      if (spent || busy.current || drag.current) return
      acc += e.deltaX
      if (Math.abs(acc) < WHEEL_STEP) return
      const next = indexRef.current + (acc > 0 ? 1 : -1)
      acc = 0
      spent = true
      if (next >= 0 && next < PAGES) goTo(next, baseX())
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      clearTimeout(idle)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={rootRef} className="voice-screen result-screen" data-view={index === 1 ? 'texto' : 'personagem'} data-char-video={charVideo ? '' : undefined}>
      <div className="result-screen__viewport" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <div ref={trackRef} className="result-screen__track">
          <div className="result-screen__page" style={{ left: 0 }} data-char-video={charVideo ? '' : undefined}>
            <CharacterView videoPaused={videoPaused} frozen={frozen} />
          </div>
          <div className="result-screen__page" style={{ left: W }}>
            <TextView result={result} />
          </div>
        </div>
      </div>
      <PageDots className="page-dots--result" active={index} count={PAGES} />
      <WidgetHit label="Concluir" className="result-screen__check" onActivate={() => {
          setFrozen(true)
          onCheck?.()
        }}>
        <Check size={56} weight="regular" color="currentColor" />
      </WidgetHit>
    </div>
  )
}
