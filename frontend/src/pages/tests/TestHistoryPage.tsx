import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTestSessionResult } from '@/features/tests/useTestSession'
import { Spinner } from '@/shared/ui/Spinner'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

export default function TestHistoryPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { data: result, isLoading } = useTestSessionResult(sessionId ?? '')

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <p className="text-sm text-muted-foreground">История не найдена</p>
        <Button variant="outline" asChild>
          <Link to="/app/tests">Назад</Link>
        </Button>
      </div>
    )
  }

  const answers = result.answers ?? []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/app/tests/results/${sessionId}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-foreground">Разбор ответов</h1>
          <p className="text-xs text-muted-foreground">
            {answers.length} вопросов · {result.correctAnswers ?? 0} верных
          </p>
        </div>
      </div>

      {/* Answer list */}
      <div className="space-y-3">
        {answers.map((item, i) => {
          const letters = ['A', 'B', 'C', 'D']
          return (
            <motion.div
              key={item.questionId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'rounded-2xl border-2 bg-card p-4 shadow-sm space-y-3',
                item.isCorrect
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-red-200 dark:border-red-800'
              )}
            >
              {/* Question + result icon */}
              <div className="flex items-start gap-2">
                {item.isCorrect ? (
                  <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium text-foreground leading-snug">
                  {item.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pl-5">
                {item.options.map((opt, idx) => {
                  const isSelected = idx === item.selectedIndex
                  const isCorrect = idx === item.correctIndex
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
                        isCorrect && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                        isSelected && !isCorrect && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                        !isSelected && !isCorrect && 'text-muted-foreground'
                      )}
                    >
                      <span className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                        isCorrect && 'border-green-500 bg-green-500 text-white',
                        isSelected && !isCorrect && 'border-red-500 bg-red-500 text-white',
                        !isSelected && !isCorrect && 'border-border bg-secondary'
                      )}>
                        {letters[idx]}
                      </span>
                      {opt}
                      {isCorrect && <span className="ml-auto text-[10px] font-semibold">Верный</span>}
                      {isSelected && !isCorrect && <span className="ml-auto text-[10px] font-semibold">Ваш ответ</span>}
                    </div>
                  )
                })}
              </div>

              {/* Explanation */}
              {item.explanation && (
                <div className="pl-5 border-l-2 border-border">
                  <p className="text-[11px] font-semibold text-foreground mb-0.5">Объяснение:</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {answers.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          История ответов недоступна
        </p>
      )}
    </div>
  )
}
