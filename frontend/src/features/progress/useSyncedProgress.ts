import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { progressApi } from '@/shared/api/progress.api'
import { readJSON, writeJSON } from '@/shared/lib/safeStorage'

const PUSH_DEBOUNCE_MS = 700

/**
 * Local-first progress state synced to the user's account.
 *
 * - Reads instantly from localStorage so the UI never blocks (offline cache).
 * - On authenticated mount, hydrates from the server (source of truth across
 *   devices); if the account has no record yet, migrates existing local
 *   progress up.
 * - Writes update the cache synchronously and debounce-push to the server.
 *
 * Keeps a synchronous `{ progress, commit }` API so consumers don't need
 * loading states — if the network/account is unavailable it transparently
 * behaves like the previous localStorage-only implementation.
 */
export function useSyncedProgress<T extends object>(
  namespace: string,
  localKey: string,
  empty: T
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const emptyRef = useRef(empty)
  const [progress, setProgress] = useState<T>(() => readJSON(localKey, emptyRef.current))
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hydrate from the server, or migrate local-only progress up on first login.
  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false

    progressApi
      .get<Partial<T>>(namespace)
      .then(({ data: body }) => {
        if (cancelled) return
        if (body.exists) {
          const merged = { ...emptyRef.current, ...body.data }
          setProgress(merged)
          writeJSON(localKey, merged)
        } else {
          const local = readJSON(localKey, emptyRef.current)
          if (JSON.stringify(local) !== JSON.stringify(emptyRef.current)) {
            progressApi.put(namespace, local).catch(() => {})
          }
        }
      })
      .catch(() => {
        // Offline or request failed — keep using the local cache.
      })

    return () => {
      cancelled = true
    }
  }, [namespace, localKey, isAuthenticated])

  // Cross-tab synchronization.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === localKey) {
        setProgress(readJSON(localKey, emptyRef.current))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [localKey])

  const commit = useCallback(
    (updater: (current: T) => T) => {
      setProgress((current) => {
        const next = updater(current)
        writeJSON(localKey, next)
        if (isAuthenticated) {
          if (pushTimer.current) clearTimeout(pushTimer.current)
          pushTimer.current = setTimeout(() => {
            progressApi.put(namespace, next).catch(() => {})
          }, PUSH_DEBOUNCE_MS)
        }
        return next
      })
    },
    [namespace, localKey, isAuthenticated]
  )

  return { progress, setProgress, commit }
}
