import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStats } from '@/features/stats/useStats'
import { StatsCards } from '@/widgets/StatsCards'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Button } from '@/shared/ui/Button'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <Skeleton className="h-10 w-10 rounded-xl mb-3" />
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  )
}

export default function StatsPage() {
  const { data: stats, isLoading } = useStats()

  if (isLoading) return <StatsSkeleton />

  if (!stats || stats.completedTests === 0) {
    return (
      <div className="space-y-5">
        <h1 className="text-lg font-bold text-foreground">Статистика</h1>
        <EmptyState
          title="Нет данных"
          description="Пройдите первый тест, чтобы увидеть статистику"
          action={
            <Button asChild>
              <Link to="/app/tests">Начать тест</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const chartData = (stats.recentSessions ?? []).map((s) => ({
    date: formatDate(s.date),
    accuracy: Math.round(s.accuracy),
    correct: s.correctAnswers,
    total: s.totalQuestions,
  })).reverse()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Статистика</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/app/leaderboard">
            <Trophy size={14} />
            Лидерборд
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <StatsCards stats={stats} />

      {/* Accuracy chart */}
      {chartData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Точность за последние тесты
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: 12,
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number) => [`${value}%`, 'Точность']}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-foreground mb-3">Общая точность</h2>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-foreground">
            {stats.totalCorrect + stats.totalIncorrect > 0
              ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100)
              : 0}%
          </span>
          <span className="text-sm text-muted-foreground mb-1">
            {stats.totalCorrect} верных из {stats.totalCorrect + stats.totalIncorrect}
          </span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${
                stats.totalCorrect + stats.totalIncorrect > 0
                  ? (stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100
                  : 0
              }%`
            }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          />
        </div>
      </motion.div>
    </div>
  )
}
