import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { useFavorites, useToggleFavorite } from '@/features/materials/useMaterials'
import { MaterialCard } from '@/widgets/MaterialCard'
import { MaterialDetailModal } from '@/widgets/MaterialDetailModal'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'
import type { Material } from '@/entities/types'

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites()
  const toggleFavorite = useToggleFavorite()
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  const materials = data ?? []

  const handleToggleFavorite = useCallback(
    (id: string, isFavorite: boolean) => {
      toggleFavorite.mutate({ id, isFavorite })
      if (selectedMaterial?.id === id) {
        setSelectedMaterial((m) => (m ? { ...m, isFavorite: !isFavorite } : m))
      }
    },
    [toggleFavorite, selectedMaterial]
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/app/materials"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-foreground">Избранное</h1>
          {!isLoading && (
            <p className="text-xs text-muted-foreground">
              {materials.length} {materials.length === 1 ? 'материал' : 'материалов'}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : materials.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} className="text-muted-foreground/50" />}
          title="Нет избранных материалов"
          description="Добавляйте материалы в избранное, нажимая на сердечко"
          action={
            <Link
              to="/app/materials"
              className="text-sm text-primary hover:underline"
            >
              Перейти к материалам
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((m: Material) => (
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

      <MaterialDetailModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavoriteLoading={toggleFavorite.isPending}
      />
    </div>
  )
}
