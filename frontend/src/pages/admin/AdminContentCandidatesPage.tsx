import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, FileCheck2, Plus, X } from 'lucide-react'
import {
  useAdminContentCandidates,
  usePublishContentCandidate,
  useRejectContentCandidate,
} from '@/features/admin/useAdminContent'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { ContentEntryType, ContentImportStatus } from '@/entities/types'

const contentTypeLabels: Record<ContentEntryType, string> = {
  roadmap: 'Roadmap',
  live_coding_task: 'Live coding',
  test_catalog_theme: 'Test catalog',
}

const statusLabels: Record<ContentImportStatus, string> = {
  pending: 'На модерации',
  approved: 'Опубликован',
  rejected: 'Отклонен',
  failed: 'Ошибка',
}

const statusClasses: Record<ContentImportStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-muted text-muted-foreground',
  failed: 'bg-destructive/10 text-destructive',
}

export default function AdminContentCandidatesPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<ContentEntryType | 'all'>('all')
  const [status, setStatus] = useState<ContentImportStatus | 'all'>('pending')
  const { data, isLoading } = useAdminContentCandidates({
    limit: 50,
    search: search || undefined,
    type: type === 'all' ? undefined : type,
    status: status === 'all' ? undefined : status,
  })
  const publishCandidate = usePublishContentCandidate()
  const rejectCandidate = useRejectContentCandidate()

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileCheck2 size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Кандидаты на публикацию</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Проверьте импортированные материалы перед публикацией в приложении.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/app/admin/content/sources">Источники</Link>
            </Button>
            <Button asChild>
              <Link to="/app/admin/content/candidates/new">
                <Plus size={16} />
                Новый кандидат
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_200px_200px]">
          <Input
            placeholder="Поиск по названию, slug или источнику"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ContentEntryType | 'all')}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Все типы</option>
            {Object.entries(contentTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ContentImportStatus | 'all')}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Все статусы</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="Кандидатов нет"
          description="Запустите источник или добавьте кандидата вручную."
        />
      ) : (
        <div className="space-y-3">
          {data.items.map((candidate) => (
            <div
              key={candidate.id}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${statusClasses[candidate.status]}`}
                    >
                      {statusLabels[candidate.status]}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {contentTypeLabels[candidate.type]}
                    </span>
                    {candidate.slug && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {candidate.slug}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-foreground">
                    {candidate.title}
                  </h2>
                  {candidate.sourceUrl && (
                    <a
                      href={candidate.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block max-w-2xl truncate text-xs text-primary hover:underline"
                    >
                      {candidate.sourceUrl}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={candidate.status !== 'pending'}
                    loading={rejectCandidate.isPending}
                    onClick={() => rejectCandidate.mutate(candidate.id)}
                  >
                    <X size={14} />
                    Отклонить
                  </Button>
                  <Button
                    size="sm"
                    disabled={candidate.status !== 'pending'}
                    loading={publishCandidate.isPending}
                    onClick={() => publishCandidate.mutate(candidate.id)}
                  >
                    <Check size={14} />
                    Опубликовать
                  </Button>
                </div>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Payload JSON
                </summary>
                <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-muted p-3 text-xs">
                  {JSON.stringify(candidate.payload, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
