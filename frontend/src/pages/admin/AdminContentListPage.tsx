import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Database, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAdminContentEntries, useDeleteContentEntry } from '@/features/admin/useAdminContent'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import type { ContentEntryType } from '@/entities/types'

const contentTypeLabels: Record<ContentEntryType, string> = {
  roadmap: 'Roadmap',
  live_coding_task: 'Live coding task',
  test_catalog_theme: 'Test catalog theme',
}

export default function AdminContentListPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const [type, setType] = useState<ContentEntryType | 'all'>('all')
  const { data, isLoading } = useAdminContentEntries({
    limit: 50,
    search: debouncedSearch || undefined,
    type: type === 'all' ? undefined : type,
  })
  const deleteContent = useDeleteContentEntry()

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete content entry "${title}"?`)) {
      deleteContent.mutate(id)
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
              <h1 className="text-xl font-bold text-foreground">Content database</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Roadmaps, live coding tasks and test catalog entries now come from the API.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/app/admin/content/new">
                <Plus size={16} />
                New entry
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <Input
            placeholder="Search by title or slug"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ContentEntryType | 'all')}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All types</option>
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
          title="No content entries yet"
          description="Create an entry manually or run an import and publish candidates."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Origin</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((entry) => (
                <tr key={entry.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{entry.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {contentTypeLabels[entry.type]}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {entry.slug}
                  </td>
                  <td className="px-4 py-3 text-xs capitalize text-muted-foreground">
                    {entry.origin}
                  </td>
                  <td className="px-4 py-3">
                    {entry.isPublished ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/app/admin/content/${entry.id}/edit`}>
                          <Pencil size={14} />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label={`Удалить «${entry.title}»`}
                        loading={deleteContent.isPending && deleteContent.variables === entry.id}
                        onClick={() => handleDelete(entry.id, entry.title)}
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
