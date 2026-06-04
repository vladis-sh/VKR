import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, GraduationCap, Map as MapIcon, Sparkles, Star } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface PracticeStatsData {
  tasksSolved: number
  tasksTotal: number
  nodesDone: number
  nodesTotal: number
  favorites: number
}

function toPercent(done: number, total: number) {
  return total > 0 ? Math.round((done / total) * 100) : 0
}

function MetricCard({
  to,
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
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', iconClass)}>
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
          <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{percent}%</span>
        </div>
      ) : caption ? (
        <p className="mt-2 text-[11px] text-muted-foreground">{caption}</p>
      ) : null}
    </>
  )

  const cardClass = cn(
    'block h-full rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4',
    to && 'transition-all hover:border-primary/30 hover:bg-accent/40'
  )

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      {to ? (
        <Link to={to} className={cardClass}>
          {body}
        </Link>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </motion.div>
  )
}

/**
 * Practice & learning progress — coding tasks solved and roadmap nodes completed,
 * plus saved tasks and a combined overall-completion figure. Pure presentational;
 * the stats page computes the numbers from the relevant progress sources.
 */
export function PracticeStats({ tasksSolved, tasksTotal, nodesDone, nodesTotal, favorites }: PracticeStatsData) {
  const tasksPercent = toPercent(tasksSolved, tasksTotal)
  const roadmapPercent = toPercent(nodesDone, nodesTotal)
  const overallPercent = toPercent(tasksSolved + nodesDone, tasksTotal + nodesTotal)

  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <GraduationCap size={17} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Практика и обучение</h2>
          <p className="text-xs text-muted-foreground">Задачи и роадмапы</p>
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
          label="Роудмап пройден"
          value={`${nodesDone} / ${nodesTotal}`}
          percent={roadmapPercent}
          barClass="bg-violet-500"
          delay={0.05}
        />
        <MetricCard
          to="/app/live-coding"
          icon={<Star size={18} />}
          iconClass="bg-amber-500/10 text-amber-500"
          label="Избранные задачи"
          value={String(favorites)}
          caption="сохранено для повторения"
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
    </section>
  )
}
