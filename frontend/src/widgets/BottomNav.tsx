import { NavLink } from 'react-router-dom'
import { MessageSquare, ClipboardList, BarChart2, Code2, Map } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const navItems = [
  { to: '/app/roadmaps', label: 'Роадмап', icon: Map },
  { to: '/app/chat', label: 'Чат', icon: MessageSquare },
  { to: '/app/tests', label: 'Тесты', icon: ClipboardList },
  { to: '/app/live-coding', label: 'Кодинг', icon: Code2 },
  { to: '/app/stats', label: 'Статы', icon: BarChart2 },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card/95 backdrop-blur md:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
