import { dur } from './motion.js'

// Screen transitions (Stage). Screens mark what moves with data-tx on their elements:
//   data-tx="static"  content that enters/leaves together (title, a list, ...)
//   data-tx="item"    elements around the circle, entering with a small stagger
//   data-tx="shell"   structural pieces (center circle, highlighted segment): they only move when the next screen does not
//                     share them (Menu <-> Configurações keep them in place and only swap the content)
// A screen without data-tx elements moves as a whole. Outgoing content scales down slightly and fades out quickly; incoming
// content scales from slightly larger and fades in, with a spring-like ease-out. The display background is never touched,
// so it stays fully opaque. Scale uses the `scale` property (not `transform`), so elements keep their own CSS transforms.
export const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
export const EXIT_MS = 150
export const ENTER_MS = 280
export const STAGGER_MS = 25
const EXIT_SCALE = 0.92
const ENTER_SCALE = 1.06

function targets(root, shared) {
  const els = [...root.querySelectorAll('[data-tx]')].filter((el) => !(shared && el.dataset.tx === 'shell'))
  return els.length ? els : root.querySelector('[data-tx]') ? [] : [root]
}

// Scale about the center of the display, not about each element's own center.
function setOrigin(el, root) {
  const c = root.closest('.device-display') ?? root
  const r = c.getBoundingClientRect()
  const b = el.getBoundingClientRect()
  el.style.transformOrigin = `${r.left + r.width / 2 - b.left}px ${r.top + r.height / 2 - b.top}px`
}

// Resolves when the exit is done; `cancel()` removes the fill so persistent elements can be shown again.
export function exit(root, { shared = false } = {}) {
  const els = targets(root, shared)
  els.forEach((el) => setOrigin(el, root))
  const anims = els.map((el) =>
    el.animate([{ opacity: 1, scale: '1' }, { opacity: 0, scale: String(EXIT_SCALE) }], { duration: dur(EXIT_MS), easing: EASE, fill: 'forwards' }),
  )
  return {
    done: Promise.all(anims.map((a) => a.finished.catch(() => {}))),
    cancel: () => anims.forEach((a) => a.cancel()),
  }
}

export function enter(root, { shared = false } = {}) {
  const els = targets(root, shared)
  let i = 0
  const anims = els.map((el) => {
    setOrigin(el, root)
    const delay = el.dataset.tx === 'item' ? ++i * STAGGER_MS : 0
    return el.animate([{ opacity: 0, scale: String(ENTER_SCALE) }, { opacity: 1, scale: '1' }], {
      duration: dur(ENTER_MS),
      delay: dur(delay),
      easing: EASE,
      fill: 'backwards',
    })
  })
  return Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => els.forEach((el) => (el.style.transformOrigin = '')))
}
