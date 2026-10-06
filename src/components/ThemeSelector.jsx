import { useTheme } from '../theme/theme.js'
import { THEMES, THEME_ORDER } from '../theme/themes.js'
import './ThemeSelector.css'

// Theme picker (Figma 204:2997): a vertical white capsule with one 56px round swatch per theme and no labels, fixed at
// the left of the page (outside the device). The active swatch gets a thin ring; each button has an aria-label and a
// native tooltip with the theme name.
export default function ThemeSelector() {
  const [theme, setTheme] = useTheme()
  return (
    <div className="theme-selector" role="radiogroup" aria-label="Tema de cores">
      {THEME_ORDER.map((id) => {
        const t = THEMES[id]
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={id === theme}
            aria-label={t.label}
            title={t.label}
            className={id === theme ? 'theme-selector__swatch theme-selector__swatch--selected' : 'theme-selector__swatch'}
            style={{ background: t.swatch }}
            onClick={() => setTheme(id)}
          />
        )
      })}
    </div>
  )
}
