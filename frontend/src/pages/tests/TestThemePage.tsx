import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Play, Sparkles } from 'lucide-react'
import {
  getThemeQuestionCount,
  getThemeSubtopics,
  type TestSubtopic,
} from '@/entities/testCatalog'
import { resolveCategory } from '@/entities/testCategories'
import { useTestCatalogTheme } from '@/features/tests/useTestCatalog'
import {
  useTestCatalogProgress,
  type TestProgressStatus,
} from '@/features/tests/useTestCatalogProgress'
import { renderThemeIcon } from '@/features/tests/themeIcon'
import { difficultyLabel, difficultyTone } from '@/features/tests/difficulty'
import { Button } from '@/shared/ui/Button'
import { CircularProgress } from '@/shared/ui/CircularProgress'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { cn } from '@/shared/lib/cn'

interface SubtopicStats {
  total: number
  checked: number
  status: TestProgressStatus
  progressPercent: number
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
      {children}
    </span>
  )
}

/** Presentational subtopic card — receives stats as props (no per-card hooks). */
function SubtopicCard({
  to,
  subtopic,
  stats,
  index,
}: {
  to: string
  subtopic: TestSubtopic
  stats: SubtopicStats
  index: number
}) {
  const isCompleted = stats.status === 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.03 }}
    >
      <Link
        to={to}
        className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold',
              difficultyTone[subtopic.difficulty]
            )}
          >
            {difficultyLabel[subtopic.difficulty]}
          </span>
          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <CheckCircle2 size={14} />
              Пройдено
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {subtopic.questions.length} вопр.
            </span>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {subtopic.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {subtopic.description}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {stats.checked} / {stats.total}
            </span>
            <span className="font-semibold text-foreground">{stats.progressPercent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isCompleted ? 'bg-success' : 'bg-primary'
              )}
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function ThemePageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-44 rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-52" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TestThemePage() {
  const { themeSlug } = useParams<{ themeSlug: string }>()
  const { data: theme, isLoading } = useTestCatalogTheme(themeSlug)
  const { getThemeStats, getSubtopicStats } = useTestCatalogProgress()

  if (isLoading) return <ThemePageSkeleton />

  if (!theme) {
    return (
      <EmptyState
        title="Тема не найдена"
        description="Проверьте ссылку или вернитесь к списку тем."
        action={
          <Button asChild>
            <Link to="/app/tests/themes">К списку тем</Link>
          </Button>
        }
      />
    )
  }

  const category = resolveCategory(theme)
  const stats = getThemeStats(theme)
  const questionsCount = getThemeQuestionCount(theme)
  const subtopics = getThemeSubtopics(theme)

  // CTA jumps to the first unfinished subtopic, or the first one for a re-run.
  const resumeSubtopic =
    subtopics.find((subtopic) => getSubtopicStats(subtopic).status !== 'completed') ??
    subtopics[0]
  const isStarted = stats.checked > 0
  const isCompleted = stats.status === 'completed'
  const ctaLabel = isCompleted ? 'Пройти заново' : isStarted ? 'Продолжить' : 'Начать тест'

  return (
    <div className="space-y-6">
      <Link
        to="/app/tests/themes"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Тесты по темам
      </Link>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl',
                category.accentClass
              )}
            >
              {renderThemeIcon(theme, 30)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {category.title}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
                {theme.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {theme.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <MetaChip>Разделов: {theme.sections.length}</MetaChip>
                <MetaChip>Подтем: {stats.subtopicsTotal}</MetaChip>
                <MetaChip>Вопросов: {questionsCount}</MetaChip>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6 md:flex-col md:items-stretch md:gap-4">
            <CircularProgress
              value={stats.progressPercent}
              size={108}
              strokeWidth={9}
              className="mx-auto"
              indicatorClassName={isCompleted ? 'text-success' : 'text-primary'}
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.progressPercent}%</p>
                <p className="text-[10px] text-muted-foreground">
                  {stats.completedSubtopics}/{stats.subtopicsTotal} подтем
                </p>
              </div>
            </CircularProgress>

            {resumeSubtopic && (
              <Button asChild size="lg" className="md:w-48">
                <Link to={`/app/tests/theme/${theme.slug}/${resumeSubtopic.slug}`}>
                  {isCompleted ? <Sparkles size={16} /> : <Play size={16} />}
                  {ctaLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Sections */}
      {theme.sections.map((section, sectionIndex) => (
        <motion.section
          key={section.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + sectionIndex * 0.04 }}
          className="space-y-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                {section.subtopics.length}
              </span>
            </div>
            {section.description && (
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {section.subtopics.map((subtopic, index) => (
              <SubtopicCard
                key={subtopic.id}
                to={`/app/tests/theme/${theme.slug}/${subtopic.slug}`}
                subtopic={subtopic}
                stats={getSubtopicStats(subtopic)}
                index={index}
              />
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  )
}
