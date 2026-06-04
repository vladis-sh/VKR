import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  GraduationCap,
  Map as MapIcon,
  Sparkles,
  Star,
} from 'lucide-react'
import type { LiveCodingDifficulty } from '@/entities/liveCoding'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

export interface FavoriteTaskItem {
  slug: string
  title: string
  category: string
  difficulty: LiveCodingDifficulty
  estimatedMinutes: number
  solved: boolean
}

export interface PracticeStatsData {
  tasksSolved: number
  tasksTotal: number
  nodesDone: number
  nodesTotal: number
  favoriteTasks: FavoriteTaskItem[]
}

function toPercent(done: number, total: number) {
  return total > 0 ? Math.round((done / total) * 100) : 0
}

const DIFFICULTY_DOT: Record<LiveCodingDifficulty, string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-red-500',
}

const DIFFICULTY_TEXT: Record<LiveCodingDifficulty, string> = {
  easy: 'text-emerald-600 dark:text-emerald-400',
  medium: 'text-amber-600 dark:text-amber-400',
  hard: 'text-red-600 dark:text-red-400',
}

const DIFFICULTY_LABEL: Record<LiveCodingDifficulty, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
}

function MetricCard({
  to,
  onClick,
  icon,
  iconClass,
  label,
  value,
  percent,
  barClass,
  caption,
  delay,
}: {
  to?: string
  onClick?: () => void
  icon: React.ReactNode
  iconClass: string
  label: string
  value: string
  percent?: number
  barClass?: string
  caption?: string
  delay: number
}) {
  const body = (
    <>
      <div className="flex items-center gap-2.5">
        <div
          className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', iconClass)}
        >
          {icon}
        </div>
        <p className="min-w-0 break-words text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-lg font-bold text-foreground sm:text-xl">{value}</p>
      {percent !== undefined ? (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn('h-full rounded-full transition-all duration-700', barClass)}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
            {percent}%
          </span>
        </div>
      ) : caption ? (
        <p className="mt-2 text-[11px] text-muted-foreground">{caption}</p>
      ) : null}
    </>
  )

  const interactive = Boolean(to || onClick)
  const cardClass = cn(
    'block h-full w-full rounded-2xl border border-border bg-card p-3 text-left shadow-sm sm:p-4',
    interactive && 'transition-all hover:border-primary/30 hover:bg-accent/40'
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {to ? (
        <Link to={to} className={cardClass}>
          {body}
        </Link>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={cardClass}>
          {body}
        </button>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </motion.div>
  )
}

/**
 * Practice & learning progress — coding tasks solved and roadmap nodes completed,
 * plus saved tasks and a combined overall-completion figure. The "favourites" card
 * opens a picker so the user can jump straight back into a saved task.
 */
export function PracticeStats({
  tasksSolved,
  tasksTotal,
  nodesDone,
  nodesTotal,
  favoriteTasks,
}: PracticeStatsData) {
  const [favoritesOpen, setFavoritesOpen] = useState(false)

  const tasksPercent = toPercent(tasksSolved, tasksTotal)
  const roadmapPercent = toPercent(nodesDone, nodesTotal)
  const overallPercent = toPercent(tasksSolved + nodesDone, tasksTotal + nodesTotal)
  const favoritesCount = favoriteTasks.length

  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <GraduationCap size={17} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Практика и обучение</h2>
          <p className="text-xs text-muted-foreground">Задачи и планы подготовки</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          to="/app/live-coding"
          icon={<Code2 size={18} />}
          iconClass="bg-primary/10 text-primary"
          label="Задачи решено"
          value={`${tasksSolved} / ${tasksTotal}`}
          percent={tasksPercent}
          barClass="bg-primary"
          delay={0}
        />
        <MetricCard
          to="/app/roadmaps"
          icon={<MapIcon size={18} />}
          iconClass="bg-violet-500/10 text-violet-500"
          label="Пройдены этапы"
          value={`${nodesDone} / ${nodesTotal}`}
          percent={roadmapPercent}
          barClass="bg-violet-500"
          delay={0.05}
        />
        <MetricCard
          onClick={() => setFavoritesOpen(true)}
          icon={<Star size={18} />}
          iconClass="bg-amber-500/10 text-amber-500"
          label="Избранные задачи"
          value={String(favoritesCount)}
          caption={favoritesCount > 0 ? 'Нажмите, чтобы открыть' : 'Нет избранных задач'}
          delay={0.1}
        />
        <MetricCard
          icon={<Sparkles size={18} />}
          iconClass="bg-success/10 text-success"
          label="Общий прогресс"
          value={`${overallPercent}%`}
          percent={overallPercent}
          barClass="bg-success"
          delay={0.15}
        />
      </div>

      <Modal
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        title="Избранные задачи"
        description={favoritesCount > 0 ? 'Выберите задачу, чтобы продолжить решать' : undefined}
      >
        {favoritesCount === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Star size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Пока пусто</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Отмечайте задачи звёздочкой в Live Coding, чтобы быстро возвращаться к ним.
              </p>
            </div>
            <Button asChild size="sm">
              <Link to="/app/live-coding" onClick={() => setFavoritesOpen(false)}>
                Перейти к задачам
              </Link>
            </Button>
          </div>
        ) : (
          <div className="-mr-1 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {favoriteTasks.map((task) => (
              <Link
                key={task.slug}
                to={`/app/live-coding/${task.slug}`}
                onClick={() => setFavoritesOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-accent/50"
              >
                <span
                  className={cn('h-2 w-2 shrink-0 rounded-full', DIFFICULTY_DOT[task.difficulty])}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                    <span>{task.category}</span>
                    <span aria-hidden>·</span>
                    <span className={DIFFICULTY_TEXT[task.difficulty]}>
                      {DIFFICULTY_LABEL[task.difficulty]}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={10} />
                      {task.estimatedMinutes} мин
                    </span>
                  </p>
                </div>
                {task.solved && <CheckCircle2 size={15} className="shrink-0 text-success" />}
                <ChevronRight size={15} className="shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </Modal>
    </section>
  )
}
