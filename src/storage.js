// localStorage access that never throws (private windows, blocked site data...). Callers decide what to report.
export function readItem(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

// Returns false when the value could not be stored.
export function writeItem(key, value) {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}
