import { useState, useCallback, useDeferredValue } from 'react'
import { Link } from 'react-router-dom'
import { Search, Heart, X, BookOpen, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMaterials, useToggleFavorite } from '@/features/materials/useMaterials'
import { MaterialCard } from '@/widgets/MaterialCard'
import { MaterialDetailModal } from '@/widgets/MaterialDetailModal'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { cn } from '@/shared/lib/cn'
import type { KnowledgeLevel, Material } from '@/entities/types'

const LEVELS: { value: KnowledgeLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'junior', label: 'Junior' },
  { value: 'middle', label: 'Middle' },
  { value: 'senior', label: 'Senior' },
]

function MaterialSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export default function MaterialsPage() {
  const user = useAuthStore((s) => s.user)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<KnowledgeLevel | 'all'>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const deferredSearch = useDeferredValue(search)

  const params = {
    search: deferredSearch || undefined,
    level: levelFilter !== 'all' ? levelFilter : undefined,
    limit: 50,
  }
  const { data, isLoading } = useMaterials(params)
  const toggleFavorite = useToggleFavorite()

  // Recommendations: same level as user, filtered from results
  const userLevel = user?.knowledgeLevel ?? 'junior'
  const { data: recData } = useMaterials({ level: userLevel, limit: 4 })
  const recommendations = recData?.items?.filter((m) => !m.isFavorite).slice(0, 3) ?? []

  const handleToggleFavorite = useCallback(
    (id: string, isFavorite: boolean) => {
      toggleFavorite.mutate({ id, isFavorite })
      // Optimistically update selected material
      if (selectedMaterial?.id === id) {
        setSelectedMaterial((m) => m ? { ...m, isFavorite: !isFavorite } : m)
      }
    },
    [toggleFavorite, selectedMaterial]
  )

  const materials = data?.items ?? []
  const visibleLevelLabel = LEVELS.find((level) => level.value === levelFilter)?.label ?? 'Все'

  return (
    <div className="space-y-6">
      {/* Page title + favorites link */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Материалы</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Подборка тем, конспектов и практических заметок для подготовки к интервью.
              </p>
            </div>
          </div>
          <Link
            to="/app/materials/favorites"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Heart size={15} />
            Избранное
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-secondary px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">В каталоге</p>
            <p className="text-lg font-semibold text-foreground">{data?.pagination.total ?? 0}</p>
          </div>
          <div className="rounded-lg bg-secondary px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Фильтр</p>
            <p className="text-lg font-semibold text-foreground">{visibleLevelLabel}</p>
          </div>
          <div className="rounded-lg bg-secondary px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Ваш уровень</p>
            <p className="text-lg font-semibold text-foreground capitalize">{userLevel}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Поиск по названию или теме..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch('')}
              >
                <X size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Level filter */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevelFilter(l.value)}
              className={cn(
                'shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-colors',
                levelFilter === l.value
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations (show only when no active search/filter) */}
      <AnimatePresence>
        {!search && levelFilter === 'all' && recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Рекомендации для вас
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
                {userLevel}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((m) => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={setSelectedMaterial}
                  isFavoriteLoading={toggleFavorite.isPending}
                />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* All materials */}
      <section className="space-y-3">
        {!search && levelFilter === 'all' && (
          <h2 className="text-sm font-semibold text-foreground">Все материалы</h2>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <MaterialSkeleton key={i} />
            ))}
          </div>
        ) : materials.length === 0 ? (
          <EmptyState
            title="Ничего не найдено"
            description={search ? `По запросу "${search}" ничего не найдено` : 'Материалы появятся позже'}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m) => (
              <MaterialCard
                key={m.id}
                material={m}
                onToggleFavorite={handleToggleFavorite}
                onClick={setSelectedMaterial}
                isFavoriteLoading={toggleFavorite.isPending}
              />
            ))}
          </div>
        )}
      </section>

      {/* Detail modal */}
      <MaterialDetailModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavoriteLoading={toggleFavorite.isPending}
      />
    </div>
  )
}
