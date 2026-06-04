import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { EmailVerificationBanner } from './EmailVerificationBanner'
import { cn } from '@/shared/lib/cn'

export function AppLayout() {
  const { pathname } = useLocation()
  const isWidePage = pathname.startsWith('/app/live-coding/')

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Desktop Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className={cn('mx-auto p-4 md:p-6', isWidePage ? 'max-w-7xl' : 'max-w-5xl')}>
            <EmailVerificationBanner />
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  )
}
