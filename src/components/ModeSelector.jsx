import { Sun, MoonStars } from '@phosphor-icons/react'
import { useMode } from '../theme/mode.js'
import './ModeSelector.css'

// Light / dark mode switch (Figma 221:3004): a vertical white capsule with the sun (light, top) and the moon (dark,
// bottom). The selected option is a dark filled circle with a white icon; the other one is a grey icon.
const OPTIONS = [
  { id: 'light', Icon: Sun, label: 'Modo claro' },
  { id: 'dark', Icon: MoonStars, label: 'Modo escuro' },
]

export default function ModeSelector() {
  const [mode, setMode] = useMode()
  return (
    <div className="mode-selector" role="radiogroup" aria-label="Modo claro ou escuro">
      {OPTIONS.map(({ id, Icon, label }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={mode === id}
          aria-label={label}
          title={label}
          className={mode === id ? 'mode-selector__option mode-selector__option--selected' : 'mode-selector__option'}
          onClick={() => setMode(id)}
        >
          <Icon size={32} weight="regular" color="currentColor" />
        </button>
      ))}
    </div>
  )
}
