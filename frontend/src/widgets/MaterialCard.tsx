import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/Badge'
import type { Material } from '@/entities/types'

interface MaterialCardProps {
  material: Material
  onToggleFavorite: (id: string, current: boolean) => void
  onClick: (material: Material) => void
  isFavoriteLoading?: boolean
}

export function MaterialCard({ material, onToggleFavorite, onClick, isFavoriteLoading }: MaterialCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex min-h-[190px] cursor-pointer flex-col gap-3 overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
      onClick={() => onClick(material)}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <Badge variant="level" level={material.level}>
          {material.level === 'junior' ? 'Junior' : material.level === 'middle' ? 'Middle' : 'Senior'}
        </Badge>
        <button
          aria-label={material.isFavorite ? 'Убрать из избранного' : 'В избранное'}
          className={cn(
            'shrink-0 rounded-full p-1.5 transition-colors',
            material.isFavorite
              ? 'text-red-500 hover:text-red-600'
              : 'text-muted-foreground hover:text-red-400'
          )}
          disabled={isFavoriteLoading}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(material.id, material.isFavorite ?? false)
          }}
        >
          <Heart
            size={16}
            className={cn('transition-all', material.isFavorite && 'fill-current')}
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {material.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
        {material.shortDescription}
      </p>

      {/* Tags */}
      {material.tags && material.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {material.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
          {material.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{material.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
