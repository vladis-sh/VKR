/**
 * Email domains of Russian mail providers allowed for registration.
 * Keep in sync with backend/src/auth/russian-email.ts
 */
export const RUSSIAN_EMAIL_DOMAINS = [
  // VK / Mail.ru group
  'mail.ru',
  'inbox.ru',
  'list.ru',
  'bk.ru',
  'internet.ru',
  'vk.com',
  // Yandex
  'yandex.ru',
  'ya.ru',
  'narod.ru',
  // Rambler group
  'rambler.ru',
  'lenta.ru',
  'autorambler.ru',
  'myrambler.ru',
  'ro.ru',
]

export const RUSSIAN_EMAIL_MESSAGE = 'Для регистрации используйте российский почтовый сервис'

export function isRussianEmail(email: string): boolean {
  const at = email.lastIndexOf('@')
  if (at === -1) return false
  const domain = email.slice(at + 1).trim().toLowerCase()
  return RUSSIAN_EMAIL_DOMAINS.includes(domain)
}
