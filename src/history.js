const KEY = 'hardware.history'

// History of saved voice answers, stored in localStorage as an array (oldest first):
// [{ timestamp (ISO 8601), title, date, subtitle, body }]
export function loadHistory() {
  try {
    const raw = window.localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

// Appends `result` to the history. Returns the saved entry, or null if storage is unavailable (reported in the console).
export function saveToHistory(result) {
  const entry = { timestamp: new Date().toISOString(), title: result.title, date: result.date, subtitle: result.subtitle, body: result.body }
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...loadHistory(), entry]))
    return entry
  } catch (err) {
    console.warn('[histórico] Não foi possível salvar no localStorage; a resposta não foi guardada no histórico.', err)
    return null
  }
}
