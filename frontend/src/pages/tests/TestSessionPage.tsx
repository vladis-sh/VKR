import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

// ── Option button ─────────────────────────────────────────────────────────────
function OptionButton({
  label,
  index,
  selected,
  correct,
  hasAnswered,
  onClick,
}: {
  label: string
  index: number
  selected: boolean
  correct: boolean
  hasAnswered: boolean
  onClick: () => void
}) {
  const letters = ['A', 'B', 'C', 'D']
  const isCorrectAnswer = hasAnswered && correct
  const isWrongAnswer = hasAnswered && selected && !correct

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      disabled={hasAnswered}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-medium transition-all',
        !hasAnswered && 'border-border bg-card hover:border-primary/40 hover:bg-accent active:scale-[0.99]',
        isCorrectAnswer && 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
        isWrongAnswer && 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
        hasAnswered && !selected && !correct && 'border-border bg-secondary/50 text-muted-foreground'
      )}
    >
      <span className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors',
        !hasAnswered && 'border-border bg-background text-muted-foreground',
        isCorrectAnswer && 'border-green-500 bg-green-500 text-white',
        isWrongAnswer && 'border-red-500 bg-red-500 text-white',
        hasAnswered && !selected && !correct && 'border-border bg-secondary text-muted-foreground'
      )}>
        {letters[index]}
      </span>
      <span className="flex-1">{label}</span>
    </motion.button>
  )
}

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
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const initialized = useRef(false)
  const { data: topics } = useTestTopics()

  const isTimeAttack = mode === 'time-attack'
  const isAi = mode === 'ai'

  // Resolve topic name from slug
  const topicName =
    mode === 'topic'
      ? (topics ? (topics.find((t) => t.slug === slug)?.name ?? slug) : undefined)
      : undefined

  // Initialize session & fetch questions
  useEffect(() => {
    if (mode === 'topic' && !topicName) return
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
          topic: topicName,
          timeLimit: isTimeAttack ? TEST_TIME_ATTACK_SECONDS : undefined,
        })
        setSessionId(sessionRes.data.id)

        const questionsRes = isAi
          ? await testsApi.getAIQuestions({ count: 10 })
          : await testsApi.getQuestions({
              topic: mode === 'topic' ? topicName : undefined,
              limit: isTimeAttack ? 30 : 10,
            })

        const qs: TestQuestion[] = Array.isArray(questionsRes.data) ? questionsRes.data : []
        if (qs.length === 0) { setError('Нет вопросов для этой темы'); return }
        setQuestions(qs)
      } catch {
        setError('Не удалось загрузить тест. Попробуйте снова.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [mode, topicName, isTimeAttack, isAi])

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
    isLastQuestion,
    isGameOver,
    handleAnswer,
    handleNext,
    handleTimeUp,
    isSubmitting,
    setTimerSeconds,
    setElapsedSeconds,
  } = useTestSession({
    mode,
    topic: topicName,
    questions,
    sessionId,
    countdown: isTimeAttack,
    initialSeconds: isTimeAttack ? TEST_TIME_ATTACK_SECONDS : 0,
  })

  // Sync timer to session hook
  useEffect(() => {
    if (isTimeAttack) {
      setTimerSeconds(timerValue)
      if (timerValue === 0 && !loading) {
        stopTimer()
        handleTimeUp()
      }
    } else {
      setElapsedSeconds(timerValue)
    }
  }, [timerValue, isTimeAttack, loading, stopTimer, handleTimeUp, setTimerSeconds, setElapsedSeconds])

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Загрузка теста...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <div className="text-4xl">😕</div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => navigate('/app/tests')}>
          Назад к тестам
        </Button>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          {mode === 'topic' && topicName && (
            <p className="text-xs text-muted-foreground mb-0.5">{topicName}</p>
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
        {currentQuestion.options.map((opt, i) => (
          <OptionButton
            key={i}
            label={opt}
            index={i}
            selected={selectedIndex === i}
            correct={i === currentQuestion.correctIndex}
            hasAnswered={hasAnswered}
            onClick={() => handleAnswer(i)}
          />
        ))}
      </div>

      {/* Explanation + Next button */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {currentQuestion.explanation && (
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-xs font-semibold text-foreground mb-1">Объяснение:</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
            <Button className="w-full" onClick={handleNext} loading={isSubmitting}>
              {isLastQuestion || isGameOver ? (
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
