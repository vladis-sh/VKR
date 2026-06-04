import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { profileApi } from '@/shared/api/profile.api'
import { QUERY_KEYS } from '@/shared/constants'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

const MODE_LABELS: Record<string, string> = {
  topic: 'По теме',
  time_attack: 'Борьба со временем',
  'time-attack': 'Борьба со временем',
  one_mistake: 'Одна ошибка',
  'one-mistake': 'Одна ошибка',
  ai_generated: 'Тест от ИИ',
  ai: 'Тест от ИИ',
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}м ${s}с` : `${s}с`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function HistorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProfileHistoryPage() {
  const [page, setPage] = useState(1)
  const limit = 15

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.TEST_HISTORY(page),
    queryFn: () => profileApi.getTestHistory({ page, limit }).then((r) => r.data),
  })

  const items = data?.data ?? (Array.isArray(data) ? data : [])
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/app/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">История тестов</h1>
          {data && (
            <p className="text-xs text-muted-foreground">
              {data.total ?? items.length} тестов
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="История пуста"
          description="Пройдите тест, чтобы увидеть историю"
          action={
            <Button asChild>
              <Link to="/app/tests">Начать тест</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => {
            const pct = item.percentage ?? 0
            const color =
              pct >= 80 ? 'text-green-500' : pct >= 50 ? 'text-amber-500' : 'text-red-500'

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/app/tests/results/${item.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                        {MODE_LABELS[item.mode] ?? item.mode}
                      </span>
                      {item.topic && (
                        <span className="text-[10px] text-muted-foreground truncate">{item.topic}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle size={11} className="text-green-500" />
                        {item.correctAnswers ?? 0}/{item.totalQuestions ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatTime(item.durationSeconds ?? 0)}
                      </span>
                      <span>{formatDate(item.completedAt)}</span>
                    </div>
                  </div>
                  <div className={cn('text-sm font-bold shrink-0', color)}>
                    {Math.round(pct)}%
                  </div>
                  <ChevronRight size={15} className="text-muted-foreground shrink-0" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Назад
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Далее
          </Button>
        </div>
      )}
    </div>
  )
}
