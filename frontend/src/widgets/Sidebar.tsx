import { NavLink } from 'react-router-dom'
import { Database, Shield } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { MAIN_NAV } from '@/shared/config/nav'

const adminNavItems = [
  { to: '/app/admin/content', label: 'Content DB (admin)', icon: Database },
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
        {MAIN_NAV.map(({ to, label, icon: Icon }) => (
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
