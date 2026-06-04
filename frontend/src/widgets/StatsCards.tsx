import { CheckCircle, XCircle, Clock, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import type { UserStats } from '@/entities/types'
import { formatDuration } from '@/shared/lib/formatDuration'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  delay?: number
}

function StatCard({ icon, label, value, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  )
}

interface StatsCardsProps {
  stats: UserStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={<CheckCircle size={20} className="text-green-600" />}
        label="Правильных ответов"
        value={String(stats.totalCorrect)}
        color="bg-green-100 dark:bg-green-900/30"
        delay={0}
      />
      <StatCard
        icon={<XCircle size={20} className="text-red-500" />}
        label="Неправильных"
        value={String(stats.totalIncorrect)}
        color="bg-red-100 dark:bg-red-900/30"
        delay={0.05}
      />
      <StatCard
        icon={<Trophy size={20} className="text-amber-500" />}
        label="Тестов пройдено"
        value={String(stats.completedTests)}
        color="bg-amber-100 dark:bg-amber-900/30"
        delay={0.1}
      />
      <StatCard
        icon={<Clock size={20} className="text-blue-500" />}
        label="Время обучения"
        value={formatDuration(stats.totalTimeSeconds)}
        color="bg-blue-100 dark:bg-blue-900/30"
        delay={0.15}
      />
    </div>
  )
}
