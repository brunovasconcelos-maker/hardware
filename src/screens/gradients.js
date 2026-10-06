// Gradient layer sets for the full-screen views (650x650 orbs). First layer is on top.
// Colors were sampled from the Figma screenshots because the gradient fills are raster images.
const blob = (at, size, color) => ({
  type: 'radial',
  at,
  size,
  stops: [[color, '0%'], [`${color}00`, '100%']],
})
const linear = (angle, stops) => ({ type: 'linear', angle, stops })

// Bateria and Wi-fi share the same gradient in Figma.
export const batteryGradient = {
  base: '#3a74dc',
  layers: [
    blob('22% 94%', '52%', '#7ad0dd'),
    blob('88% 42%', '38%', '#68a0de'),
    blob('98% 88%', '38%', '#2263de'),
    linear('150deg', [['#0511d9', '0%'], ['#1330db', '30%'], ['#3a74dc', '52%'], ['#5db5de', '75%'], ['#45a6de', '100%']]),
  ],
}

export const tasksGradient = {
  base: '#6a0cc0',
  layers: [
    blob('0% 50%', '45%', '#2c0068'),
    linear('160deg', [['#330075', '0%'], ['#5509b8', '38%'], ['#7c0bb1', '58%'], ['#b00d78', '80%'], ['#cf0f5a', '100%']]),
  ],
}

export const usageWeeklyGradient = {
  base: '#8a6a9a',
  layers: [
    blob('6% 84%', '58%', '#3fc078'),
    blob('52% 108%', '38%', '#55b07c'),
    linear('206deg', [['#6a0b3a', '0%'], ['#6a0d3c', '36%'], ['#9a78b8', '46%'], ['#e6dcec', '56%'], ['#c4acd8', '72%'], ['#c8b0d4', '100%']]),
  ],
}

export const usageDailyGradient = {
  base: '#cf37c4',
  layers: [
    blob('2% 94%', '58%', '#3f48d4'),
    blob('96% 104%', '54%', '#e0143f'),
    blob('42% 46%', '28%', '#e88cdc'),
    blob('0% 46%', '34%', '#a63bd0'),
    linear('180deg', [['#b0a4d8', '0%'], ['#bd77d9', '22%'], ['#cf37c4', '40%'], ['#d9269f', '70%'], ['#de2887', '90%']]),
  ],
}

export const weatherGradient = {
  base: '#cc8a78',
  layers: [
    blob('22% 12%', '46%', '#e8dc9c'),
    blob('8% 56%', '48%', '#d4623e'),
    blob('76% 50%', '38%', '#c24ac8'),
    blob('90% 12%', '34%', '#c890c8'),
    blob('55% 100%', '40%', '#d25d8b'),
    blob('100% 90%', '34%', '#cbb69d'),
  ],
}

export const calendarGradient = {
  base: '#de4cae',
  layers: [
    blob('36% 108%', '44%', '#e2d3c0'),
    blob('14% 96%', '40%', '#dd8aab'),
    blob('98% 56%', '34%', '#e0558c'),
    blob('100% 100%', '30%', '#d878c0'),
  ],
}

export const clockGradient = {
  base: '#7a30a8',
  layers: [
    blob('0% 50%', '46%', '#b03a82'),
    blob('100% 22%', '50%', '#3a34b8'),
    blob('86% 100%', '50%', '#94a4e8'),
    blob('25% 112%', '55%', '#d7b0e2'),
    linear('180deg', [['#542a8c', '0%'], ['#7a30a8', '50%'], ['#7b3bb2', '62%'], ['#8e6cd0', '82%'], ['#a590dc', '100%']]),
  ],
}

export const digitalClockGradient = {
  base: '#0d1451',
  layers: [
    blob('0% 56%', '36%', '#cfe0e2'),
    blob('0% 102%', '58%', '#ecd48e'),
    blob('56% 108%', '40%', '#cdb9cc'),
    linear('202deg', [['#0d1451', '0%'], ['#0d1551', '30%'], ['#29376b', '45%'], ['#7a91b6', '62%'], ['#b5bfdd', '78%'], ['#d2c6cf', '100%']]),
  ],
}
