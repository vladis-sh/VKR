import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronRight, Trophy } from 'lucide-react'
import { testsApi } from '@/shared/api/tests.api'
import { useTestSession, useTestTopics } from '@/features/tests/useTestSession'
import { useTimer } from '@/features/tests/useTimer'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'
import { cn } from '@/shared/lib/cn'
import { TEST_TIME_ATTACK_SECONDS } from '@/shared/constants'
import type { TestQuestion, TestMode } from '@/entities/types'
import { QuizOption, type QuizOptionStatus } from '@/features/tests/QuizOption'

// ── Timer display ─────────────────────────────────────────────────────────────
function TimerDisplay({ seconds, isCountdown }: { seconds: number; isCountdown: boolean }) {
  const m = Math.floor(Math.abs(seconds) / 60)
  const s = Math.abs(seconds) % 60
  const isWarning = isCountdown && seconds <= 60

  return (
    <div className={cn(
      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-mono font-semibold',
      isWarning
        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
        : 'bg-secondary text-foreground'
    )}>
      <Clock size={14} />
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </div>
  )
}

// ── Game Over Modal ────────────────────────────────────────────────────────────
function GameOverModal({ onNext }: { onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl bg-card border border-border p-6 max-w-sm w-full shadow-xl text-center"
      >
        <div className="text-4xl mb-3">💔</div>
        <h3 className="text-lg font-bold text-foreground">Ошибка!</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          Тест завершён — допущена первая ошибка
        </p>
        <Button className="w-full" onClick={onNext}>
          Посмотреть результаты
        </Button>
      </motion.div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
interface TestSessionPageProps {
  mode: TestMode
}

export default function TestSessionPage({ mode }: TestSessionPageProps) {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const initialized = useRef(false)
  const timeUpSubmitted = useRef(false)
  const { data: topics, isError: topicsError } = useTestTopics()

  const isTimeAttack = mode === 'time-attack'
  const isAi = mode === 'ai'

  // AI mode: the topic comes from the modal on the tests hub via ?topic=...
  // (falls back to the backend default when absent).
  const aiTopic = isAi ? searchParams.get('topic')?.trim() || undefined : undefined

  // topic / time-attack / one-mistake all draw questions from a topic chosen via
  // the URL slug. The special slug "all" means "questions from every topic".
  const usesTopicSlug = mode === 'topic' || mode === 'time-attack' || mode === 'one-mistake'
  const hasTopicSlug = usesTopicSlug && !!slug && slug !== 'all'

  // Resolve topic name from slug
  const topicName = hasTopicSlug
    ? (topics ? (topics.find((t) => t.slug === slug)?.name ?? slug) : undefined)
    : undefined

  // Topic shown in the header and stored on the session — the AI topic for AI
  // mode, the resolved topic name otherwise.
  const sessionTopic = isAi ? aiTopic : topicName

  // Initialize session & fetch questions
  useEffect(() => {
    // Wait for the topic list before resolving a topic slug.
    if (hasTopicSlug && !topicName) return
    if (initialized.current) return
    initialized.current = true

    async function init() {
      try {
        setLoading(true)
        const nestMode =
          mode === 'time-attack' ? 'time_attack'
          : mode === 'one-mistake' ? 'one_mistake'
          : mode === 'ai' ? 'ai_generated'
          : 'topic'

        const sessionRes = await testsApi.createSession({
          mode: nestMode,
          topic: sessionTopic,
          timeLimit: isTimeAttack ? TEST_TIME_ATTACK_SECONDS : undefined,
        })
        setSessionId(sessionRes.data.id)

        const questionsRes = isAi
          ? await testsApi.getAIQuestions({ topic: aiTopic, count: 10 })
          : await testsApi.getQuestions({
              topic: topicName,
              limit: isTimeAttack ? 30 : 10,
            })

        const qs: TestQuestion[] = Array.isArray(questionsRes.data) ? questionsRes.data : []
        if (qs.length === 0) { setError('Нет вопросов для этой темы'); return }
        setQuestions(qs)
      } catch (err) {
        // Surface the backend's message (e.g. the off-topic rejection for AI
        // tests) when present; fall back to a generic message otherwise.
        const message = (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message
        setError(message || 'Не удалось загрузить тест. Попробуйте снова.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [mode, topicName, hasTopicSlug, isTimeAttack, isAi, aiTopic, sessionTopic])

  // Timer hook (correct interface)
  const { seconds: timerValue, stop: stopTimer } = useTimer({
    initialSeconds: isTimeAttack ? TEST_TIME_ATTACK_SECONDS : 0,
    countdown: isTimeAttack,
    autoStart: !loading && questions.length > 0,
    onExpire: undefined, // handled below
  })

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedIndex,
    hasAnswered,
    isGameOver,
    willFinish,
    revealed,
    isChecking,
    handleAnswer,
    handleNext,
    handleTimeUp,
    isSubmitting,
    setTimerSeconds,
    setElapsedSeconds,
  } = useTestSession({
    mode,
    topic: sessionTopic,
    questions,
    sessionId,
    countdown: isTimeAttack,
    initialSeconds: isTimeAttack ? TEST_TIME_ATTACK_SECONDS : 0,
  })

  // Sync timer to session hook
  useEffect(() => {
    if (isTimeAttack) {
      setTimerSeconds(timerValue)
      if (timerValue === 0 && !loading && !timeUpSubmitted.current) {
        timeUpSubmitted.current = true
        stopTimer()
        handleTimeUp()
      }
    } else {
      setElapsedSeconds(timerValue)
    }
  }, [timerValue, isTimeAttack, loading, stopTimer, handleTimeUp, setTimerSeconds, setElapsedSeconds])

  useEffect(() => {
    if (isSubmitting) {
      stopTimer()
    }
  }, [isSubmitting, stopTimer])

  // ── Render ──────────────────────────────────────────────────────────────────
  // The session waits on the topic list to resolve the slug; if that request
  // failed, surface it instead of spinning forever.
  const blockedByTopics = hasTopicSlug && !topicName && topicsError

  if (error || blockedByTopics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <div className="text-4xl">😕</div>
        <p className="text-sm text-muted-foreground">
          {error || 'Не удалось загрузить список тем. Попробуйте снова.'}
        </p>
        <Button variant="outline" onClick={() => navigate('/app/tests')}>
          Назад к тестам
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Загрузка теста...</p>
      </div>
    )
  }

  if (!currentQuestion) return null

  const reveal = revealed[currentQuestion.id]

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          {sessionTopic && (
            <p className="text-xs text-muted-foreground mb-0.5">{sessionTopic}</p>
          )}
          <p className="text-sm font-semibold text-foreground">
            Вопрос {currentIndex + 1}
            <span className="text-muted-foreground font-normal"> / {totalQuestions}</span>
          </p>
        </div>
        <TimerDisplay seconds={timerValue} isCountdown={isTimeAttack} />
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            {currentQuestion.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQuestion.options.map((opt, i) => {
          const status: QuizOptionStatus = !reveal
            ? 'neutral'
            : i === reveal.correctIndex
              ? 'correct'
              : selectedIndex === i
                ? 'wrong'
                : 'muted'
          return (
            <QuizOption
              key={i}
              text={opt}
              index={i}
              selected={selectedIndex === i}
              status={status}
              disabled={hasAnswered || isChecking}
              onClick={() => handleAnswer(i)}
            />
          )
        })}
      </div>

      {/* Explanation + Next button */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {reveal.explanation && (
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-xs font-semibold text-foreground mb-1">Объяснение:</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {reveal.explanation}
                </p>
              </div>
            )}
            <Button className="w-full" onClick={handleNext} loading={isSubmitting}>
              {willFinish ? (
                <><Trophy size={16} />Завершить тест</>
              ) : (
                <>Следующий вопрос<ChevronRight size={16} /></>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isGameOver && hasAnswered && (
        <GameOverModal onNext={handleNext} />
      )}
    </div>
  )
}
