import { useLocation } from 'react-router-dom'
import { Avatar } from '@/shared/ui/Avatar'
import { useAuthStore } from '@/features/auth/useAuthStore'

const routeTitles: Record<string, string> = {
  '/app/materials': 'Материалы',
  '/app/materials/favorites': 'Избранное',
  '/app/chat': 'Чат с ИИ',
  '/app/tests': 'Тесты',
  '/app/tests/topics': 'Выберите тему',
  '/app/tests/time-attack': 'Борьба со временем',
  '/app/tests/one-mistake': 'Одна ошибка',
  '/app/tests/ai': 'Тест от ИИ',
  '/app/stats': 'Статистика',
  '/app/leaderboard': 'Лидерборд',
  '/app/profile': 'Профиль',
  '/app/profile/edit': 'Редактировать профиль',
  '/app/profile/history': 'История тестов',
  '/app/profile/notifications': 'Уведомления',
}

export function Header() {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)

  const title = Object.entries(routeTitles).find(([key]) =>
    pathname.startsWith(key) && (key === pathname || pathname[key.length] === '/')
  )?.[1] ?? routeTitles[pathname] ?? 'PrepAI'

  const displayTitle = (() => {
    for (const [key, val] of Object.entries(routeTitles)) {
      if (pathname === key) return val
    }
    if (pathname.startsWith('/app/tests/topic/')) return 'Тест по теме'
    if (pathname.startsWith('/app/tests/results/')) return 'Результаты теста'
    if (pathname.startsWith('/app/tests/history/')) return 'Разбор ответов'
    return title
  })()

  return (
    <header className="hidden md:flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-base font-semibold text-foreground">{displayTitle}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{user?.fullName}</span>
        <Avatar
          src={user?.avatarUrl ?? undefined}
          name={user?.fullName ?? user?.email}
          size="sm"
        />
      </div>
    </header>
  )
}
