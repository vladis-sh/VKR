import { useEffect } from 'react'
import { useThemeStore } from '@/features/theme/useThemeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { applyTheme } = useThemeStore()

  useEffect(() => {
    applyTheme()
  }, [applyTheme])

  return <>{children}</>
}
