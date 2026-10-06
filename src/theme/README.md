# Theme system

Every color on top of or inside a gradient comes from a theme token. Do not hardcode colors there.

- **Orb colors**: define a new gradient in `orbs.js` (composition with color *slots*, plus its Colorido colors), then use
  `<GradientOrb {...orbProps('myOrb')} />`. Give it a widget group in `GROUP_OF` / `TONES` (`themes.js`) so the
  monochrome themes get a tone combination.
- **Foreground on gradients** (text, icons, rings, hands, page dots): `color: var(--fg)` or `currentColor` /
  `fill="currentColor"` inside a `GradientOrb` (its content already sets `color: var(--fg)`). Inverse: `var(--fg-contrast)`.
- **Result OK button**: `var(--ok-bg)` / `var(--ok-fg)`.
- Stays the same in every theme: the dark display background (`#141515`) and text/icons outside gradients (Homepage,
  Menu, voice-mode lines, Result text).
- Themes: Colorido (default, the original design) and five monochrome palettes (`PALETTES`, 100 lightest … 700 darkest).
  Switching sets CSS variables registered as `<color>` on `<html>`, so the browser crossfades them (400ms).
