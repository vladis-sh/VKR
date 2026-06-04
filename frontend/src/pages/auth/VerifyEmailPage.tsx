import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authApi } from '@/shared/api/auth.api'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { getApiErrorMessage } from '@/shared/lib/apiErrors'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    if (!token) {
      setStatus('error')
      setMessage('Ссылка некорректна — в ней нет токена.')
      return
    }

    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus('success')
        // Refresh the session user (if logged in here) so the banner clears.
        const store = useAuthStore.getState()
        store.resetInitialized()
        void store.checkAuth()
      })
      .catch((err: unknown) => {
        setStatus('error')
        setMessage(
          getApiErrorMessage(err, 'Не удалось подтвердить email. Возможно, ссылка устарела.')
        )
      })
  }, [token])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {status === 'loading' && (
            <p className="text-sm text-muted-foreground">Подтверждаем ваш email…</p>
          )}

          {status === 'success' && (
            <>
              <h1 className="text-xl font-bold text-foreground mb-2">Email подтверждён ✓</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Спасибо! Ваш адрес успешно подтверждён.
              </p>
              <Link to="/app" className="text-primary hover:underline font-medium">
                Перейти в приложение
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className="text-xl font-bold text-foreground mb-2">Не получилось</h1>
              <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2 mb-6">
                {message}
              </p>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Вернуться ко входу
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
