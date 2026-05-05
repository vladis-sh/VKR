import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import {
  useAdminQuestion,
  useCreateQuestion,
  useUpdateQuestion,
} from '@/features/admin/useAdminQuestions'
import type { KnowledgeLevel } from '@/entities/types'

const questionSchema = z.object({
  topic: z.string().min(1, 'Введите тему').max(100),
  text: z.string().min(1, 'Введите текст вопроса'),
  option0: z.string().min(1, 'Введите вариант 1'),
  option1: z.string().min(1, 'Введите вариант 2'),
  option2: z.string().min(1, 'Введите вариант 3'),
  option3: z.string().min(1, 'Введите вариант 4'),
  correctAnswerIndex: z.coerce.number().int().min(0).max(3),
  explanation: z.string().min(1, 'Введите пояснение'),
  difficulty: z.enum(['junior', 'middle', 'senior']),
  isPublished: z.boolean(),
})

type QuestionForm = z.infer<typeof questionSchema>

export default function AdminQuestionFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const { data: existing, isLoading: isLoadingExisting } = useAdminQuestion(id)
  const createQuestion = useCreateQuestion()
  const updateQuestion = useUpdateQuestion(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      topic: '',
      text: '',
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      correctAnswerIndex: 0,
      explanation: '',
      difficulty: 'junior',
      isPublished: true,
    },
  })

  useEffect(() => {
    if (existing) {
      const opts = existing.options ?? []
      reset({
        topic: existing.topic,
        text: existing.text,
        option0: opts[0] ?? '',
        option1: opts[1] ?? '',
        option2: opts[2] ?? '',
        option3: opts[3] ?? '',
        correctAnswerIndex: existing.correctAnswerIndex,
        explanation: existing.explanation ?? '',
        difficulty: existing.difficulty,
        isPublished: existing.isPublished ?? true,
      })
    }
  }, [existing, reset])

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      topic: values.topic.trim(),
      text: values.text.trim(),
      options: [values.option0, values.option1, values.option2, values.option3].map((o) =>
        o.trim()
      ),
      correctAnswerIndex: values.correctAnswerIndex,
      explanation: values.explanation.trim(),
      difficulty: values.difficulty as KnowledgeLevel,
      isPublished: values.isPublished,
    }

    if (isEdit) {
      await updateQuestion.mutateAsync(payload)
    } else {
      await createQuestion.mutateAsync(payload)
    }
    navigate('/app/admin/questions')
  })

  if (isEdit && isLoadingExisting) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Link
        to="/app/admin/questions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} />
        К списку вопросов
      </Link>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">
          {isEdit ? 'Редактирование вопроса' : 'Новый вопрос'}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Тема (slug)"
              placeholder="javascript-basics"
              error={errors.topic?.message}
              {...register('topic')}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Сложность</label>
              <select
                {...register('difficulty')}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="junior">Junior</option>
                <option value="middle">Middle</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Текст вопроса</label>
            <textarea
              {...register('text')}
              rows={3}
              className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.text?.message && (
              <p className="text-xs text-destructive">{errors.text.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isPublished')} />
            Опубликован (виден в тестах)
          </label>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">Варианты ответа</p>
            <p className="text-xs text-muted-foreground">
              Отметьте радиокнопкой правильный вариант.
            </p>
          </div>

          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="flex items-start gap-3">
              <label className="flex h-10 items-center">
                <input
                  type="radio"
                  value={idx}
                  {...register('correctAnswerIndex')}
                  className="h-4 w-4"
                />
              </label>
              <div className="flex-1">
                <Input
                  label={`Вариант ${idx + 1}`}
                  error={errors[`option${idx}` as keyof QuestionForm]?.message as string | undefined}
                  {...register(`option${idx}` as 'option0' | 'option1' | 'option2' | 'option3')}
                />
              </div>
            </div>
          ))}
          {errors.correctAnswerIndex?.message && (
            <p className="text-xs text-destructive">{errors.correctAnswerIndex.message}</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <label className="block text-sm font-medium text-foreground mb-2">Пояснение</label>
          <textarea
            {...register('explanation')}
            rows={4}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.explanation?.message && (
            <p className="mt-1 text-xs text-destructive">{errors.explanation.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/app/admin/questions')}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}
