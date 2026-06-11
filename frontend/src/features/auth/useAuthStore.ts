import { create } from 'zustand'
import { authApi } from '@/shared/api/auth.api'
import type { User } from '@/entities/types'

// Generous timeout so a slow connection doesn't kick a valid session to /login.
const CHECK_AUTH_TIMEOUT_MS = 20_000

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  /**
   * True when the server rejected a request with EMAIL_NOT_VERIFIED —
   * the verification grace period is over and the app must be locked.
   * Cleared as soon as checkAuth sees a verified user.
   */
  verificationLockout: boolean
  _initialized: boolean
  setUser: (user: User | null) => void
  setVerificationLockout: (locked: boolean) => void
  resetInitialized: () => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  verificationLockout: false,
  _initialized: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setVerificationLockout: (locked) => set({ verificationLockout: locked }),

  resetInitialized: () => set({ _initialized: false }),

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore errors on logout
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        verificationLockout: false,
        _initialized: false,
      })
    }
  },

  checkAuth: async () => {
    if (get()._initialized) return
    set({ isLoading: true, _initialized: true })
    try {
      const response = await Promise.race([
        authApi.me(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('auth-timeout')),
            CHECK_AUTH_TIMEOUT_MS
          )
        ),
      ])
      const user = response.data.user
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        // A verified user is never locked out; an unverified one keeps the
        // current lockout state until the server says otherwise.
        ...(user.emailVerified !== false && { verificationLockout: false }),
      })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
