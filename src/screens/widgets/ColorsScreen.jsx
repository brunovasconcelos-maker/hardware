import { X, CheckCircle } from '@phosphor-icons/react'
import WidgetHit from '../../components/WidgetHit.jsx'
import { useTheme } from '../../theme/theme.js'
import { THEMES, THEME_ORDER } from '../../theme/themes.js'
import '../screens.css'
import './colors.css'

// Four 180px circles in a symmetrical 2x2 arrangement centered in the display (24px gap), in the order of the side selector
// (Roxo, Azul / Verde, Laranja). The X stays at the right edge, as in Figma 223:3078.
const CIRCLES = THEME_ORDER.map((theme, i) => ({ key: theme, theme, left: 133 + (i % 2) * 204, top: 133 + Math.floor(i / 2) * 204 }))

// Cores. Same theme state as the side selector: clicking a circle switches the theme (crossfade) and moves the selected
// state (white outline + check in the center). Stage animates the screen in and out; the X calls `onClose`.
export default function ColorsScreen({ onClose }) {
  const [current, setTheme] = useTheme()
  return (
    <div data-screen-root="colors" className="menu-screen">
      {CIRCLES.map(({ key, theme, left, top }) => {
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
