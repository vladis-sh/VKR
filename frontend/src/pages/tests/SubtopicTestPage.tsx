import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  X,
} from 'lucide-react'
import {
  getSubtopicBySlug,
  getThemeBySlug,
  type CatalogDifficulty,
  type CatalogQuestion,
  type TestTheme,
} from '@/entities/testCatalog'
import {
  type QuestionProgressMark,
  useTestCatalogProgress,
} from '@/features/tests/useTestCatalogProgress'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { cn } from '@/shared/lib/cn'

const difficultyLabel: Record<CatalogDifficulty, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

const progressButtons: Array<{
  mark: QuestionProgressMark
  label: string
  className: string
}> = [
  {
    mark: 'know',
    label: 'Знаю',
    className: 'border-green-500/40 text-green-700 hover:bg-green-500/10 dark:text-green-300',
  },
  {
    mark: 'repeat',
    label: 'Нужно повторить',
    className: 'border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300',
  },
  {
    mark: 'hard',
    label: 'Сложно',
    className: 'border-red-500/40 text-red-700 hover:bg-red-500/10 dark:text-red-300',
  },
]

function difficultyTone(difficulty: CatalogDifficulty) {
  if (difficulty === 'easy') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (difficulty === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
}

function QuestionOption({
  option,
  index,
  selected,
  checked,
  correct,
  onSelect,
}: {
  option: string
  index: number
  selected: boolean
  checked: boolean
  correct: boolean
  onSelect: () => void
}) {
  const isWrong = checked && selected && !correct

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-4 text-left text-sm transition-all',
        !checked && selected && 'border-primary bg-primary/5',
        !checked && !selected && 'border-border bg-card hover:border-primary/40',
        checked && correct && 'border-green-500 bg-green-500/10',
        checked && isWrong && 'border-destructive bg-destructive/10',
        checked && !correct && !selected && 'border-border bg-secondary/40 text-muted-foreground'
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
          selected ? 'border-primary bg-primary text-white' : 'border-border bg-background',
          checked && correct && 'border-green-500 bg-green-500 text-white',
          checked && isWrong && 'border-destructive bg-destructive text-white'
        )}
      >
        {checked && correct ? <Check size={14} /> : checked && isWrong ? <X size={14} /> : index + 1}
      </span>
      <span className="leading-relaxed">{option}</span>
    </button>
  )
}

function SubtopicTree({
  theme,
  activeSubtopic,
}: {
  theme: TestTheme
  activeSubtopic: string
}) {
  const { getSubtopicStats } = useTestCatalogProgress()

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
      <p className="mb-3 px-1 text-sm font-semibold text-foreground">Подтемы</p>
      <div className="space-y-3">
        {theme.sections.map((section) => (
          <div key={section.id}>
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.subtopics.map((subtopic) => {
                const stats = getSubtopicStats(subtopic)
                const active = subtopic.slug === activeSubtopic

                return (
                  <Link
                    key={subtopic.id}
                    to={`/app/tests/theme/${theme.slug}/${subtopic.slug}`}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-md px-2 py-2 text-xs transition-colors',
                      active
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    <span className="line-clamp-2">{subtopic.title}</span>
                    {stats.status === 'completed' && (
                      <CheckCircle2
                        size={13}
                        className={cn('shrink-0', active ? 'text-white' : 'text-green-500')}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SubtopicTestPage() {
  const { themeSlug, subtopicSlug } = useParams<{
    themeSlug: string
    subtopicSlug: string
  }>()
  const navigate = useNavigate()
  const theme = getThemeBySlug(themeSlug)
  const subtopic = getSubtopicBySlug(theme, subtopicSlug)
  const {
    setAnswer,
    checkQuestion,
    markQuestion,
    getQuestionProgress,
    getSubtopicStats,
  } = useTestCatalogProgress()
  const [currentIndex, setCurrentIndex] = useState(0)

  const question = subtopic?.questions[currentIndex]
  const questionProgress = question ? getQuestionProgress(question.id) : undefined
  const selectedIndex = questionProgress?.selectedIndex
  const checked = Boolean(questionProgress?.checked)
  const stats = subtopic ? getSubtopicStats(subtopic) : undefined

  if (!theme || !subtopic || !question || !stats) {
    return (
      <EmptyState
        title="Тест не найден"
        description="Проверьте ссылку или вернитесь к списку тем."
        action={
          <Button asChild>
            <Link to="/app/tests">К списку тем</Link>
          </Button>
        }
      />
    )
  }

  const isFirst = currentIndex === 0
  const isLast = currentIndex === subtopic.questions.length - 1

  const handleSelect = (index: number) => {
    if (checked) return
    setAnswer(question.id, index)
  }

  const handleCheck = () => {
    checkQuestion(question.id)
  }

  const handleMark = (mark: QuestionProgressMark) => {
    markQuestion(question.id, mark)
  }

  const goNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, subtopic.questions.length - 1))
  }

  const goPrev = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0))
  }

  const selectQuestion = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/app/tests/theme/${theme.slug}`)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">{theme.title}</p>
          <h1 className="text-xl font-bold text-foreground">{subtopic.title}</h1>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <SubtopicTree
            theme={theme}
            activeSubtopic={subtopic.slug}
          />

          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Прогресс подтемы</span>
              <span className="font-semibold text-primary">{stats.progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${stats.progressPercent}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-secondary px-2 py-2">
                <p className="font-semibold text-green-600">{stats.know}</p>
                <p className="text-muted-foreground">Знаю</p>
              </div>
              <div className="rounded-md bg-secondary px-2 py-2">
                <p className="font-semibold text-amber-600">{stats.repeat}</p>
                <p className="text-muted-foreground">Повтор</p>
              </div>
              <div className="rounded-md bg-secondary px-2 py-2">
                <p className="font-semibold text-red-600">{stats.hard}</p>
                <p className="text-muted-foreground">Сложно</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('rounded-md px-2 py-1 text-[10px] font-semibold', difficultyTone(question.difficulty))}>
                    {difficultyLabel[question.difficulty]}
                  </span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground">
                    Вопрос {currentIndex + 1} из {subtopic.questions.length}
                  </span>
                </div>
                <p className="mt-4 text-base font-semibold leading-relaxed text-foreground">
                  {question.text}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {subtopic.questions.map((item: CatalogQuestion, index: number) => {
                  const itemProgress = getQuestionProgress(item.id)
                  const active = index === currentIndex

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectQuestion(index)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors',
                        active
                          ? 'border-primary bg-primary text-white'
                          : itemProgress?.mark
                            ? 'border-green-500/30 bg-green-500/10 text-green-700'
                            : 'border-border bg-background text-muted-foreground hover:bg-accent'
                      )}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {question.options.map((option, index) => (
                <QuestionOption
                  key={option}
                  option={option}
                  index={index}
                  selected={selectedIndex === index}
                  checked={checked}
                  correct={question.correctIndex === index}
                  onSelect={() => handleSelect(index)}
                />
              ))}
            </div>

            {checked && (
              <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm font-semibold text-foreground">Объяснение</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleCheck}
                  disabled={selectedIndex === undefined}
                >
                  <Eye size={15} />
                  {checked ? 'Ответ показан' : 'Проверить'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => checkQuestion(question.id)}
                >
                  <RotateCcw size={15} />
                  Показать ответ
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {progressButtons.map((button) => (
                  <button
                    key={button.mark}
                    type="button"
                    onClick={() => handleMark(button.mark)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      button.className,
                      questionProgress?.mark === button.mark && 'bg-current/10 ring-2 ring-current/20'
                    )}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={goPrev} disabled={isFirst}>
              <ChevronLeft size={15} />
              Предыдущий
            </Button>
            <Button onClick={goNext} disabled={isLast}>
              Следующий
              <ChevronRight size={15} />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
