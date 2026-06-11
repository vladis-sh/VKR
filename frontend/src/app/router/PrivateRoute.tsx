import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import { isVerificationExpired } from '@/shared/lib/emailVerification'
import { EmailVerificationLockout } from '@/widgets/EmailVerificationLockout'

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, verificationLockout } = useAuthStore()

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Email-verification grace period is over: lock the app until verified.
  // verificationLockout covers the server-enforced case (clock skew safe),
  // isVerificationExpired covers it client-side without waiting for a 403.
  if (user && (verificationLockout || isVerificationExpired(user))) {
    return <EmailVerificationLockout />
  }

  return <>{children}</>
}
