# Theme system

Every color on top of or inside a gradient comes from a theme token. Do not hardcode colors there.

- **Orb colors**: define a new gradient in `orbs.js` (composition with color *slots*, plus its Colorido colors), then use
  `<GradientOrb {...orbProps('myOrb')} />`. Give it a widget group in `GROUP_OF` / `TONES` (`themes.js`) so the
  monochrome themes get a tone combination.
- **Foreground on gradients** (text, icons, rings, hands, page dots): `color: var(--fg)` or `currentColor` /
  `fill="currentColor"` inside a `GradientOrb` (its content already sets `color: var(--fg)`). Inverse: `var(--fg-contrast)`.
- **Result OK button**: `var(--ok-bg)` / `var(--ok-fg)`.
- **Accent glow**: every orb gets an extra soft glow in `--accent` (one color per monochrome theme, transparent in Colorido). It is added by `orbProps()`; a new orb only needs its widget group in `GROUP_OF`/`ACCENT_GLOWS` (`themes.js`) so the glow position varies per group (keep the disc at 15–25% of the orb area).
- **Softness**: `GradientOrb` blurs its layers (40–60px) in an oversized wrapper clipped by the circle, so edges never fade; no per-theme work needed.
- **Grain**: a theme token `grain: true|false` (default false). When true, every `GradientOrb` shows a static feTurbulence grain overlay on top of the drifting gradient; only Verde enables it.
- **Verde, Roxo, Off white, Preto and Laranja** use roles instead of the 100–700 scale (see `VERDE` in `themes.js`): green base tones per orb slot, plus two extra glow layers on the orbs that define them, `--depth` (navy) and `--sun` (yellow), via `DEPTH_GLOWS` / `SUN_GLOWS`. Both tokens are transparent in every other theme.
- Stays the same in every theme: the dark display background (`#141515`) and text/icons outside gradients (Homepage,
  Menu, voice-mode lines, Result text).
- Themes: Colorido (default, the original design) and five monochrome palettes (`PALETTES`, 100 lightest … 700 darkest).
  Switching sets CSS variables registered as `<color>` on `<html>`, so the browser crossfades them (400ms).
