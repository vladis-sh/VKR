import { useEffect } from 'react'
import { X, Heart, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useMaterialDetail } from '@/features/materials/useMaterials'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { Material } from '@/entities/types'

interface MaterialDetailModalProps {
  material: Material | null
  onClose: () => void
  onToggleFavorite: (id: string, current: boolean) => void
  isFavoriteLoading?: boolean
}

export function MaterialDetailModal({
  material,
  onClose,
  onToggleFavorite,
  isFavoriteLoading,
}: MaterialDetailModalProps) {
  const { data: detail, isLoading } = useMaterialDetail(material?.id ?? '')
  const resolvedMaterial = detail ?? material

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (material) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [material])

  return (
    <AnimatePresence>
      {resolvedMaterial && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={resolvedMaterial.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-lg border border-border bg-card shadow-xl md:inset-0 md:m-auto md:max-h-[85vh] md:max-w-2xl md:rounded-lg"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-card px-5 py-4">
              <div className="flex-1">
                <Badge variant="level" level={resolvedMaterial.level} className="mb-2">
                  {resolvedMaterial.level === 'junior'
                    ? 'Junior'
                    : resolvedMaterial.level === 'middle'
                      ? 'Middle'
                      : 'Senior'}
                </Badge>
                <h2 className="text-lg font-semibold text-foreground leading-snug">
                  {resolvedMaterial.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  aria-label={resolvedMaterial.isFavorite ? 'Убрать из избранного' : 'В избранное'}
                  className={cn(
                    'rounded-full p-2 transition-colors',
                    resolvedMaterial.isFavorite
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-muted-foreground hover:text-red-400'
                  )}
                  disabled={isFavoriteLoading}
                  onClick={() =>
                    onToggleFavorite(resolvedMaterial.id, resolvedMaterial.isFavorite ?? false)
                  }
                >
                  <Heart size={18} className={cn(resolvedMaterial.isFavorite && 'fill-current')} />
                </button>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Закрыть">
                  <X size={18} />
                </Button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {resolvedMaterial.shortDescription}
              </p>

              {resolvedMaterial.tags && resolvedMaterial.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <Tag size={13} className="text-muted-foreground" />
                  {resolvedMaterial.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-sm max-w-none dark:prose-invert">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : resolvedMaterial.content ? (
                  <ReactMarkdown>{resolvedMaterial.content}</ReactMarkdown>
                ) : (
                  <p className="text-sm text-muted-foreground">Полный текст материала недоступен.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
