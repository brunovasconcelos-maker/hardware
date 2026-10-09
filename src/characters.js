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

// Character videos: a theme with a looping video (src/assets/characters/<theme>.mp4: H.264, no audio) plays it on the Result's
// Personagem view instead of its PNG (the PNG is the poster and the fallback). To add a theme video: put <theme>.mp4 in
// src/assets/characters/ and add one entry here. `fit` places the video's 1080px frame relative to that theme's PNG box so the
// character is as large and as centered as the PNG's (scale about the head, plus a shift as a fraction of the box); it was measured
// on the silhouette bounding boxes of the PNG and of 25 frames of the video (the characters sway a little, so it matches on average).
const VIDEO_FILES = import.meta.glob('./assets/characters/*.mp4', { eager: true, import: 'default' })
const VIDEO_CONFIG = {
  azul: { file: 'azul.mp4', fit: { scale: 1.056, dx: -32.6 / 1080, dy: -48 / 1080 } },
  roxo: { file: 'roxo.mp4', fit: { scale: 1.526, dx: -270.3 / 1080, dy: -271.8 / 1080 } },
}
// A missing file only logs an error: that theme keeps its PNG.
export const CHARACTER_VIDEOS = Object.fromEntries(
  Object.entries(VIDEO_CONFIG).flatMap(([id, { file, fit }]) => {
    const src = VIDEO_FILES[`./assets/characters/${file}`]
    if (!src) {
      console.error(`[personagem] Arquivo ausente: src/assets/characters/${file} — o tema "${id}" usa só o PNG.`)
      return []
    }
    return [[id, { src, fit }]]
  }),
)

// Downloads a theme's video into memory once (while the thinking animation plays), so the <video> starts instantly from a blob URL.
const blobUrls = {}
const loading = {}
export function preloadCharacterVideo(id) {
  const v = CHARACTER_VIDEOS[id]
  if (!v || loading[id]) return
  loading[id] = fetch(v.src)
    .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((b) => {
      blobUrls[id] = URL.createObjectURL(b)
    })
    .catch((e) => {
      delete loading[id]
      console.error(`[personagem] Não foi possível pré-carregar ${id}.mp4:`, e.message)
    })
}
export const characterVideoUrl = (id) => blobUrls[id] ?? CHARACTER_VIDEOS[id]?.src

// Where each character sits in the rest-screen circle (Figma 397:5600, 418:5662, 418:5717, 435:5788), as fractions of the circle
// (the Figma circles measure 602.308 for Roxo/Verde and 589.569 for Laranja/Azul). The box is cropped like Figma's object-cover.
const place = (S, left, top, w, h) => ({ left: left / S, top: top / S, w: w / S, h: h / S })
export const CHARACTER_FRAME = {
  roxo: place(602.308, 3.35, 66.92, 600.703, 647.537),
  verde: place(602.308, -110.42, 0, 819.65, 883.555),
  laranja: place(589.569, -144.12, 0, 864.702, 864.702),
  azul: place(589.569, -104.81, 16.38, 795.918, 795.918),
}
