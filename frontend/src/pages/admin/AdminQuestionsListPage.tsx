import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2, ClipboardList } from 'lucide-react'
import { useAdminQuestions, useDeleteQuestion } from '@/features/admin/useAdminQuestions'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Skeleton } from '@/shared/ui/Skeleton'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'

export default function AdminQuestionsListPage() {
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const debouncedTopic = useDebouncedValue(topic, 300)
  const { data, isLoading } = useAdminQuestions({
    limit: 50,
    search: debouncedSearch || undefined,
    topic: debouncedTopic || undefined,
  })
  const deleteQuestion = useDeleteQuestion()

  const handleDelete = (id: string, text: string) => {
    const preview = text.length > 60 ? text.slice(0, 60) + '…' : text
    if (window.confirm(`Удалить вопрос "${preview}"?`)) {
      deleteQuestion.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Вопросы — администрирование</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Создание, редактирование, мягкое удаление вопросов для тестов.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/app/admin/questions/new">
              <Plus size={16} />
              Новый вопрос
            </Link>
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            placeholder="Поиск по тексту вопроса"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            placeholder="Фильтр по теме (slug)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
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
          title="Вопросов пока нет"
          description="Создайте первый вопрос, нажав на кнопку выше."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Вопрос</th>
                <th className="px-4 py-3 text-left font-medium">Тема</th>
                <th className="px-4 py-3 text-left font-medium">Сложность</th>
                <th className="px-4 py-3 text-left font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((q) => (
                <tr key={q.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground line-clamp-2">{q.text}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {q.sourceType === 'ai' ? 'AI-сгенерирован' : 'Статический'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{q.topic}</td>
                  <td className="px-4 py-3 capitalize">{q.difficulty}</td>
                  <td className="px-4 py-3">
                    {q.isPublished ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                        Опубликован
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Черновик
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/app/admin/questions/${q.id}/edit`}>
                          <Pencil size={14} />
                          Изменить
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label="Удалить вопрос"
                        onClick={() => handleDelete(q.id, q.text)}
                        loading={deleteQuestion.isPending && deleteQuestion.variables === q.id}
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
