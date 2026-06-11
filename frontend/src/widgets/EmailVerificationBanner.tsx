import { useAuthStore } from '@/features/auth/useAuthStore'
import { useResendVerification } from '@/features/auth/useResendVerification'
import { verificationDeadline, formatTimeLeft } from '@/shared/lib/emailVerification'

export function EmailVerificationBanner() {
  const { user } = useAuthStore()
  const { resend, sending, cooldown } = useResendVerification()

  // Show only when the email is explicitly unverified.
  if (!user || user.emailVerified !== false) return null

  const deadline = verificationDeadline(user)
  const msLeft = deadline === null ? 0 : deadline - Date.now()

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
      <span>
        Подтвердите ваш email — мы отправили ссылку на <strong>{user.email}</strong>.
        {msLeft > 0 && (
          <> Без подтверждения доступ закроется через {formatTimeLeft(msLeft)}.</>
        )}
      </span>
      <button
        type="button"
        onClick={resend}
        disabled={sending || cooldown > 0}
        className="shrink-0 self-start rounded-lg border border-amber-400/60 px-3 py-1.5 font-medium text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60 sm:self-auto dark:text-amber-100 dark:hover:bg-amber-500/20"
      >
        {sending
          ? 'Отправляем…'
          : cooldown > 0
            ? `Отправлено (${cooldown} с)`
            : 'Отправить повторно'}
      </button>
    </div>
  )
}
