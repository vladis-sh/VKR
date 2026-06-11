import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { router } from './app/router'
import { QueryProvider } from './app/providers/QueryProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { ToastContainer } from './shared/ui/Toast'
import { useAuthStore } from './features/auth/useAuthStore'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()

    // Listen for auth logout event from axios interceptor.
    // Reset _initialized so a fresh checkAuth can run after re-login.
    const handler = () => {
      const store = useAuthStore.getState()
      store.setUser(null)
      store.resetInitialized()
    }
    window.addEventListener('auth:logout', handler)

    // Server rejected a request with EMAIL_NOT_VERIFIED — lock the app
    // until the user confirms their email.
    const lockHandler = () => {
      useAuthStore.getState().setVerificationLockout(true)
    }
    window.addEventListener('auth:email-unverified', lockHandler)

    return () => {
      window.removeEventListener('auth:logout', handler)
      window.removeEventListener('auth:email-unverified', lockHandler)
    }
  }, [checkAuth])

  return <>{children}</>
}

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthInitializer>
          {/* Opt in to the v7 behavior to silence the future-flag console warning. */}
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
          <ToastContainer />
        </AuthInitializer>
      </ThemeProvider>
    </QueryProvider>
  )
}
