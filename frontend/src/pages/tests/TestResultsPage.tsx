import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, RotateCcw, List } from 'lucide-react'
import { useTestSessionResult } from '@/features/tests/useTestSession'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

const TEST_MODE_LABELS: Record<string, string> = {
  topic: 'По теме',
  'time-attack': 'Борьба со временем',
  time_attack: 'Борьба со временем',
  'one-mistake': 'Одна ошибка',
  one_mistake: 'Одна ошибка',
  ai: 'Тест от ИИ',
  ai_generated: 'Тест от ИИ',
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}с`
  return `${m}м ${s}с`
}

function ScoreCircle({ percentage }: { percentage: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const color =
    percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg width="144" height="144" className="-rotate-90">
        <circle
          cx="72" cy="72" r={radius}
          fill="none" stroke="currentColor"
          strokeWidth="10"
          className="text-secondary"
        />
        <motion.circle
          cx="72" cy="72" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-foreground"
          style={{ color }}
        >
          {Math.round(percentage)}%
        </motion.p>
        <p className="text-[10px] text-muted-foreground">точность</p>
      </div>
    </div>
  )
}

export default function TestResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { data: result, isLoading } = useTestSessionResult(sessionId ?? '')

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Загрузка результатов...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <p className="text-sm text-muted-foreground">Результаты не найдены</p>
        <Button variant="outline" asChild>
          <Link to="/app/tests">Назад к тестам</Link>
        </Button>
      </div>
    )
  }

  const modeLabel = TEST_MODE_LABELS[result.mode] ?? result.mode

  return (
    <div className="mx-auto max-w-md space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <p className="text-xs text-muted-foreground">{modeLabel}{result.topic ? ` · ${result.topic}` : ''}</p>
        <h1 className="text-xl font-bold text-foreground">Тест завершён</h1>
      </motion.div>

      {/* Score circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <ScoreCircle percentage={result.percentage ?? 0} />
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
          <CheckCircle size={18} className="mx-auto mb-1 text-green-500" />
          <p className="text-lg font-bold text-foreground">{result.correctAnswers ?? 0}</p>
          <p className="text-[10px] text-muted-foreground">Верных</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
          <XCircle size={18} className="mx-auto mb-1 text-red-500" />
          <p className="text-lg font-bold text-foreground">{result.incorrectAnswers ?? 0}</p>
          <p className="text-[10px] text-muted-foreground">Неверных</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
          <Clock size={18} className="mx-auto mb-1 text-blue-500" />
          <p className="text-lg font-bold text-foreground">{formatTime(result.durationSeconds ?? 0)}</p>
          <p className="text-[10px] text-muted-foreground">Время</p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2.5"
      >
        <Button className="w-full" asChild>
          <Link to={`/app/tests/history/${sessionId}`}>
            <List size={16} />
            Разобрать ответы
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/app/tests">
            <RotateCcw size={16} />
            Пройти ещё раз
          </Link>
        </Button>
        <Button variant="ghost" className="w-full text-muted-foreground" asChild>
          <Link to="/app/stats">Посмотреть статистику</Link>
        </Button>
      </motion.div>
    </div>
  )
}
