import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Database, Pencil, Play, Plus, Trash2 } from 'lucide-react'
import {
  useAdminContentSources,
  useDeleteContentSource,
  useRunContentSource,
} from '@/features/admin/useAdminContent'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { ContentEntryType } from '@/entities/types'

const contentTypeLabels: Record<ContentEntryType, string> = {
  roadmap: 'Roadmap',
  live_coding_task: 'Live coding',
  test_catalog_theme: 'Test catalog',
}

export default function AdminContentSourcesPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<ContentEntryType | 'all'>('all')
  const { data, isLoading } = useAdminContentSources({
    limit: 50,
    search: search || undefined,
    type: type === 'all' ? undefined : type,
  })
  const runSource = useRunContentSource()
  const deleteSource = useDeleteContentSource()

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Удалить источник "${name}"?`)) {
      deleteSource.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Источники контента</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Храните ссылки, адаптеры и JSON-кандидатов перед модерацией.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/app/admin/content/candidates">Кандидаты</Link>
            </Button>
            <Button asChild>
              <Link to="/app/admin/content/sources/new">
                <Plus size={16} />
                Новый источник
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <Input
            placeholder="Поиск по названию, URL или адаптеру"
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
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="Источников пока нет"
          description="Добавьте официальный документ, RSS, GitHub-репозиторий или ручной JSON-импорт."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Источник</th>
                <th className="px-4 py-3 text-left font-medium">Тип</th>
                <th className="px-4 py-3 text-left font-medium">Адаптер</th>
                <th className="px-4 py-3 text-left font-medium">Кандидаты</th>
                <th className="px-4 py-3 text-left font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((source) => (
                <tr key={source.id} className="border-t border-border">
                  <td className="min-w-[260px] px-4 py-3">
                    <div className="font-medium text-foreground">{source.name}</div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block max-w-[360px] truncate text-xs text-primary hover:underline"
                    >
                      {source.url}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {contentTypeLabels[source.type]}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {source.adapter}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {source._count?.candidates ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        source.enabled
                          ? 'rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600'
                          : 'rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'
                      }
                    >
                      {source.enabled ? 'Активен' : 'Отключен'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!source.enabled}
                        loading={runSource.isPending}
                        onClick={() => runSource.mutate(source.id)}
                      >
                        <Play size={14} />
                        Запуск
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/app/admin/content/sources/${source.id}/edit`}>
                          <Pencil size={14} />
                          Править
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        loading={deleteSource.isPending}
                        onClick={() => handleDelete(source.id, source.name)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
