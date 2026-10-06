import './PageDots.css'

// Two-page indicator (Figma "Frame 26": 42x15 at left 305, top 603). Visual only.
export default function PageDots({ active = 0, count = 2 }) {
  return (
    <div className="page-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i === active ? 'page-dots__dot page-dots__dot--active' : 'page-dots__dot'} />
      ))}
    </div>
  )
}
