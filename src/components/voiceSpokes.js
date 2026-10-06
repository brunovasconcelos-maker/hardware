// 32 radial lines around the recording orb (Figma "Falando" 107:1390).
// angle: degrees clockwise from 12 o'clock, measured from the Figma line centers around (325, 325);
// inner: distance from the center to the line's inner end (~102px); length: Figma length (17–52).
// Stroke is 4px with round caps, so a length of 0 renders as a 4px dot.
export const SPOKES = [
  { angle: 0.48, inner: 102.0, length: 37 },
  { angle: 11.33, inner: 102.19, length: 24.3 },
  { angle: 22.62, inner: 102.39, length: 37.81 },
  { angle: 34.04, inner: 102.57, length: 52.29 },
  { angle: 45.53, inner: 102.72, length: 23.86 },
  { angle: 55.98, inner: 102.83, length: 17 },
  { angle: 66.67, inner: 102.93, length: 17 },
  { angle: 77.81, inner: 102.98, length: 17 },
  { angle: 90.0, inner: 103.0, length: 17 },
  { angle: 100.59, inner: 102.99, length: 17 },
  { angle: 111.18, inner: 102.93, length: 48.23 },
  { angle: 122.35, inner: 102.84, length: 30.87 },
  { angle: 134.39, inner: 102.72, length: 25.63 },
  { angle: 145.31, inner: 102.57, length: 32.94 },
  { angle: 155.99, inner: 102.4, length: 17 },
  { angle: 167.19, inner: 102.22, length: 17 },
  { angle: 179.48, inner: 102.0, length: 17 },
  { angle: 190.18, inner: 101.82, length: 17 },
  { angle: 200.98, inner: 101.64, length: 17 },
  { angle: 212.0, inner: 101.46, length: 35.05 },
  { angle: 224.65, inner: 101.29, length: 26.7 },
  { angle: 234.55, inner: 101.2, length: 41.58 },
  { angle: 246.38, inner: 101.08, length: 24.32 },
  { angle: 257.59, inner: 101.02, length: 17 },
  { angle: 270.0, inner: 101.0, length: 17 },
  { angle: 281.44, inner: 101.02, length: 39.48 },
  { angle: 291.53, inner: 101.07, length: 23.54 },
  { angle: 302.98, inner: 101.16, length: 17 },
  { angle: 315.37, inner: 101.29, length: 17 },
  { angle: 326.12, inner: 101.43, length: 17 },
  { angle: 336.95, inner: 101.6, length: 17 },
  { angle: 348.21, inner: 101.79, length: 17 },
]

export const FIGMA_LENGTHS = SPOKES.map((s) => s.length)
