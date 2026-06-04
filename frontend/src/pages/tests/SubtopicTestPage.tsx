import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react'
import { getSubtopicBySlug } from '@/entities/testCatalog'
import { useTestCatalogTheme } from '@/features/tests/useTestCatalog'
import { useTestCatalogProgress } from '@/features/tests/useTestCatalogProgress'
import { difficultyLabel, difficultyTone } from '@/features/tests/difficulty'
import { Button } from '@/shared/ui/Button'
import { CircularProgress } from '@/shared/ui/CircularProgress'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { cn } from '@/shared/lib/cn'
import { testsApi } from '@/shared/api/tests.api'
import { QuizOption } from '@/features/tests/QuizOption'
import { QUERY_KEYS } from '@/shared/constants'

function TestPageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  )
}

export default function SubtopicTestPage() {
  const { themeSlug, subtopicSlug } = useParams<{
    themeSlug: string
    subtopicSlug: string
  }>()
  const { data: theme, isLoading } = useTestCatalogTheme(themeSlug)
  const subtopic = getSubtopicBySlug(theme, subtopicSlug)
  const { setAnswer, completeSubtopicProgress, resetSubtopicProgress, getQuestionProgress } =
    useTestCatalogProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const queryClient = useQueryClient()
  const startedAtRef = useRef(Date.now())

  if (isLoading) return <TestPageSkeleton />

  if (!theme || !subtopic) {
    return (
      <EmptyState
        title="Тест не найден"
        description="Проверьте ссылку или вернитесь к списку тем."
        action={
          <Button asChild>
            <Link to="/app/tests/themes">К списку тем</Link>
          </Button>
        }
      />
    )
  }

  const themeHref = `/app/tests/theme/${theme.slug}`
  const questions = subtopic.questions
  const total = questions.length
  const question = questions[currentIndex]
  const selectedIndex = getQuestionProgress(question.id)?.selectedIndex
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1

  const restartTest = () => {
    resetSubtopicProgress(subtopic)
    setCurrentIndex(0)
    setShowResults(false)
    startedAtRef.current = Date.now()
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (showResults) {
    const review = questions.map((item, index) => {
      const answered = getQuestionProgress(item.id)?.selectedIndex
      return {
        index,
        question: item,
        answered,
        isCorrect: answered === item.correctIndex,
      }
    })
    const correctCount = review.filter((item) => item.isCorrect).length
    const scorePercent = Math.round((correctCount / total) * 100)
    const scoreMessage =
      scorePercent === 100
        ? 'Отличный результат!'
        : scorePercent >= 60
          ? 'Хороший результат!'
          : 'Есть над чем поработать'

    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Link
          to={themeHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {theme.title}
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-sm"
        >
          <CircularProgress
            value={scorePercent}
            size={120}
            strokeWidth={10}
            indicatorClassName={scorePercent >= 60 ? 'text-success' : 'text-primary'}
          >
            <div>
              <p className="text-2xl font-bold text-foreground">
                {correctCount}/{total}
              </p>
              <p className="text-[10px] text-muted-foreground">верных</p>
            </div>
          </CircularProgress>
          <div>
            <h1 className="text-xl font-bold text-foreground">{scoreMessage}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {subtopic.title} — правильно {correctCount} из {total}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={restartTest}>
              <RotateCcw size={15} />
              Пройти заново
            </Button>
            <Button variant="outline" asChild>
              <Link to={themeHref}>К теме</Link>
            </Button>
          </div>
        </motion.section>

        <div className="space-y-3">
          {review.map((item) => {
            const userAnswer =
              item.answered === undefined ? 'Нет ответа' : item.question.options[item.answered]
            const correctAnswer = item.question.options[item.question.correctIndex]

            return (
              <article
                key={item.question.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-relaxed text-foreground">
                    {item.index + 1}. {item.question.text}
                  </p>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                      item.isCorrect
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {item.isCorrect ? <Check size={12} /> : <X size={12} />}
                    {item.isCorrect ? 'Верно' : 'Ошибка'}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  <p className="flex items-start gap-2">
                    <span
                      className={cn(
                        'mt-0.5 shrink-0',
                        item.isCorrect ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {item.isCorrect ? <Check size={15} /> : <X size={15} />}
                    </span>
                    <span className="text-muted-foreground">
                      Ваш ответ: <span className="text-foreground">{userAnswer}</span>
                    </span>
                  </p>
                  {!item.isCorrect && (
                    <p className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-success">
                        <Check size={15} />
                      </span>
                      <span className="text-muted-foreground">
                        Правильно: <span className="text-foreground">{correctAnswer}</span>
                      </span>
                    </p>
                  )}
                </div>

                <p className="mt-3 rounded-xl bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  {item.question.explanation}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────────
  const handleSelect = (index: number) => setAnswer(question.id, index)

  // Persist an aggregated result so catalog tests also feed Stats.
  const recordCatalogResult = () => {
    const correctCount = questions.filter(
      (item) => getQuestionProgress(item.id)?.selectedIndex === item.correctIndex
    ).length
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
    testsApi
      .recordCatalogResult({
        topic: subtopic.title,
        correctCount,
        totalQuestions: total,
        durationSeconds,
      })
      .then(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS }))
      .catch(() => {
        // Non-blocking — results still render if the backend is unreachable.
      })
  }

  const goNext = () => {
    if (isLast) {
      completeSubtopicProgress(subtopic)
      recordCatalogResult()
      setShowResults(true)
      return
    }
    setCurrentIndex((index) => Math.min(index + 1, total - 1))
  }

  const goPrev = () => setCurrentIndex((index) => Math.max(index - 1, 0))

  const progressPercent = Math.round(((currentIndex + 1) / total) * 100)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        to={themeHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        {theme.title}
      </Link>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold',
              difficultyTone[question.difficulty]
            )}
          >
            {difficultyLabel[question.difficulty]}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Вопрос {currentIndex + 1} из {total}
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="mt-6 text-lg font-bold leading-relaxed text-foreground">
            {question.text}
          </h1>

          <div className="mt-5 space-y-2.5">
            {question.options.map((option, index) => (
              <QuizOption
                key={option}
                text={option}
                index={index}
                selected={selectedIndex === index}
                onClick={() => handleSelect(index)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={goPrev} disabled={isFirst}>
          <ChevronLeft size={16} />
          Назад
        </Button>
        <Button onClick={goNext} size="lg">
          {isLast ? 'Завершить' : 'Далее'}
          {isLast ? <CheckCircle2 size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
    </div>
  )
}
