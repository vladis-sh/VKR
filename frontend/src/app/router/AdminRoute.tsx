import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { FullPageSpinner } from '@/shared/ui/Spinner'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/app/roadmaps" replace />
  }

  return <>{children}</>
}
