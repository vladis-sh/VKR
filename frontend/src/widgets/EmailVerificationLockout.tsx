import { useState } from 'react'
import { MailWarning } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/Button'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { useResendVerification } from '@/features/auth/useResendVerification'
import { toast } from '@/features/theme/useToastStore'

/**
 * Full-screen lock shown by PrivateRoute when the email-verification
 * grace period has expired. The user can resend the email, re-check
 * after confirming in another tab, or log out.
 */
export function EmailVerificationLockout() {
  const { user, logout } = useAuthStore()
  const { resend, sending, cooldown } = useResendVerification()
  const [checking, setChecking] = useState(false)

  const recheck = async () => {
    setChecking(true)
    try {
      const store = useAuthStore.getState()
      store.resetInitialized()
      await store.checkAuth()
      const fresh = useAuthStore.getState().user
      if (fresh && fresh.emailVerified === false) {
        toast.error('Email ещё не подтверждён. Перейдите по ссылке из письма.')
      }
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15">
            <MailWarning size={26} className="text-amber-600 dark:text-amber-400" />
          </div>

          <h1 className="mb-2 text-xl font-bold text-foreground">Подтвердите ваш email</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Время на подтверждение истекло, доступ к приложению приостановлен. Перейдите по
            ссылке из письма, отправленного на{' '}
            <strong className="text-foreground">{user?.email}</strong>, — и всё снова заработает.
          </p>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={resend}
              loading={sending}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Отправить снова через ${cooldown} с` : 'Отправить письмо ещё раз'}
            </Button>

            <Button variant="outline" className="w-full" onClick={recheck} loading={checking}>
              Я подтвердил — проверить
            </Button>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => logout()}
            >
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
