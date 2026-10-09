import { useTheme } from '../theme/theme.js'
import './CharacterCircle.css'

// Rest-screen center: a solid-color circle (`--char-bg`, a theme token that morphs on switch) with the theme's character.
// Placement comes from the Figma frames, as fractions of the circle (Figma circle: 602.308 for Roxo/Verde, 589.569 for Laranja/Azul).
const place = (S, left, top, w, h) => ({ left: left / S, top: top / S, w: w / S, h: h / S })
const PLACEMENT = {
  roxo: place(602.308, 3.35, 66.92, 600.703, 647.537),
  verde: place(602.308, -110.42, 0, 819.65, 883.555),
  laranja: place(589.569, -144.12, 0, 864.702, 864.702),
  azul: place(589.569, -104.81, 16.38, 795.918, 795.918),
}

// import.meta.glob keeps the build alive if a PNG is missing; that theme then shows the solid circle only.
const FILES = import.meta.glob('../assets/characters/*.png', { eager: true, import: 'default' })
const SRC = Object.fromEntries(Object.keys(PLACEMENT).map((id) => [id, FILES[`../assets/characters/${id}.png`]]))
for (const [id, src] of Object.entries(SRC)) {
  if (!src) console.error(`[personagem] Arquivo ausente: src/assets/characters/${id}.png — o círculo do tema "${id}" aparece sem personagem.`)
  else if (typeof Image !== 'undefined') new Image().src = src // preload every theme's character
}

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
