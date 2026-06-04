import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { MAIN_NAV } from '@/shared/config/nav'

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card/95 backdrop-blur md:hidden">
      {MAIN_NAV.map(({ to, shortLabel, icon: Icon }) => (
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
              <span>{shortLabel}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
