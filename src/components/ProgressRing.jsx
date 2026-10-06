// SVG progress ring: translucent full track + white arc starting at 12 o'clock, clockwise.
export default function ProgressRing({ value, size = 180, radius = 80, stroke = 8.35, trackOpacity = 0.5 }) {
  const c = size / 2
  return (
    <svg className="progress-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <circle cx={c} cy={c} r={radius} fill="none" stroke="currentColor" strokeOpacity={trackOpacity} strokeWidth={stroke} />
      <circle
        cx={c}
        cy={c}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray={`${value * 100} 100`}
        transform={`rotate(-90 ${c} ${c})`}
      />
    </svg>
  )
}
