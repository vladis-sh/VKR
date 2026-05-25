import { Link } from 'react-router-dom'
import { Map, ArrowRight, Target, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Roadmap } from '@/entities/roadmap'
import { getRoadmapNodeCount, getRoadmapRequiredCount } from '@/entities/roadmap'
import { useRoadmapProgress } from '@/features/roadmap/useRoadmapProgress'
import { useRoadmaps } from '@/features/roadmap/useRoadmaps'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const { completed } = useRoadmapProgress(roadmap.slug)
  const total = getRoadmapNodeCount(roadmap)
  const required = getRoadmapRequiredCount(roadmap)
  const done = completed.length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <Link
      to={`/app/roadmaps/${roadmap.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={`relative h-32 bg-gradient-to-br ${roadmap.accent} p-5`}>
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 backdrop-blur">
          <Map size={20} className="text-primary" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-lg font-semibold text-foreground">{roadmap.title}</h3>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers size={13} />
            {roadmap.stages.length} стадий
          </span>
          <span className="inline-flex items-center gap-1">
            <Target size={13} />
            {required} обязательных тем
          </span>
        </div>

        <div className="mt-auto">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span>Прогресс</span>
            <span>
              {done} / {total}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-sm font-medium text-primary">
          <span>Открыть план подготовки</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

export default function RoadmapsPage() {
  const { data: roadmaps = [], isLoading } = useRoadmaps()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Map size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Планы подготовки</h1>
            <p className="text-sm text-muted-foreground">
              Структурированные пути обучения. Отмечайте темы, которые уже разобрали.
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <EmptyState
          title="Планы подготовки пока недоступны"
          description="Мы не нашли опубликованные маршруты. Попробуйте обновить страницу чуть позже."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
          ))}
        </div>
      )}
    </div>
  )
}
