import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

const defaultTheme: Theme = 'light'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  applyTheme: () => void
}

interface PersistedThemeState {
  theme?: unknown
}

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export const useThemeStore = create<ThemeState>()(
  persist<ThemeState, [], [], PersistedThemeState>(
    (set, get) => ({
      theme: defaultTheme,
      setTheme: (theme) => {
        set({ theme })
        setTimeout(() => get().applyTheme(), 0)
      },
      applyTheme: () => {
        const { theme } = get()
        const root = document.documentElement
        if (theme === 'dark') {
          root.classList.add('dark')
        } else if (theme === 'light') {
          root.classList.remove('dark')
        } else {
          // system
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          if (prefersDark) {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
      },
    }),
    {
      name: 'theme',
      partialize: (state) => ({ theme: state.theme }),
      version: 1,
      migrate: (persistedState, version) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { theme: defaultTheme }
        }

        const { theme } = persistedState as PersistedThemeState

        return {
          theme: version < 1 && theme === 'system'
            ? defaultTheme
            : isTheme(theme)
              ? theme
              : defaultTheme,
        }
      },
    }
  )
)

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const store = useThemeStore.getState()
    if (store.theme === 'system') {
      store.applyTheme()
    }
  })
}
