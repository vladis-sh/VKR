import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { notificationsApi } from '@/shared/api/notifications.api'
import { QUERY_KEYS, WEEKDAYS } from '@/shared/constants'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import { cn } from '@/shared/lib/cn'
import { toast } from '@/features/theme/useToastStore'
import type { NotificationSettings } from '@/entities/types'

export default function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: () => notificationsApi.getSettings().then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: (data: NotificationSettings) => notificationsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS })
      toast.success('Настройки сохранены')
    },
    onError: () => {
      toast.error('Не удалось сохранить настройки')
    },
  })

  const { register, handleSubmit, watch, setValue, control, reset } = useForm<NotificationSettings>({
    defaultValues: {
      enabled: false,
      time: '09:00',
      weekdays: [1, 2, 3, 4, 5],
    },
  })

  // Sync with fetched data
  useEffect(() => {
    if (settings) {
      reset({
        enabled: settings.enabled ?? false,
        time: settings.time ?? '09:00',
        weekdays: settings.weekdays ?? [1, 2, 3, 4, 5],
      })
    }
  }, [settings, reset])

  const enabled = watch('enabled')
  const weekdays = watch('weekdays')

  const toggleWeekday = (day: number) => {
    const current = weekdays ?? []
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort()
    setValue('weekdays', updated, { shouldDirty: true })
  }

  const onSubmit = (data: NotificationSettings) => {
    mutation.mutate(data)
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/app/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Уведомления</h1>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Bell size={17} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Напоминания</p>
                  <p className="text-xs text-muted-foreground">Напоминать о занятиях</p>
                </div>
              </div>
              <Controller
                control={control}
                name="enabled"
                render={({ field }) => (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      field.value ? 'bg-primary' : 'bg-secondary'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                        field.value && 'translate-x-5'
                      )}
                    />
                  </button>
                )}
              />
            </div>

            {/* Time + weekdays (only when enabled) */}
            {enabled && (
              <>
                {/* Time picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Время уведомления</label>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register('time')}
                  />
                </div>

                {/* Weekdays */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Дни недели</label>
                  <div className="flex gap-1.5">
                    {WEEKDAYS.map((label, idx) => {
                      const day = idx + 1
                      const active = (weekdays ?? []).includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleWeekday(day)}
                          className={cn(
                            'flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-medium transition-all',
                            active
                              ? 'bg-primary text-white'
                              : 'bg-secondary text-secondary-foreground hover:bg-accent'
                          )}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <Button type="submit" className="w-full" loading={mutation.isPending}>
            Сохранить
          </Button>
        </form>
      )}
    </div>
  )
}
