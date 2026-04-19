import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers3,
} from 'lucide-react'
import {
  getThemeBySlug,
  getThemeQuestionCount,
  getThemeSubtopics,
  type CatalogDifficulty,
  type TestSection,
  type TestSubtopic,
} from '@/entities/testCatalog'
import { useTestCatalogProgress } from '@/features/tests/useTestCatalogProgress'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { cn } from '@/shared/lib/cn'

const difficultyLabel: Record<CatalogDifficulty, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

function statusLabel(status: string) {
  if (status === 'completed') return 'Пройдено'
  if (status === 'in-progress') return 'В процессе'
  return 'Не начато'
}

function difficultyTone(difficulty: CatalogDifficulty) {
  if (difficulty === 'easy') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (difficulty === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
}

function SubtopicRow({
  themeSlug,
  subtopic,
}: {
  themeSlug: string
  subtopic: TestSubtopic
}) {
  const { getSubtopicStats } = useTestCatalogProgress()
  const stats = getSubtopicStats(subtopic)

  return (
    <Link
      to={`/app/tests/theme/${themeSlug}/${subtopic.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm sm:flex-row sm:items-center"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <BookOpen size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
            {subtopic.title}
          </h3>
          <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-semibold', difficultyTone(subtopic.difficulty))}>
            {difficultyLabel[subtopic.difficulty]}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {subtopic.description}
        </p>
      </div>
      <div className="flex items-center gap-3 sm:w-40">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{statusLabel(stats.status)}</span>
            <span>{stats.progressPercent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${stats.progressPercent}%` }} />
          </div>
        </div>
        <ArrowRight size={15} className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  )
}

function SectionBlock({
  section,
  themeSlug,
  expanded,
  onToggle,
}: {
  section: TestSection
  themeSlug: string
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <section className="rounded-lg border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div>
          <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
        </div>
        <div className="mt-1 text-muted-foreground">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-border p-3">
          {section.subtopics.map((subtopic) => (
            <SubtopicRow key={subtopic.id} themeSlug={themeSlug} subtopic={subtopic} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function TestThemePage() {
  const { themeSlug } = useParams<{ themeSlug: string }>()
  const navigate = useNavigate()
  const theme = getThemeBySlug(themeSlug)
  const { getThemeStats, getSubtopicStats } = useTestCatalogProgress()

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(theme?.sections.map((section) => section.id) ?? [])
  )

  const allExpanded = theme ? expandedSections.size === theme.sections.length : false
  const firstAvailableSubtopic = theme ? getThemeSubtopics(theme)[0] : undefined
  const stats = theme ? getThemeStats(theme) : undefined
  const questionsCount = theme ? getThemeQuestionCount(theme) : 0

  const navItems = useMemo(() => {
    if (!theme) return []

    return theme.sections.map((section) => ({
      ...section,
      subtopics: section.subtopics.map((subtopic) => ({
        ...subtopic,
        stats: getSubtopicStats(subtopic),
      })),
    }))
  }, [getSubtopicStats, theme])

  if (!theme || !stats) {
    return (
      <EmptyState
        title="Тема не найдена"
        description="Проверьте ссылку или вернитесь к списку тем."
        action={
          <Button asChild>
            <Link to="/app/tests">К списку тем</Link>
          </Button>
        }
      />
    )
  }

  const toggleAll = () => {
    setExpandedSections((current) => {
      if (current.size === theme.sections.length) return new Set()
      return new Set(theme.sections.map((section) => section.id))
    })
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) => {
      const next = new Set(current)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/app/tests')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">Раздел тестов</p>
          <h1 className="text-xl font-bold text-foreground">{theme.title}</h1>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <Layers3 size={14} />
              {theme.sections.length} раздела, {stats.subtopicsTotal} подтем
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {theme.description}
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Общий прогресс</span>
              <span className="text-sm font-semibold text-primary">{stats.progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full rounded-full bg-primary" style={{ width: `${stats.progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.completedSubtopics} из {stats.subtopicsTotal} подтем пройдено, {questionsCount} вопросов
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Навигация</h2>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-medium text-primary hover:underline"
              >
                {allExpanded ? 'Свернуть всё' : 'Развернуть всё'}
              </button>
            </div>
            <div className="space-y-3">
              {navItems.map((section) => (
                <div key={section.id}>
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.subtopics.map((subtopic) => (
                      <Link
                        key={subtopic.id}
                        to={`/app/tests/theme/${theme.slug}/${subtopic.slug}`}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
                      >
                        <span className="line-clamp-1">{subtopic.title}</span>
                        {subtopic.stats.status === 'completed' && (
                          <CheckCircle2 size={13} className="shrink-0 text-green-500" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {firstAvailableSubtopic && (
            <Button className="w-full" asChild>
              <Link to={`/app/tests/theme/${theme.slug}/${firstAvailableSubtopic.slug}`}>
                Начать первый тест
              </Link>
            </Button>
          )}
        </aside>

        <div className="space-y-3">
          {theme.sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <SectionBlock
                section={section}
                themeSlug={theme.slug}
                expanded={expandedSections.has(section.id)}
                onToggle={() => toggleSection(section.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
