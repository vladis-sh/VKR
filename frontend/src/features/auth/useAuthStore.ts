import { create } from 'zustand'
import { authApi } from '@/shared/api/auth.api'
import type { User } from '@/entities/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  _initialized: boolean
  setUser: (user: User | null) => void
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

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore errors on logout
    } finally {
      set({ user: null, isAuthenticated: false })
    }
  },

  checkAuth: async () => {
    if (get()._initialized) return
    set({ isLoading: true, _initialized: true })
    try {
      const response = await authApi.me()
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
