/**
 * localStorage helpers that never throw. Reads/writes degrade to no-ops when
 * storage is unavailable (SSR, Safari private mode, quota exceeded) instead of
 * crashing the calling action.
 */

/** Reads and parses a JSON object, shallow-merged over `fallback`. */
export function readJSON<T extends object>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) }
  } catch {
    return fallback
  }
}

/** Serializes and stores a value. Silently ignores storage failures. */
export function writeJSON(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (quota exceeded / disabled) — ignore.
  }
}
