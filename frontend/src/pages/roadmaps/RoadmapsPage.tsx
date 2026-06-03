import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Code2,
  Database,
  Layers,
  Layout,
  Map,
  Server,
  Smartphone,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Roadmap } from '@/entities/roadmap'
import { getRoadmapNodeCount, getRoadmapRequiredCount } from '@/entities/roadmap'
import { useRoadmapProgress } from '@/features/roadmap/useRoadmapProgress'
import { useRoadmaps } from '@/features/roadmap/useRoadmaps'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'

interface RoadmapTheme {
  gradient: string
  Icon: LucideIcon
}

// Curated, vibrant banners per roadmap. Drives the look instead of the (very faint)
// `accent` stored in content, so a card can never render as a blank white banner.
const roadmapThemes: Record<string, RoadmapTheme> = {
  frontend: { gradient: 'from-sky-500 via-blue-500 to-indigo-600', Icon: Layout },
  backend: { gradient: 'from-emerald-500 via-green-500 to-teal-600', Icon: Server },
  fullstack: { gradient: 'from-violet-500 via-purple-500 to-fuchsia-600', Icon: Code2 },
  mobile: { gradient: 'from-rose-500 via-pink-500 to-fuchsia-600', Icon: Smartphone },
  devops: { gradient: 'from-amber-500 via-orange-500 to-red-500', Icon: Server },
  database: { gradient: 'from-cyan-500 via-teal-500 to-emerald-600', Icon: Database },
}

// Stable fallback palette so unknown slugs still get a distinct, non-white banner.
const fallbackGradients = [
  'from-blue-500 via-indigo-500 to-violet-600',
  'from-emerald-500 via-teal-500 to-cyan-600',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-fuchsia-500 via-purple-500 to-indigo-600',
]

function getRoadmapTheme(slug: string): RoadmapTheme {
  if (roadmapThemes[slug]) return roadmapThemes[slug]
  let hash = 0
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i)) % fallbackGradients.length
  }
  return { gradient: fallbackGradients[hash], Icon: Map }
}

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const { completed } = useRoadmapProgress(roadmap.slug)
  const total = getRoadmapNodeCount(roadmap)
  const required = getRoadmapRequiredCount(roadmap)
  const done = completed.length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  const { gradient, Icon } = getRoadmapTheme(roadmap.slug)

  return (
    <Link
      to={`/app/roadmaps/${roadmap.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Banner */}
      <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${gradient}`}>
        {/* Oversized decorative icon */}
        <Icon
          aria-hidden
          strokeWidth={1.25}
          className="pointer-events-none absolute -bottom-6 -right-4 h-44 w-44 text-white/15 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
        />
        {/* Soft glow + bottom legibility overlay */}
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur-sm">
            <Icon size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
            {roadmap.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
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
