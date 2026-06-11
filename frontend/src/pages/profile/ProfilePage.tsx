import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Edit,
  ClipboardList,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { useThemeStore, type Theme } from '@/features/theme/useThemeStore'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { useState } from 'react'
import { cn } from '@/shared/lib/cn'

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Светлая', icon: <Sun size={15} /> },
  { value: 'dark', label: 'Тёмная', icon: <Moon size={15} /> },
  { value: 'system', label: 'Системная', icon: <Monitor size={15} /> },
]

function LogoutModal({ open, onClose, onConfirm }: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      hideClose
      title="Выйти из аккаунта?"
      description="Текущая сессия завершится, а несохранённые изменения на странице будут потеряны."
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <ShieldAlert size={20} />
        </div>
        <p className="text-sm text-muted-foreground">
          После выхода вы сможете снова войти по email и паролю.
        </p>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Остаться</Button>
        <Button variant="destructive" className="flex-1" onClick={onConfirm}>Выйти</Button>
      </div>
    </Modal>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const [showLogout, setShowLogout] = useState(false)

  const navLinks = [
    { to: '/app/profile/edit', icon: <Edit size={16} />, label: 'Редактировать профиль' },
    { to: '/app/profile/history', icon: <ClipboardList size={16} />, label: 'История тестов' },
  ]

  return (
    <div className="mx-auto max-w-md space-y-5">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm text-center"
      >
        <Avatar
          src={user?.avatarUrl ?? undefined}
          name={user?.fullName || user?.email}
          size="lg"
          className="mx-auto mb-3"
        />
        <h2 className="text-base font-bold text-foreground">{user?.fullName || 'Пользователь'}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
      </motion.div>

      {/* Navigation links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        {navLinks.map(({ to, icon, label }, i) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 px-4 py-3.5 text-sm text-foreground hover:bg-accent transition-colors',
              i !== navLinks.length - 1 && 'border-b border-border'
            )}
          >
            <span className="text-muted-foreground">{icon}</span>
            <span className="flex-1">{label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        ))}
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-4 shadow-sm"
      >
        <p className="text-sm font-semibold text-foreground mb-3">Тема оформления</p>
        <div className="flex gap-2">
          {themes.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 py-2.5 px-2 text-xs font-medium transition-all',
                theme === value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => setShowLogout(true)}
        >
          <LogOut size={16} />
          Выйти из аккаунта
        </Button>
      </motion.div>

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={logout}
      />
    </div>
  )
}
