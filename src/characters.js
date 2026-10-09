// The four theme characters (src/assets/characters/<theme>.png), shared by the rest-screen circle and the Result screen.
// import.meta.glob keeps the build alive if a PNG is missing: that theme then renders without a character, and a console
// error names the file. Every present image is preloaded once.
const FILES = import.meta.glob('./assets/characters/*.png', { eager: true, import: 'default' })
export const CHARACTER_IDS = ['roxo', 'azul', 'verde', 'laranja']
export const CHARACTER_SRC = Object.fromEntries(CHARACTER_IDS.map((id) => [id, FILES[`./assets/characters/${id}.png`]]))
for (const [id, src] of Object.entries(CHARACTER_SRC)) {
  if (!src) console.error(`[personagem] Arquivo ausente: src/assets/characters/${id}.png — o tema "${id}" aparece sem personagem.`)
  else if (typeof Image !== 'undefined') new Image().src = src
}

// Where each character sits in the rest-screen circle (Figma 397:5600, 418:5662, 418:5717, 435:5788), as fractions of the circle
// (the Figma circles measure 602.308 for Roxo/Verde and 589.569 for Laranja/Azul). The box is cropped like Figma's object-cover.
const place = (S, left, top, w, h) => ({ left: left / S, top: top / S, w: w / S, h: h / S })
export const CHARACTER_FRAME = {
  roxo: place(602.308, 3.35, 66.92, 600.703, 647.537),
  verde: place(602.308, -110.42, 0, 819.65, 883.555),
  laranja: place(589.569, -144.12, 0, 864.702, 864.702),
  azul: place(589.569, -104.81, 16.38, 795.918, 795.918),
}
