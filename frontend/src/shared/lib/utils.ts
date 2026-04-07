import type { KnowledgeLevel } from '@/entities/types'

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}с`
  if (secs === 0) return `${mins}м`
  return `${mins}м ${secs}с`
}

export function formatDurationLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}ч ${mins}м`
  if (mins > 0) return `${mins} мин`
  return `${seconds} сек`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'только что'
  if (diffMins < 60) return `${diffMins} мин назад`
  if (diffHours < 24) return `${diffHours} ч назад`
  if (diffDays < 7) return `${diffDays} дн назад`
  return formatDate(dateString)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function getLevelLabel(level: KnowledgeLevel): string {
  const labels: Record<KnowledgeLevel, string> = {
    junior: 'Junior',
    middle: 'Middle',
    senior: 'Senior',
  }
  return labels[level]
}

export function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    topic: 'По темам',
    'time-attack': 'Борьба со временем',
    'one-mistake': 'Одна ошибка',
    ai: 'Тест от ИИ',
  }
  return labels[mode] ?? mode
}

export function getAssistantRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    hr: 'HR-интервью',
    technical: 'Техническое',
    algorithms: 'Алгоритмы',
  }
  return labels[role] ?? role
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function percentage(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}
