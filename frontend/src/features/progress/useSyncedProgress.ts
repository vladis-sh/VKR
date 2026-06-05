import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { progressApi } from '@/shared/api/progress.api'
import { readJSON, writeJSON } from '@/shared/lib/safeStorage'

const PUSH_DEBOUNCE_MS = 700

function getScopedLocalKey(localKey: string, userId: string | null) {
  return userId ? `${localKey}.${userId}` : localKey
}

/**
 * Local-first progress state synced to the user's account.
 *
 * - Reads instantly from localStorage so the UI never blocks (offline cache).
 * - On authenticated mount, hydrates from the server (source of truth across
 *   devices); if the account has no record yet, migrates only that user's
 *   scoped local progress up.
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
  const userId = useAuthStore((state) => state.user?.id ?? null)
  const emptyRef = useRef(empty)
  const scopedLocalKey = getScopedLocalKey(localKey, userId)
  const [progress, setProgress] = useState<T>(() =>
    readJSON(
      getScopedLocalKey(localKey, useAuthStore.getState().user?.id ?? null),
      emptyRef.current
    )
  )
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setProgress(readJSON(scopedLocalKey, emptyRef.current))
  }, [scopedLocalKey])

  useEffect(() => {
    return () => {
      if (pushTimer.current) {
        clearTimeout(pushTimer.current)
        pushTimer.current = null
      }
    }
  }, [scopedLocalKey])

  // Hydrate from the server, or migrate this user's local-only progress up.
  useEffect(() => {
    if (!isAuthenticated || !userId) return
    let cancelled = false

    progressApi
      .get<Partial<T>>(namespace)
      .then(({ data: body }) => {
        if (cancelled) return
        if (body.exists) {
          const merged = { ...emptyRef.current, ...body.data }
          setProgress(merged)
          writeJSON(scopedLocalKey, merged)
        } else {
          const local = readJSON(scopedLocalKey, emptyRef.current)
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
  }, [namespace, scopedLocalKey, isAuthenticated, userId])

  // Cross-tab synchronization.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === scopedLocalKey) {
        setProgress(readJSON(scopedLocalKey, emptyRef.current))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [scopedLocalKey])

  const commit = useCallback(
    (updater: (current: T) => T) => {
      setProgress((current) => {
        const next = updater(current)
        writeJSON(scopedLocalKey, next)
        if (isAuthenticated && userId) {
          if (pushTimer.current) clearTimeout(pushTimer.current)
          pushTimer.current = setTimeout(() => {
            progressApi.put(namespace, next).catch(() => {})
          }, PUSH_DEBOUNCE_MS)
        }
        return next
      })
    },
    [namespace, scopedLocalKey, isAuthenticated, userId]
  )

  return { progress, setProgress, commit }
}
