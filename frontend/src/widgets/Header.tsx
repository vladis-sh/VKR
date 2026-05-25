import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Settings, User } from 'lucide-react'
import { Avatar } from '@/shared/ui/Avatar'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { cn } from '@/shared/lib/cn'

const routeTitles: Record<string, string> = {
  '/app/roadmaps': 'Планы подготовки',
  '/app/chat': 'Чат с ИИ',
  '/app/tests': 'Тесты',
  '/app/tests/topics': 'Выберите тему',
  '/app/tests/time-attack': 'Борьба со временем',
  '/app/tests/one-mistake': 'Одна ошибка',
  '/app/tests/ai': 'Тест от ИИ',
  '/app/live-coding': 'Live Coding',
  '/app/stats': 'Статистика',
  '/app/leaderboard': 'Лидерборд',
  '/app/profile': 'Профиль',
  '/app/profile/edit': 'Редактировать профиль',
  '/app/profile/history': 'История тестов',
}

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const title =
    Object.entries(routeTitles).find(
      ([key]) => pathname.startsWith(key) && (key === pathname || pathname[key.length] === '/')
    )?.[1] ??
    routeTitles[pathname] ??
    ''

  const displayTitle = (() => {
    for (const [key, val] of Object.entries(routeTitles)) {
      if (pathname === key) return val
    }
    if (pathname.startsWith('/app/tests/topic/')) return 'Тест по теме'
    if (pathname.startsWith('/app/tests/theme/')) return 'Тесты по теме'
    if (pathname.startsWith('/app/tests/results/')) return 'Результаты теста'
    if (pathname.startsWith('/app/tests/history/')) return 'Разбор ответов'
    if (pathname.startsWith('/app/live-coding/')) return 'Задача Live Coding'
    return title
  })()

  const profileLinks = [
    { to: '/app/profile', label: 'Профиль', icon: User },
    { to: '/app/profile/edit', label: 'Настройки', icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <h1 className="min-w-0 truncate text-base font-semibold text-foreground">{displayTitle}</h1>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Открыть профиль"
          >
            <Avatar
              src={user?.avatarUrl ?? undefined}
              name={user?.fullName ?? user?.email}
              size="sm"
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={10}
            className="z-50 w-64 rounded-lg border border-border bg-card p-2 shadow-xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-2 pb-3 pt-1">
              <Avatar
                src={user?.avatarUrl ?? undefined}
                name={user?.fullName ?? user?.email}
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.fullName || 'Пользователь'}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="py-2">
              {profileLinks.map(({ to, label, icon: Icon }) => (
                <DropdownMenu.Item key={to} asChild>
                  <Link
                    to={to}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground outline-none transition-colors',
                      'hover:bg-accent focus:bg-accent'
                    )}
                  >
                    <Icon size={15} className="text-muted-foreground" />
                    {label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </div>
            <DropdownMenu.Item asChild>
              <button
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Выйти
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
