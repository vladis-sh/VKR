import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLeaderboard } from '@/features/stats/useStats'
import { Avatar } from '@/shared/ui/Avatar'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'
import { cn } from '@/shared/lib/cn'

type SortType = 'correctAnswers' | 'studyTime'

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}ч ${m}м`
  if (m > 0) return `${m}м`
  return `${seconds}с`
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} className="text-amber-400" />
  if (rank === 2) return <Crown size={18} className="text-slate-400" />
  if (rank === 3) return <Crown size={18} className="text-amber-700" />
  return (
    <span className="w-5 text-center text-sm font-bold text-muted-foreground">
      {rank}
    </span>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export default function LeaderboardPage() {
  const [sort, setSort] = useState<SortType>('correctAnswers')
  const { data: entries, isLoading } = useLeaderboard(sort)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/app/stats"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Лидерборд</h1>
      </div>

      {/* Sort toggle */}
      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        {(['correctAnswers', 'studyTime'] as SortType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-xs font-medium transition-all',
              sort === s
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {s === 'correctAnswers' ? 'По ответам' : 'По времени'}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <LeaderboardSkeleton />
      ) : !entries || entries.length === 0 ? (
        <EmptyState
          title="Пока никого нет"
          description="Пройдите тест, чтобы попасть в таблицу лидеров"
        />
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3.5 transition-colors',
                entry.isCurrentUser
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card'
              )}
            >
              {/* Rank */}
              <div className="flex w-6 items-center justify-center shrink-0">
                <RankBadge rank={entry.rank} />
              </div>

              {/* Avatar */}
              <Avatar
                src={entry.avatarUrl ?? undefined}
                name={entry.fullName}
                size="sm"
                className="shrink-0"
              />

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-semibold truncate',
                  entry.isCurrentUser ? 'text-primary' : 'text-foreground'
                )}>
                  {entry.fullName}
                  {entry.isCurrentUser && (
                    <span className="ml-1.5 text-[10px] font-normal text-primary">(Вы)</span>
                  )}
                </p>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                {sort === 'correctAnswers' ? (
                  <>
                    <p className="text-sm font-bold text-foreground">{entry.correctAnswers}</p>
                    <p className="text-[10px] text-muted-foreground">ответов</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      {formatTime(entry.studyTimeSeconds ?? 0)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">обучения</p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
