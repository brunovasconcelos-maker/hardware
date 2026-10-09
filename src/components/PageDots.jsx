import './PageDots.css'

// Two-page indicator (Figma "Frame 26": 42x15 at left 305, top 603). `className` can restyle it (the Result screen puts it at the top, in mode tokens).
export default function PageDots({ active = 0, count = 2, className = '' }) {
  return (
    <div className={`page-dots ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i === active ? 'page-dots__dot page-dots__dot--active' : 'page-dots__dot'} />
      ))}
    </div>
  )
}
