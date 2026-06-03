import { NavLink } from 'react-router-dom'
import {
  BarChart2,
  ClipboardList,
  Database,
  FileCheck2,
  Map,
  MessageSquare,
  Shield,
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useAuthStore } from '@/features/auth/useAuthStore'

const navItems = [
  { to: '/app/roadmaps', label: 'План подготовки', icon: Map },
  { to: '/app/chat', label: 'Чат с ИИ', icon: MessageSquare },
  { to: '/app/tests', label: 'Тесты', icon: ClipboardList },
  // { to: '/app/live-coding', label: 'Live Coding', icon: Code2 },
  { to: '/app/stats', label: 'Статистика', icon: BarChart2 },
]

const adminNavItems = [
  { to: '/app/admin/content', label: 'Content DB (admin)', icon: Database },
  { to: '/app/admin/content/sources', label: 'Источники (admin)', icon: Database },
  { to: '/app/admin/content/candidates', label: 'Модерация (admin)', icon: FileCheck2 },
  { to: '/app/admin/materials', label: 'Материалы (admin)', icon: Shield },
  { to: '/app/admin/questions', label: 'Вопросы (admin)', icon: Shield },
]

export function Sidebar() {
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin')

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center px-5 py-5 border-b border-border">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Меню
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="mt-3 px-3 pt-3 border-t border-border text-[10px] uppercase tracking-wide text-muted-foreground">
              Администрирование
            </div>
            {adminNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}
