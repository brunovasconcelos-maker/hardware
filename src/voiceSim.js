// Fake voice-activity simulator for the 32 recording lines (no microphone involved).
//  - loudness envelope: syllable-like bursts separated by short pauses, with an occasional longer pause between
//    "phrases"; the envelope eases toward each target (fast attack, slower release), so it never jumps;
//  - spatial profile: a smooth field over the circle (a few low harmonics whose phases drift), so neighbouring
//    lines are strongly correlated, plus a little low-passed jitter for liveliness;
//  - every line also eases toward its own target, which bounds the change per frame.
const TAU = Math.PI * 2
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const rand = (rng, a, b) => a + rng() * (b - a)

export function createVoiceSimulator({ count = 32, min = 0.01, max = 56, rng = Math.random } = {}) {
  const harmonics = [1, 2, 3, 4].map((k) => ({ k, amp: 1 / k ** 0.7, phase: rand(rng, 0, TAU), speed: rand(rng, 0.5, 1.4) * (rng() < 0.5 ? -1 : 1) }))
  const ampSum = harmonics.reduce((s, h) => s + h.amp, 0)
  const lengths = new Array(count).fill(min)
  const jitter = new Array(count).fill(0)
  let env = 0
  let target = 0
  let hold = 0.15 // short silence before the first syllable
  let syllablesLeft = 4
  let t = 0

  function nextTarget() {
    if (syllablesLeft <= 0) {
      target = rand(rng, 0.02, 0.08) // pause between phrases
      hold = rand(rng, 0.35, 0.8)
      syllablesLeft = 3 + Math.floor(rng() * 5)
    } else if (rng() < 0.12) {
      target = rand(rng, 0.03, 0.1) // short breath between syllables
      hold = rand(rng, 0.1, 0.25)
    } else {
      target = rand(rng, 0.5, 1) // syllable burst
      hold = rand(rng, 0.11, 0.26)
      syllablesLeft -= 1
    }
  }

  return {
    // Advance by dt seconds (clamped); returns the (shared) array of line lengths in px.
    step(dtRaw) {
      const dt = clamp(dtRaw, 0.001, 0.05)
      t += dt
      hold -= dt
      if (hold <= 0) nextTarget()
      env += (target - env) * (1 - Math.exp(-dt / (target > env ? 0.06 : 0.1)))
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * TAU
        let p = 0
        for (const h of harmonics) p += h.amp * Math.sin(h.k * theta + h.phase + h.speed * t)
        const profile = (p / ampSum + 1) / 2 // 0..1, smooth around the circle
        jitter[i] += (rng() * 2 - 1 - jitter[i]) * (1 - Math.exp(-dt / 0.1))
        const level = clamp(env * (0.3 + 0.7 * profile + 0.16 * jitter[i]), 0, 1)
        const goal = min + (max - min) * level
        lengths[i] += (goal - lengths[i]) * (1 - Math.exp(-dt / 0.06))
      }
      return lengths
    },
    get envelope() {
      return env
    },
    lengths,
  }
}
