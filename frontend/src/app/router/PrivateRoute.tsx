import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { FullPageSpinner } from '@/shared/ui/Spinner'

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
