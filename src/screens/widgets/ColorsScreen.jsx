import { X, CheckCircle } from '@phosphor-icons/react'
import WidgetHit from '../../components/WidgetHit.jsx'
import { useTheme } from '../../theme/theme.js'
import { THEMES } from '../../theme/themes.js'
import '../screens.css'
import './colors.css'

// Circles from Figma 223:3078 (180px, positions on the 650px canvas). `theme` = the color theme it selects; the grey one
// is a placeholder for a future theme (no theme, no action).
const CIRCLES = [
  { key: 'offwhite', theme: 'offwhite', left: 135, top: 55 },
  { key: 'preto', theme: 'preto', left: 339, top: 55 },
  { key: 'placeholder', theme: null, left: 31, top: 235 },
  { key: 'colorido', theme: 'colorido', left: 235, top: 235 },
  { key: 'verde', theme: 'verde', left: 135, top: 415 },
  { key: 'roxo', theme: 'roxo', left: 339, top: 415 },
]

// Cores. Same theme state as the side selector: clicking a circle switches the theme (crossfade) and moves the selected
// state (white outline + check in the center). Stage animates the screen in and out; the X calls `onClose`.
export default function ColorsScreen({ onClose }) {
  const [current, setTheme] = useTheme()
  return (
    <div data-screen-root="colors" className="menu-screen">
      {CIRCLES.map(({ key, theme, left, top }) => {
        if (!theme) return <div key={key} data-tx="item" className="colors-screen__circle colors-screen__circle--placeholder" style={{ left, top }} aria-hidden="true" />
        const selected = theme === current
        return (
          <button
            key={key}
            data-tx="item"
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={THEMES[theme].label}
            title={THEMES[theme].label}
            className={`colors-screen__circle colors-screen__circle--${key}${selected ? ' colors-screen__circle--selected' : ''}`}
            style={{ left, top, background: THEMES[theme].swatch }}
            onClick={() => setTheme(theme)}
          >
            {selected && <CheckCircle className="colors-screen__check" size={56} weight="fill" color="currentColor" />}
          </button>
        )
      })}
      <WidgetHit data-tx="item" label="Voltar" className="menu-screen__slot menu-screen__slot--action" onActivate={() => onClose?.()}>
        <X size={56} weight="regular" color="currentColor" />
      </WidgetHit>
    </div>
  )
}
