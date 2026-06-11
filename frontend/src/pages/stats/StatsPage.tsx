import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Heart,
  History,
  PieChart as PieIcon,
  Sparkles,
  Timer,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TestMode } from '@/entities/types'
import { useStats } from '@/features/stats/useStats'
import { useLiveCodingTasks } from '@/features/live-coding/useLiveCodingTasks'
import { useLiveCodingProgress } from '@/features/live-coding/useLiveCodingProgress'
import { useRoadmaps } from '@/features/roadmap/useRoadmaps'
import { useAllRoadmapProgress } from '@/features/roadmap/useRoadmapProgress'
import { StatsCards } from '@/widgets/StatsCards'
import { PracticeStats } from '@/widgets/PracticeStats'
import { CircularProgress } from '@/shared/ui/CircularProgress'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Button } from '@/shared/ui/Button'
import { formatDuration } from '@/shared/lib/formatDuration'
import { cn } from '@/shared/lib/cn'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function accuracyTone(value: number) {
  if (value >= 80) return 'bg-success/10 text-success'
  if (value >= 50) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  return 'bg-destructive/10 text-destructive'
}

// Maps every stored test mode (both snake_case from the DB and the hyphenated
// client variants) to a human label and an icon, so each recent test row shows
// what kind of test it was at a glance.
const MODE_META: Record<string, { label: string; icon: LucideIcon }> = {
  topic: { label: 'По теме', icon: BookOpen },
  time_attack: { label: 'Борьба со временем', icon: Timer },
  'time-attack': { label: 'Борьба со временем', icon: Timer },
  one_mistake: { label: 'Одна ошибка', icon: Heart },
  'one-mistake': { label: 'Одна ошибка', icon: Heart },
  ai_generated: { label: 'Тест от ИИ', icon: Sparkles },
  ai: { label: 'Тест от ИИ', icon: Sparkles },
}

function modeMeta(mode: TestMode) {
  return MODE_META[mode] ?? { label: mode, icon: History }
}

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  fontSize: 12,
  color: 'hsl(var(--foreground))',
} as const

function SectionCard({
  icon,
  title,
  subtitle,
  action,
  delay = 0,
  className,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn('rounded-2xl border border-border bg-card p-5 shadow-sm', className)}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  )
}

function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  )
}

export default function StatsPage() {
  const { data: stats, isLoading } = useStats()

  // Practice & learning progress is local-first (no extra loading state) and is
  // shown alongside the test-based statistics below.
  const { data: tasks = [] } = useLiveCodingTasks()
  const { data: roadmaps = [] } = useRoadmaps()
  const { progress: lcProgress } = useLiveCodingProgress()
  const completedByRoadmap = useAllRoadmapProgress()

  const practice = useMemo(() => {
    const solvedSet = new Set(lcProgress.solved)
    const freeTasks = tasks.filter((task) => !task.isPremium)
    const tasksSolved = freeTasks.filter((task) => solvedSet.has(task.id)).length

    let nodesTotal = 0
    let nodesDone = 0
    for (const roadmap of roadmaps) {
      const nodeIds = new Set(roadmap.stages.flatMap((stage) => stage.nodes.map((node) => node.id)))
      nodesTotal += nodeIds.size
      // Only count completions that still map to an existing node.
      nodesDone += (completedByRoadmap[roadmap.slug] ?? []).filter((id) => nodeIds.has(id)).length
    }

    const favoritesSet = new Set(lcProgress.favorites)
    const favoriteTasks = tasks
      .filter((task) => favoritesSet.has(task.id))
      .map((task) => ({
        slug: task.slug,
        title: task.title,
        category: task.category,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        solved: solvedSet.has(task.id),
      }))

    return {
      tasksSolved,
      tasksTotal: freeTasks.length,
      nodesDone,
      nodesTotal,
      favoriteTasks,
    }
  }, [tasks, roadmaps, lcProgress.solved, lcProgress.favorites, completedByRoadmap])

  const hasPracticeData = practice.tasksTotal > 0 || practice.nodesTotal > 0
  const hasPracticeActivity =
    practice.tasksSolved > 0 || practice.nodesDone > 0 || practice.favoriteTasks.length > 0
  const practiceSection = hasPracticeData ? <PracticeStats {...practice} /> : null

  if (isLoading) return <StatsSkeleton />

  if (!stats || stats.completedTests === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Статистика</h1>
        {hasPracticeActivity && practiceSection}
        <EmptyState
          title="Пока нет данных о тестах"
          description="Пройдите первый тест, чтобы увидеть подробную статистику по тестированию"
          action={
            <Button asChild>
              <Link to="/app/tests">Начать тест</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const totalAnswered = stats.totalCorrect + stats.totalIncorrect
  // The server already computes the weighted overall accuracy.
  const accuracy = Math.round(stats.accuracy)

  // recentSessions arrive newest-first; reverse for chronological charts.
  const recentChronological = [...stats.recentSessions].reverse()
  // Two tests on the same day would get identical X-axis labels, so add the
  // time as soon as any label repeats.
  const dayLabels = recentChronological.map((s) => formatDate(s.date))
  const needsTime = new Set(dayLabels).size !== dayLabels.length
  const chartData = recentChronological.map((s, i) => ({
    date: needsTime ? formatDateTime(s.date) : dayLabels[i],
    accuracy: Math.round(s.accuracy),
    durationSeconds: s.durationSeconds,
  }))
  const showTrend = chartData.length > 1

  const recentDurations = chartData.map((d) => d.durationSeconds)
  const recentAvg = recentDurations.length
    ? Math.round(recentDurations.reduce((sum, value) => sum + value, 0) / recentDurations.length)
    : 0
  const recentBest = recentDurations.length ? Math.min(...recentDurations) : 0
  // With a single test the "fastest" highlight and average line are redundant.
  const showDurationCompare = chartData.length > 1

  // Resolve every row's display state once instead of per render row.
  const recentRows = stats.recentSessions.map((session) => {
    const meta = modeMeta(session.mode)
    const topic = session.topic?.trim()
    const acc = Math.round(session.accuracy)
    return {
      sessionId: session.sessionId,
      icon: meta.icon,
      // Topic names the test; fall back to the mode label when there is none.
      title: topic || meta.label,
      // Only show the mode badge when it would add info beyond the title.
      badge: topic ? meta.label : null,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      duration: formatDuration(session.durationSeconds),
      date: formatDate(session.date),
      acc,
      accTone: accuracyTone(acc),
    }
  })

  const donutData = [
    { name: 'Верные', value: stats.totalCorrect, color: 'hsl(var(--success))' },
    { name: 'Неверные', value: stats.totalIncorrect, color: 'hsl(var(--destructive))' },
  ]

  // Keep the headline and the encouraging note in the same tone tier —
  // a struggling result should not be cheered with «Так держать!».
  const hero =
    accuracy >= 80
      ? { headline: 'Отличная точность!', note: 'Так держать!' }
      : accuracy >= 60
        ? { headline: 'Хороший прогресс', note: 'Ещё немного — и будет отлично.' }
        : accuracy >= 40
          ? { headline: 'Уверенный старт', note: 'Регулярная практика быстро поднимет точность.' }
          : { headline: 'Продолжайте практиковаться', note: 'Разбирайте ошибки — и результат вырастет.' }

  const ringTone = accuracy >= 80 ? 'text-success' : accuracy >= 50 ? 'text-primary' : 'text-destructive'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Статистика</h1>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ваша статистика
            </p>
            <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">{hero.headline}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {stats.totalCorrect} верных ответов из {totalAnswered}. {hero.note}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Тестов: {stats.completedTests}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Ответов: {totalAnswered}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Время: {formatDuration(stats.totalTimeSeconds)}
              </span>
            </div>
          </div>

          <CircularProgress
            value={accuracy}
            size={132}
            strokeWidth={11}
            className="mx-auto shrink-0 md:mx-0"
            indicatorClassName={ringTone}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{accuracy}%</p>
              <p className="text-[11px] text-muted-foreground">точность</p>
            </div>
          </CircularProgress>
        </div>
      </motion.section>

      {/* Stat cards */}
      <StatsCards stats={stats} />

      {/* Practice & learning progress */}
      {practiceSection}

      {/* Accuracy trend + donut */}
      <div className="grid gap-4 lg:grid-cols-2">
        {showTrend && (
          <SectionCard
            icon={<TrendingUp size={18} />}
            title="Динамика точности"
            subtitle="По последним тестам"
            delay={0.1}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, 'Точность']} />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#accGradient)"
                  dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        )}

        <SectionCard
          icon={<PieIcon size={18} />}
          title="Соотношение ответов"
          subtitle="Верные и неверные за всё время"
          delay={0.15}
          className={cn(!showTrend && 'lg:col-span-2')}
        >
          <div className="flex items-center gap-4">
            <div className="relative h-[200px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-foreground">{totalAnswered}</p>
                <p className="text-[11px] text-muted-foreground">ответов</p>
              </div>
            </div>
            <div className="space-y-3 pr-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Верные</span>
                </div>
                <p className="mt-0.5 pl-[18px] text-lg font-bold text-foreground">{stats.totalCorrect}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                  <span className="text-xs text-muted-foreground">Неверные</span>
                </div>
                <p className="mt-0.5 pl-[18px] text-lg font-bold text-foreground">{stats.totalIncorrect}</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Time per test */}
      <SectionCard
        icon={<Clock size={18} />}
        title="Время прохождения"
        subtitle="По последним тестам"
        delay={0.2}
        action={
          <div className="flex shrink-0 gap-2">
            <div className="rounded-lg bg-secondary px-3 py-1.5 text-right">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Среднее</p>
              <p className="text-sm font-semibold text-foreground">{formatDuration(recentAvg)}</p>
            </div>
            <div className="rounded-lg bg-success/10 px-3 py-1.5 text-right">
              <p className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wide text-success/80">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Самый быстрый
              </p>
              <p className="text-sm font-semibold text-success">{formatDuration(recentBest)}</p>
            </div>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 4, left: -20, bottom: 0 }}
            barCategoryGap="28%"
          >
            <defs>
              <linearGradient id="durationFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="durationFillBest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.95} />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                Number(value) < 60 ? `${Math.round(Number(value))}с` : `${Math.round(Number(value) / 60)}м`
              }
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4, radius: 6 }}
              contentStyle={tooltipStyle}
              formatter={(value: number) => [formatDuration(value), 'Время']}
            />
            <Bar dataKey="durationSeconds" radius={[8, 8, 0, 0]} maxBarSize={52}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    showDurationCompare && entry.durationSeconds === recentBest
                      ? 'url(#durationFillBest)'
                      : 'url(#durationFill)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Recent sessions */}
      <SectionCard
        icon={<History size={18} />}
        title="Последние тесты"
        subtitle="Нажмите, чтобы открыть результат"
        delay={0.25}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/profile/history">
              Вся история
              <ChevronRight size={15} />
            </Link>
          </Button>
        }
      >
        <div className="space-y-2">
          {recentRows.map((row) => {
            const Icon = row.icon
            return (
              <Link
                key={row.sessionId}
                to={`/app/tests/results/${row.sessionId}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-3 transition-all hover:border-primary/30 hover:bg-accent/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{row.title}</p>
                    {row.badge && (
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {row.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle size={11} className="text-success" />
                      {row.correctAnswers}/{row.totalQuestions}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} />
                      {row.duration}
                    </span>
                    <span>{row.date}</span>
                  </p>
                </div>
                <span
                  className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', row.accTone)}
                >
                  {row.acc}%
                </span>
                <ChevronRight size={15} className="shrink-0 text-muted-foreground" />
              </Link>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
