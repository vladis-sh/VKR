import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  Code2,
  Lock,
  Search,
  Star,
  TrendingUp,
  X,
} from 'lucide-react'
import {
  DIFFICULTY_LABELS,
  LANGUAGE_LABELS,
  LIVE_CODING_TASKS,
  type LiveCodingDifficulty,
  type LiveCodingLanguage,
  type LiveCodingTask,
} from '@/entities/liveCoding'
import { useLiveCodingProgress } from '@/features/live-coding/useLiveCodingProgress'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

const difficulties: Array<LiveCodingDifficulty | 'all'> = ['all', 'easy', 'medium', 'hard']

function difficultyTone(difficulty: LiveCodingDifficulty) {
  if (difficulty === 'easy') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (difficulty === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
}

function TaskCard({
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
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative flex min-h-[230px] flex-col gap-4 overflow-hidden rounded-lg border bg-card p-4 shadow-sm',
        task.isPremium ? 'border-amber-300/70' : 'border-border'
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={cn('rounded-md px-2 py-1 text-[10px] font-semibold', difficultyTone(task.difficulty))}>
              {DIFFICULTY_LABELS[task.difficulty]}
            </span>
            {task.isNew && (
              <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                Новая
              </span>
            )}
            {task.isPremium && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <Lock size={11} />
                Premium
              </span>
            )}
          </div>
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
            {task.title}
          </h2>
        </div>

        <button
          type="button"
          className={cn(
            'rounded-md p-2 transition-colors',
            favorite ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
          )}
          onClick={onToggleFavorite}
          aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Star size={17} className={cn(favorite && 'fill-current')} />
        </button>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {task.description}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {task.companies.slice(0, 3).map((company) => (
            <span key={company} className="rounded-md bg-secondary px-2 py-1 text-[10px] text-secondary-foreground">
              {company}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-md bg-secondary px-2 py-1.5">
            <p className="text-muted-foreground">Успех</p>
            <p className="font-semibold text-foreground">{task.successRate}%</p>
          </div>
          <div className="rounded-md bg-secondary px-2 py-1.5">
            <p className="text-muted-foreground">Время</p>
            <p className="font-semibold text-foreground">{task.estimatedMinutes}м</p>
          </div>
          <div className="rounded-md bg-secondary px-2 py-1.5">
            <p className="text-muted-foreground">Статус</p>
            <p className="font-semibold text-foreground">{solved ? 'Решена' : 'Новая'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {solved ? <CheckCircle2 size={14} className="text-green-500" /> : <Code2 size={14} />}
            {task.languages.map((language) => LANGUAGE_LABELS[language]).join(', ')}
          </div>
          {task.isPremium ? (
            <Button size="sm" variant="secondary" disabled>
              <Lock size={14} />
              По подписке
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to={`/app/live-coding/${task.slug}`}>Решать</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function LiveCodingPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<LiveCodingDifficulty | 'all'>('all')
  const [company, setCompany] = useState('all')
  const [language, setLanguage] = useState<LiveCodingLanguage | 'all'>('all')
  const { progress, isSolved, isFavorite, toggleFavorite } = useLiveCodingProgress()

  const companies = useMemo(
    () => Array.from(new Set(LIVE_CODING_TASKS.flatMap((task) => task.companies))).sort(),
    []
  )

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return LIVE_CODING_TASKS.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.category.toLowerCase().includes(normalizedSearch) ||
        task.companies.some((item) => item.toLowerCase().includes(normalizedSearch))
      const matchesDifficulty = difficulty === 'all' || task.difficulty === difficulty
      const matchesCompany = company === 'all' || task.companies.includes(company)
      const matchesLanguage = language === 'all' || task.languages.includes(language)

      return matchesSearch && matchesDifficulty && matchesCompany && matchesLanguage
    })
  }, [company, difficulty, language, search])

  const solvedFreeTasks = LIVE_CODING_TASKS.filter(
    (task) => !task.isPremium && progress.solved.includes(task.id)
  )
  const freeTasksCount = LIVE_CODING_TASKS.filter((task) => !task.isPremium).length
  const progressPercent = freeTasksCount > 0
    ? Math.round((solvedFreeTasks.length / freeTasksCount) * 100)
    : 0

  const solvedByDifficulty = difficulties
    .filter((item): item is LiveCodingDifficulty => item !== 'all')
    .map((item) => ({
      difficulty: item,
      solved: LIVE_CODING_TASKS.filter(
        (task) => task.difficulty === item && progress.solved.includes(task.id)
      ).length,
      total: LIVE_CODING_TASKS.filter((task) => task.difficulty === item && !task.isPremium).length,
    }))

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Code2 size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Interview practice
              </p>
              <h1 className="mt-1 text-2xl font-bold text-foreground">Live Coding</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Практические задачи в формате технического интервью: фильтруйте по сложности,
                компаниям и языкам, запускайте тесты прямо внутри платформы.
              </p>
            </div>
          </div>

          <div className="w-full rounded-lg border border-border bg-background p-4 lg:w-72">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Прогресс</span>
              <span className="text-sm font-semibold text-primary">{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Решено {solvedFreeTasks.length} из {freeTasksCount} доступных задач
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {solvedByDifficulty.map((item) => (
          <div key={item.difficulty} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {DIFFICULTY_LABELS[item.difficulty]}
              </span>
              <TrendingUp size={16} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {item.solved}
              <span className="text-sm font-medium text-muted-foreground"> / {item.total}</span>
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по названию, категории или компании"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch('')}
                type="button"
                aria-label="Очистить поиск"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <select
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
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
            onChange={(event) => setLanguage(event.target.value as LiveCodingLanguage | 'all')}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            aria-label="Язык"
          >
            <option value="all">Все языки</option>
            {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {difficulties.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDifficulty(item)}
              className={cn(
                'shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
                difficulty === item
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              )}
            >
              {item === 'all' ? 'Все сложности' : DIFFICULTY_LABELS[item]}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">
            Найдено задач: {filteredTasks.length}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 size={14} />
            Компании и формат близки к BigFrontend
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              solved={isSolved(task.id)}
              favorite={isFavorite(task.id)}
              onToggleFavorite={() => toggleFavorite(task.id)}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm font-semibold text-foreground">Задачи не найдены</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Измените фильтры или очистите строку поиска.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
