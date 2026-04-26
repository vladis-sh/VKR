import { create } from 'zustand'
import { authApi } from '@/shared/api/auth.api'
import type { User } from '@/entities/types'

const CHECK_AUTH_TIMEOUT_MS = 8000

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  _initialized: boolean
  setUser: (user: User | null) => void
  resetInitialized: () => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  _initialized: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  resetInitialized: () => set({ _initialized: false }),

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore errors on logout
    } finally {
      set({ user: null, isAuthenticated: false, _initialized: false })
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
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
