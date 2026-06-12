import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2, FileText } from 'lucide-react'
import { useAdminMaterials, useDeleteMaterial } from '@/features/admin/useAdminMaterials'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'

export default function AdminMaterialsListPage() {
  const { data, isLoading } = useAdminMaterials({ limit: 50 })
  const deleteMaterial = useDeleteMaterial()

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Удалить материал "${title}"?`)) {
      deleteMaterial.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Материалы — администрирование</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Создание, редактирование, мягкое удаление учебных материалов.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/app/admin/materials/new">
              <Plus size={16} />
              Новый материал
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="Материалов пока нет"
          description="Создайте первый материал, нажав на кнопку выше."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Название</th>
                <th className="px-4 py-3 text-left font-medium">Уровень</th>
                <th className="px-4 py-3 text-left font-medium">Статус</th>
                <th className="px-4 py-3 text-left font-medium">Обновлён</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{m.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {m.shortDescription}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{m.level}</td>
                  <td className="px-4 py-3">
                    {m.isPublished ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                        Опубликован
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Черновик
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {m.updatedAt ? new Date(m.updatedAt).toLocaleString('ru-RU') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/app/admin/materials/${m.id}/edit`}>
                          <Pencil size={14} />
                          Изменить
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label={`Удалить «${m.title}»`}
                        onClick={() => handleDelete(m.id, m.title)}
                        loading={deleteMaterial.isPending && deleteMaterial.variables === m.id}
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
