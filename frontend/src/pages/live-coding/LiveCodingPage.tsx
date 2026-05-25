import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Code2,
  Lock,
  Search,
  Star,
  X,
} from 'lucide-react'
import {
  DIFFICULTY_LABELS,
  LANGUAGE_LABELS,
  type LiveCodingDifficulty,
  type LiveCodingLanguage,
  type LiveCodingTask,
} from '@/entities/liveCoding'
import { useLiveCodingProgress } from '@/features/live-coding/useLiveCodingProgress'
import { useLiveCodingTasks } from '@/features/live-coding/useLiveCodingTasks'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { cn } from '@/shared/lib/cn'

const difficulties: Array<LiveCodingDifficulty | 'all'> = ['all', 'easy', 'medium', 'hard']

function difficultyTone(difficulty: LiveCodingDifficulty) {
  if (difficulty === 'easy')
    return 'text-green-600 dark:text-green-400'
  if (difficulty === 'medium')
    return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function difficultyDot(difficulty: LiveCodingDifficulty) {
  if (difficulty === 'easy') return 'bg-green-500'
  if (difficulty === 'medium') return 'bg-amber-500'
  return 'bg-red-500'
}

interface CategoryStats {
  solved: number
  total: number
}

function TaskRow({
  task,
  solved,
  favorite,
  onToggleFavorite,
}: {
  task: LiveCodingTask
  solved: boolean
  favorite: boolean
  onToggleFavorite: () => void
}) {
  const rowContent = (
    <>
      <div className="flex w-6 shrink-0 justify-center">
        {solved ? (
          <CheckCircle2 size={18} className="text-green-500" />
        ) : (
          <Circle size={18} className="text-muted-foreground/40" />
        )}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onToggleFavorite()
        }}
        className={cn(
          'flex w-6 shrink-0 justify-center transition-colors',
          favorite ? 'text-amber-500' : 'text-muted-foreground/40 hover:text-amber-500'
        )}
        aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      >
        <Star size={16} className={cn(favorite && 'fill-current')} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'truncate text-sm font-medium',
              task.isPremium ? 'text-muted-foreground' : 'text-foreground'
            )}
          >
            {task.title}
          </span>
          {task.isNew && (
            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              Новая
            </span>
          )}
          {task.isPremium && (
            <Lock size={12} className="shrink-0 text-amber-500" aria-label="Premium" />
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">
            {task.companies.slice(0, 3).join(' · ')}
            {task.companies.length > 3 && ` +${task.companies.length - 3}`}
          </span>
        </div>
      </div>

      <div className="hidden w-20 shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
        <Clock size={12} />
        <span>{task.estimatedMinutes}м</span>
      </div>

      <div className={cn('w-20 shrink-0 text-right text-xs font-semibold', difficultyTone(task.difficulty))}>
        {DIFFICULTY_LABELS[task.difficulty]}
      </div>
    </>
  )

  const commonClasses =
    'group flex items-center gap-3 border-b border-border/60 px-4 py-2.5 last:border-b-0 transition-colors'

  if (task.isPremium) {
    return (
      <div className={cn(commonClasses, 'cursor-not-allowed opacity-70')}>
        {rowContent}
      </div>
    )
  }

  return (
    <Link
      to={`/app/live-coding/${task.slug}`}
      className={cn(commonClasses, 'hover:bg-accent/60')}
    >
      {rowContent}
    </Link>
  )
}

function CategorySection({
  category,
  tasks,
  stats,
  defaultOpen,
  isSolved,
  isFavorite,
  onToggleFavorite,
}: {
  category: string
  tasks: LiveCodingTask[]
  stats: CategoryStats
  defaultOpen: boolean
  isSolved: (id: string) => boolean
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  const percent = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40"
        aria-expanded={open}
      >
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 text-muted-foreground transition-transform',
            open ? 'rotate-0' : '-rotate-90'
          )}
        />
        <span className="text-sm font-semibold text-foreground">{category}</span>
        <span className="text-xs text-muted-foreground">
          {stats.solved} / {stats.total}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-secondary sm:block">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs font-medium text-muted-foreground">
            {percent}%
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              solved={isSolved(task.id)}
              favorite={isFavorite(task.id)}
              onToggleFavorite={() => onToggleFavorite(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LiveCodingPage() {
  const { data: tasks = [], isLoading } = useLiveCodingTasks()
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<LiveCodingDifficulty | 'all'>('all')
  const [company, setCompany] = useState('all')
  const [language, setLanguage] = useState<LiveCodingLanguage | 'all'>('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const { progress, isSolved, isFavorite, toggleFavorite } = useLiveCodingProgress()

  const companies = useMemo(
    () => Array.from(new Set(tasks.flatMap((task) => task.companies))).sort(),
    [tasks]
  )

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.category.toLowerCase().includes(normalizedSearch) ||
        task.companies.some((item) => item.toLowerCase().includes(normalizedSearch))
      const matchesDifficulty = difficulty === 'all' || task.difficulty === difficulty
      const matchesCompany = company === 'all' || task.companies.includes(company)
      const matchesLanguage = language === 'all' || task.languages.includes(language)
      const matchesFavorite = !onlyFavorites || isFavorite(task.id)

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesCompany &&
        matchesLanguage &&
        matchesFavorite
      )
    })
  }, [company, difficulty, language, onlyFavorites, search, isFavorite, tasks])

  const groupedTasks = useMemo(() => {
    const map = new Map<string, LiveCodingTask[]>()
    for (const task of filteredTasks) {
      if (!map.has(task.category)) map.set(task.category, [])
      map.get(task.category)!.push(task)
    }
    return Array.from(map.entries())
  }, [filteredTasks])

  const freeTasks = tasks.filter((task) => !task.isPremium)
  const solvedFree = freeTasks.filter((task) => progress.solved.includes(task.id))
  const progressPercent =
    freeTasks.length > 0 ? Math.round((solvedFree.length / freeTasks.length) * 100) : 0

  const difficultyCounts = (['easy', 'medium', 'hard'] as const).map((item) => {
    const tasksInDifficulty = tasks.filter(
      (task) => task.difficulty === item && !task.isPremium
    )
    return {
      difficulty: item,
      solved: tasksInDifficulty.filter((task) => progress.solved.includes(task.id)).length,
      total: tasksInDifficulty.length,
    }
  })

  const isFiltering =
    Boolean(search) ||
    difficulty !== 'all' ||
    company !== 'all' ||
    language !== 'all' ||
    onlyFavorites

  const resetFilters = () => {
    setSearch('')
    setDifficulty('all')
    setCompany('all')
    setLanguage('all')
    setOnlyFavorites(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Compact header: title + difficulty counters + overall progress */}
      <section className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Code2 size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-foreground">Live Coding</h1>
              <p className="text-xs text-muted-foreground">
                Задачи в формате технического интервью
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {difficultyCounts.map((item) => (
              <div
                key={item.difficulty}
                className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs"
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', difficultyDot(item.difficulty))} />
                <span className="font-medium text-foreground">
                  {DIFFICULTY_LABELS[item.difficulty]}
                </span>
                <span className="text-muted-foreground">
                  {item.solved}/{item.total}
                </span>
              </div>
            ))}
          </div>

          <div className="ml-auto flex min-w-[180px] items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-semibold text-foreground">
              {progressPercent}%
            </span>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section className="sticky top-0 z-10 rounded-lg border border-border bg-card/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск задачи, категории или компании"
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Очистить поиск"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-1 rounded-lg border border-border bg-background p-0.5">
            {difficulties.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDifficulty(item)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  difficulty === item
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item === 'all' ? 'Все' : DIFFICULTY_LABELS[item]}
              </button>
            ))}
          </div>

          <select
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            aria-label="Компания"
          >
            <option value="all">Все компании</option>
            {companies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as LiveCodingLanguage | 'all')
            }
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            aria-label="Язык"
          >
            <option value="all">Все языки</option>
            {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOnlyFavorites((current) => !current)}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors',
              onlyFavorites
                ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                : 'border-border bg-background text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={onlyFavorites}
          >
            <Star size={13} className={cn(onlyFavorites && 'fill-current')} />
            Избранное
          </button>

          {isFiltering && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
              Сбросить
            </button>
          )}
        </div>
      </section>

      {/* Grouped task list */}
      <section className="space-y-3">
        {tasks.length === 0 ? (
          <EmptyState
            title="Задачи пока недоступны"
            description="Мы не нашли опубликованные задания. Попробуйте обновить страницу чуть позже."
          />
        ) : groupedTasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm font-semibold text-foreground">Задачи не найдены</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Измените фильтры или очистите строку поиска.
            </p>
          </div>
        ) : (
          groupedTasks.map(([category, tasks]) => {
            const categoryFree = tasks.filter((task) => !task.isPremium)
            const stats: CategoryStats = {
              solved: categoryFree.filter((task) => progress.solved.includes(task.id)).length,
              total: categoryFree.length,
            }

            return (
              <CategorySection
                key={category}
                category={category}
                tasks={tasks}
                stats={stats}
                defaultOpen={false}
                isSolved={isSolved}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            )
          })
        )}
      </section>
    </div>
  )
}
