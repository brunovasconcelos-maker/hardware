import { useTheme } from '../theme/theme.js'
import { CHARACTER_SRC as SRC, CHARACTER_FRAME as PLACEMENT } from '../characters.js'
import './CharacterCircle.css'

// Rest-screen center: a solid-color circle (`--char-bg`, a theme token that morphs on switch) with the theme's character.
// Placement (CHARACTER_FRAME) comes from the Figma frames, as fractions of the circle.

export default function CharacterCircle({ size = 180 }) {
  const [theme] = useTheme()
  return (
    <div className="character-circle" style={{ width: size, height: size }}>
      {Object.entries(PLACEMENT).map(([id, p]) =>
        SRC[id] ? (
          <img
            key={id}
            className="character-circle__img"
            src={SRC[id]}
            alt=""
            draggable={false}
            decoding="async"
            width={Math.round(p.w * size)}
            height={Math.round(p.h * size)}
            data-active={theme === id ? '' : undefined}
            style={{ left: p.left * size, top: p.top * size, width: p.w * size, height: p.h * size }}
          />
        ) : null,
      )}
    </div>
  )
}
