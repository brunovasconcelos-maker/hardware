import { useTheme } from '../theme/theme.js'
import { THEMES, THEME_ORDER } from '../theme/themes.js'
import './ThemeSelector.css'

// Theme picker, fixed in the page's top-right corner (outside the device). Six swatches with labels below.
export default function ThemeSelector() {
  const [theme, setTheme] = useTheme()
  return (
    <div className="theme-selector" role="radiogroup" aria-label="Tema de cores">
      {THEME_ORDER.map((id) => {
        const t = THEMES[id]
        const selected = id === theme
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={selected ? 'theme-selector__item theme-selector__item--selected' : 'theme-selector__item'}
            onClick={() => setTheme(id)}
          >
            <span className="theme-selector__swatch" style={{ background: t.swatch }} />
            <span className="theme-selector__label">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
