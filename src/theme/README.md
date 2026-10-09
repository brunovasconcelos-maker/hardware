# Theme system

Every color on top of or inside a gradient comes from a theme token. Do not hardcode colors there.

- **Themes** (`themes.js`): Roxo (default), Azul, Verde, Laranja. Each is built from roles: base tones per orb slot (a tone
  *ramp* A–E for Roxo/Azul/Verde, filled into the `TEMPLATES` compositions; explicit arrays for Laranja), soft **depth** regions
  (`--depth`, and `--depth-2` in Azul), and an **accent** glow (`--sun`; Laranja also has `--sun-alt`, used by the orbs in
  `GOLD_ORBS`). The foreground on gradients is white; the grain overlay is on in all four (`grain` token).
- **Orb colors**: define a new gradient in `orbs.js` (composition with color *slots*), add its slot letters to `TEMPLATES` (and an
  array to `LARANJA_COLORS`), its glow positions to `DEPTH_GLOWS` / `SUN_GLOWS`, and use `orbProps('<orb>')` in `<GradientOrb>`.
- **Foreground on gradients** (text, icons, rings, hands, page dots): `color: var(--fg)` or `currentColor`; inverse `var(--fg-contrast)`.
- **OK button**: `--ok-bg` (the theme's main color) and `--ok-fg`.
- **Surfaces** (display background, text on it, Menu...) follow the light/dark *mode* (`mode.js`), not the color theme.
- Gradients are static (no drift animation). Switching themes morphs the registered color variables (600ms) only for the orbs
  that are visible; the saved theme is in `localStorage` (`hardware.theme`), unknown values fall back to the default (Roxo).

## Rest-screen character circle

The center circle of the rest screen (`components/CharacterCircle.jsx`) is a flat `--char-bg` circle (a registered color token that
morphs with the theme, per-theme value `charBg` in `themes.js`) with the theme's character from `src/assets/characters/<theme>.png`.
All four images are mounted and preloaded; a theme switch crossfades their opacity (400ms) while the background morphs. A missing PNG
does not break the build: that theme shows the solid circle only and a console error names the file. The Homepage and voice mode still
use `MicButton`.

## Result screen views

The Result (`screens/voice/ResultScreen.jsx`) has two views of the same answer: Personagem (default; the active theme's character from
`src/assets/characters/`, crossfading 400ms on a theme change, on the display background token) and Texto. The left icon switches
views (ChatText in Personagem, Alien in Texto), the right icon is the check. `characters.js` holds the shared PNG imports and the
per-theme rest-circle framing; Figma designs the Result framing only for Laranja, the other themes are mapped from it.
