import { useState } from 'react'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { authApi } from '@/shared/api/auth.api'
import { toast } from '@/features/theme/useToastStore'

export function EmailVerificationBanner() {
  const { user } = useAuthStore()
  const [sending, setSending] = useState(false)

  // Show only when the email is explicitly unverified.
  if (!user || user.emailVerified !== false) return null

  const resend = async () => {
    setSending(true)
    try {
      await authApi.resendVerification()
      toast.success('Письмо отправлено. Проверьте почту.')
    } catch {
      toast.error('Не удалось отправить письмо. Попробуйте позже.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
      <span>
        Подтвердите ваш email — мы отправили ссылку на <strong>{user.email}</strong>.
      </span>
      <button
        type="button"
        onClick={resend}
        disabled={sending}
        className="shrink-0 self-start rounded-lg border border-amber-400/60 px-3 py-1.5 font-medium text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60 sm:self-auto dark:text-amber-100 dark:hover:bg-amber-500/20"
      >
        {sending ? 'Отправляем…' : 'Отправить повторно'}
      </button>
    </div>
  )
}
