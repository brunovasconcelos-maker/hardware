import { readItem, writeItem } from './storage.js'

const KEY = 'hardware.history'

// History of saved voice answers, stored in localStorage as an array (oldest first):
// [{ id, timestamp (ISO 8601), historyTitle, title, date, subtitle, body }]  (id = the mock response's id)
export function loadHistory() {
  try {
    const raw = readItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return [] // corrupted JSON
  }
}

// Appends `result` to the history. Returns the saved entry, or null if storage is unavailable (reported in the console).
export function saveToHistory(result) {
  const entry = { id: result.id, timestamp: new Date().toISOString(), historyTitle: result.historyTitle, title: result.title, date: result.date, subtitle: result.subtitle, body: result.body }
  if (writeItem(KEY, JSON.stringify([...loadHistory(), entry]))) return entry
  console.warn('[histórico] Não foi possível salvar no localStorage; a resposta não foi guardada no histórico.')
  return null
}

// Label shown in the Histórico list: the saved historyTitle; entries saved before it existed get it from the mock
// response with the same id, and finally fall back to the entry's own title.
export function historyLabel(entry, responses) {
  return entry.historyTitle ?? responses.find((r) => r.id === entry.id)?.historyTitle ?? entry.title
}
