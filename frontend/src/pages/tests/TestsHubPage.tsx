import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  Database,
  GitBranch,
  Globe2,
  Network,
  Sigma,
  Zap,
} from 'lucide-react'
import {
  getThemeQuestionCount,
  getThemeSubtopics,
  TEST_CATALOG_THEMES,
  type TestTheme,
} from '@/entities/testCatalog'
import { useTestCatalogProgress } from '@/features/tests/useTestCatalogProgress'
import { cn } from '@/shared/lib/cn'

const themeIcons: Record<string, React.ReactNode> = {
  databases: <Database size={22} />,
  algorithms: <Sigma size={22} />,
  javascript: <BookOpen size={22} />,
  python: <BookOpen size={22} />,
  networks: <Network size={22} />,
  git: <GitBranch size={22} />,
}

const quickModes = [
  {
    to: '/app/tests/time-attack',
    icon: <Zap size={20} className="text-amber-500" />,
    title: 'Борьба со временем',
    desc: '5 минут на максимум вопросов',
  },
  {
    to: '/app/tests/one-mistake',
    icon: <AlertCircle size={20} className="text-red-500" />,
    title: 'Одна ошибка',
    desc: 'Тест завершается после первого промаха',
  },
  {
    to: '/app/tests/ai',
    icon: <Bot size={20} className="text-violet-500" />,
    title: 'Тест от ИИ',
    desc: 'Сгенерировать новый набор вопросов',
  },
]

function statusLabel(status: string) {
  if (status === 'completed') return 'Пройдено'
  if (status === 'in-progress') return 'В процессе'
  return 'Не начато'
}

function ThemeCard({ theme, index }: { theme: TestTheme; index: number }) {
  const { getThemeStats } = useTestCatalogProgress()
  const stats = getThemeStats(theme)
  const subtopicsCount = getThemeSubtopics(theme).length
  const questionsCount = getThemeQuestionCount(theme)

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/app/tests/theme/${theme.slug}`}
        className="group flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {themeIcons[theme.slug] ?? <BookOpen size={22} />}
          </div>
          <span
            className={cn(
              'rounded-md px-2 py-1 text-[10px] font-semibold',
              stats.status === 'completed'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : stats.status === 'in-progress'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-secondary text-secondary-foreground'
            )}
          >
            {statusLabel(stats.status)}
          </span>
        </div>

        <div>
          <h2 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {theme.shortTitle}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {theme.description}
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-secondary px-3 py-2">
              <p className="text-muted-foreground">Подтемы</p>
              <p className="font-semibold text-foreground">{subtopicsCount}</p>
            </div>
            <div className="rounded-md bg-secondary px-3 py-2">
              <p className="text-muted-foreground">Вопросы</p>
              <p className="font-semibold text-foreground">{questionsCount}</p>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Прогресс</span>
              <span className="font-semibold text-foreground">{stats.progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-primary">
            Открыть тему
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function TestsHubPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Тема, раздел, подтема, тест
            </p>
            <h1 className="mt-1 text-2xl font-bold text-foreground">Тесты</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Выберите направление подготовки, откройте подтему и отмечайте, что уже знаете,
              что стоит повторить и что пока даётся сложно.
            </p>
          </div>
          <div className="rounded-lg bg-secondary px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 size={16} className="text-primary" />
              Прогресс сохраняется
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Локально в браузере</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEST_CATALOG_THEMES.map((theme, index) => (
          <ThemeCard key={theme.id} theme={theme} index={index} />
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe2 size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Быстрые режимы</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {quickModes.map((mode) => (
            <Link
              key={mode.to}
              to={mode.to}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                {mode.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{mode.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{mode.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
