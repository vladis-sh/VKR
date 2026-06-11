import type { User } from '@/entities/types'

// How long a user may use the app before confirming their email.
// Keep in sync with EMAIL_VERIFY_GRACE_MS in backend/src/common/guards/jwt-auth.guard.ts
export const EMAIL_VERIFY_GRACE_MS = 3 * 24 * 60 * 60 * 1000 // 3 дня

/** Timestamp (ms) after which an unverified user is locked out, or null if verified. */
export function verificationDeadline(user: User): number | null {
  if (user.emailVerified !== false) return null
  return new Date(user.createdAt).getTime() + EMAIL_VERIFY_GRACE_MS
}

export function isVerificationExpired(user: User, now = Date.now()): boolean {
  const deadline = verificationDeadline(user)
  return deadline !== null && now > deadline
}

function plural(n: number, forms: [string, string, string]): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return forms[0]
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1]
  return forms[2]
}

/**
 * «2 дня», «5 часов», «10 минут» — округляет вниз, чтобы не обещать
 * больше времени, чем осталось до дедлайна; минимум одна минута.
 */
export function formatTimeLeft(ms: number): string {
  const minutes = Math.max(1, Math.floor(ms / 60_000))
  if (minutes < 60) return `${minutes} ${plural(minutes, ['минуту', 'минуты', 'минут'])}`
  const hours = Math.floor(ms / 3_600_000)
  if (hours < 24) return `${hours} ${plural(hours, ['час', 'часа', 'часов'])}`
  const days = Math.floor(ms / 86_400_000)
  return `${days} ${plural(days, ['день', 'дня', 'дней'])}`
}
