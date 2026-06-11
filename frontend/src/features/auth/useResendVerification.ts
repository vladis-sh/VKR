import { useEffect, useState } from 'react'
import { authApi } from '@/shared/api/auth.api'
import { toast } from '@/features/theme/useToastStore'

// The server throttles resends to 3/min; the client cooldown keeps users
// from hitting that limit and spamming their own inbox.
const RESEND_COOLDOWN_S = 60

export function useResendVerification() {
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const resend = async () => {
    if (sending || cooldown > 0) return
    setSending(true)
    try {
      await authApi.resendVerification()
      toast.success('Письмо отправлено. Проверьте почту.')
      setCooldown(RESEND_COOLDOWN_S)
    } catch {
      toast.error('Не удалось отправить письмо. Попробуйте позже.')
    } finally {
      setSending(false)
    }
  }

  return { resend, sending, cooldown }
}
