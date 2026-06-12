import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, Library } from 'lucide-react'
import { getThemeQuestionCount, type TestTheme } from '@/entities/testCatalog'
import {
  groupThemesByCategory,
  type CategoryGroup,
} from '@/entities/testCategories'
import { useTestCatalogThemes } from '@/features/tests/useTestCatalog'
import { useTestCatalogProgress } from '@/features/tests/useTestCatalogProgress'
import { renderThemeIcon } from '@/features/tests/themeIcon'
import { CircularProgress } from '@/shared/ui/CircularProgress'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { cn } from '@/shared/lib/cn'

/** How many cards a category shows before "Показать все". */
const PREVIEW_COUNT = 3

interface ThemeStats {
  progressPercent: number
  status: string
}

/**
 * A single test theme rendered as a horizontal card (icon · text · progress).
 * Stats come in as props — a per-card progress hook would re-fetch the synced
 * progress from the server once per theme.
 */
function TestThemeCard({
  theme,
  accentClass,
  index,
  stats,
}: {
  theme: TestTheme
  accentClass: string
  index: number
  stats: ThemeStats
}) {
  const questionsCount = getThemeQuestionCount(theme)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={`/app/tests/theme/${theme.slug}`}
        className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      >
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            accentClass
          )}
        >
          {renderThemeIcon(theme)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {theme.shortTitle}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {theme.description}
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground/80">
            Вопросов: {questionsCount}
          </p>
        </div>

        <CircularProgress
          value={stats.progressPercent}
          size={52}
          indicatorClassName={stats.status === 'completed' ? 'text-success' : 'text-primary'}
        />
      </Link>
    </motion.div>
  )
}

/** A category header followed by its theme cards, collapsed to a preview. */
function CategorySection({
  group,
  index,
  getThemeStats,
}: {
  group: CategoryGroup
  index: number
  getThemeStats: (theme: TestTheme) => ThemeStats
}) {
  const [expanded, setExpanded] = useState(false)
  const { category, themes } = group
  const CategoryIcon = category.icon
  const visibleThemes = expanded ? themes : themes.slice(0, PREVIEW_COUNT)
  const hasMore = themes.length > PREVIEW_COUNT

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="space-y-4"
    >
      <header className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            category.accentClass
          )}
        >
          <CategoryIcon size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">{category.title}</h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
              {themes.length}
            </span>
          </div>
          <p className="truncate text-sm text-muted-foreground">{category.description}</p>
        </div>
      </header>

      <div className="space-y-3">
        {visibleThemes.map((theme, themeIndex) => (
          <TestThemeCard
            key={theme.id}
            theme={theme}
            accentClass={category.accentClass}
            index={themeIndex}
            stats={getThemeStats(theme)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          {expanded ? 'Свернуть' : `Показать все (${themes.length})`}
          <ChevronDown
            size={16}
            className={cn('transition-transform', expanded && 'rotate-180')}
          />
        </button>
      )}
    </motion.section>
  )
}

function CategorySectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-[88px] rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function ThemesCatalogPage() {
  const { data: themes = [], isLoading } = useTestCatalogThemes()
  // One progress hook for the whole page — cards receive their stats as props.
  const { getThemeStats } = useTestCatalogProgress()
  const groups = groupThemesByCategory(themes)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          to="/app/tests"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
          aria-label="Назад к тестам"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Library size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground md:text-2xl">Тесты по темам</h1>
            <p className="text-sm text-muted-foreground">
              Выберите категорию и проверьте свои знания
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <CategorySectionSkeleton key={index} />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          title="Каталог тестов пока недоступен"
          description="Мы не нашли опубликованные темы. Попробуйте обновить страницу чуть позже."
        />
      ) : (
        <div className="space-y-8">
          {groups.map((group, index) => (
            <CategorySection
              key={group.category.id}
              group={group}
              index={index}
              getThemeStats={getThemeStats}
            />
          ))}
        </div>
      )}
    </div>
  )
}
