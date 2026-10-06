// Highlighted segment of the right-hand slot of the radial screens (Menu, Configurações): 45° wide, centered on the
// horizontal axis, from the center to beyond the display, with two hairlines on its edges. Colors are mode tokens.
const R = 400
const A = (22.5 * Math.PI) / 180
const SECTOR = `M325 325 L${325 + R * Math.cos(A)} ${325 - R * Math.sin(A)} L${325 + R * Math.cos(A)} ${325 + R * Math.sin(A)} Z`
const EDGES = `M${325 + 180 * Math.cos(A)} ${325 - 180 * Math.sin(A)} L${325 + R * Math.cos(A)} ${325 - R * Math.sin(A)} M${325 + 180 * Math.cos(A)} ${325 + 180 * Math.sin(A)} L${325 + R * Math.cos(A)} ${325 + R * Math.sin(A)}`

export default function RadialSector() {
  return (
    <svg className="menu-screen__sector" width="650" height="650" viewBox="0 0 650 650" aria-hidden="true">
      <path d={SECTOR} style={{ fill: 'var(--surface-raised)' }} />
      <path d={EDGES} style={{ stroke: 'var(--surface-sunken)' }} strokeWidth="1.5" fill="none" />
    </svg>
  )
}
