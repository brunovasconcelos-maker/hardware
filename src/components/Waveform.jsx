import './Waveform.css'

// Recording waveform (Figma 460:6023 / 460:6046): a row of 6px elements, 8px apart, centered on the display, with a fixed
// playhead (line + dot) between the past and the future.
//   bars     heights (px) of the elements left of the playhead, oldest first. A bar of 6px or less is a dot (the collapsed state);
//            `collapsed` forces every bar to a dot without changing the array.
//   ahead    number of gray dots to the right of the playhead
// Every element is a fixed absolutely-positioned div placed with transform (no layout flow, no filters); a bar's height is its own
// `height` (scaleY would stretch the rounded caps), which only re-lays out that one contained element. The next step can animate
// the heights by writing the `bars` array.
const BAR_W = 6
const GAP = 8
const PITCH = BAR_W + GAP
const ROW_H = 274 // playhead height; bars never exceed it
const CENTER_Y = 325

export default function Waveform({ bars, ahead = 22, collapsed = false }) {
  const total = bars.length + 1 + ahead
  const left0 = (650 - (total * BAR_W + (total - 1) * GAP)) / 2 // the row is centered on the display
  const x = (i) => left0 + i * PITCH
  const dot = (cls, i, key) => <div key={key} className={`waveform__el ${cls}`} style={{ transform: `translate3d(${x(i)}px, ${CENTER_Y - BAR_W / 2}px, 0)` }} />
  return (
    <div className="waveform" aria-hidden="true">
      {bars.map((h, i) => {
        const height = collapsed ? BAR_W : Math.max(BAR_W, Math.min(ROW_H, h))
        return <div key={i} className="waveform__el waveform__el--past" style={{ height, transform: `translate3d(${x(i)}px, ${CENTER_Y - height / 2}px, 0)` }} />
      })}
      <div className="waveform__playhead" style={{ transform: `translate3d(${x(bars.length)}px, ${CENTER_Y - ROW_H / 2}px, 0)` }}>
        <span className="waveform__playhead-dot" />
      </div>
      {Array.from({ length: ahead }, (_, i) => dot('waveform__el--ahead', bars.length + 1 + i, `a${i}`))}
    </div>
  )
}
