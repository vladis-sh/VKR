import { NavLink } from 'react-router-dom'
import {
  BookOpen,
  MessageSquare,
  ClipboardList,
  BarChart2,
  Code2,
  BrainCircuit,
  Map,
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const navItems = [
  { to: '/app/materials', label: 'Материалы', icon: BookOpen },
  { to: '/app/chat', label: 'Чат с ИИ', icon: MessageSquare },
  { to: '/app/tests', label: 'Тесты', icon: ClipboardList },
  { to: '/app/live-coding', label: 'Live Coding', icon: Code2 },
  { to: '/app/roadmaps', label: 'Роадмапы', icon: Map },
  { to: '/app/stats', label: 'Статистика', icon: BarChart2 },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <BrainCircuit size={18} className="text-white" />
        </div>
        <span className="text-base font-semibold text-foreground tracking-tight">PrepAI</span>
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
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">PrepAI v1.0</p>
      </div>
    </aside>
  )
}
