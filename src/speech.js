// Reads a result aloud with the Web Speech API (speechSynthesis), language pt-BR:
// title, date, subtitle, then the body (split into sentences, which also avoids Chrome cutting long utterances).
// If no pt-BR voice is installed, the default voice is used and a warning is logged to the console.
const LANG = 'pt-BR'
const isPtBR = (v) => /^pt[-_]br$/i.test(v.lang)

function sentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean)
}

export function speakResult(result) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
  if (!synth || typeof window.SpeechSynthesisUtterance === 'undefined') {
    console.warn('[voz] speechSynthesis não está disponível neste navegador; a resposta não será lida em voz alta.')
    return { cancel() {} }
  }
  let cancelled = false
  let timer = 0
  let waitingForVoices = null

  const start = () => {
    if (cancelled) return
    const voices = synth.getVoices()
    const voice = voices.find(isPtBR)
    if (!voice) {
      console.warn(`[voz] Nenhuma voz pt-BR disponível (${voices.length} voz(es) instalada(s)); usando a voz padrão do navegador.`)
    }
    for (const text of [result.title, result.date, result.subtitle, ...sentences(result.body)]) {
      const u = new window.SpeechSynthesisUtterance(text)
      u.lang = LANG
      if (voice) u.voice = voice
      synth.speak(u)
    }
  }

  synth.cancel()
  timer = setTimeout(() => {
    // Voices load asynchronously in some browsers: wait briefly for them before falling back.
    if (synth.getVoices().length || !synth.addEventListener) return start()
    const done = () => {
      synth.removeEventListener?.('voiceschanged', done)
      clearTimeout(waitingForVoices)
      start()
    }
    synth.addEventListener('voiceschanged', done)
    waitingForVoices = setTimeout(done, 1000)
  }, 60)

  return {
    cancel() {
      cancelled = true
      clearTimeout(timer)
      clearTimeout(waitingForVoices)
      synth.cancel()
    },
  }
}

export function cancelSpeech() {
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
}
