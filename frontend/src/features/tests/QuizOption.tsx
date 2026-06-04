import { Check, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

/**
 * Visual state of an answer option:
 * - `neutral`  — quiz in progress (relies on `selected` for highlight)
 * - `correct`  — revealed as the right answer
 * - `wrong`    — revealed as the chosen wrong answer
 * - `muted`    — revealed, neither chosen nor correct
 */
export type QuizOptionStatus = 'neutral' | 'correct' | 'wrong' | 'muted'

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

export interface QuizOptionProps {
  text: string
  index: number
  selected?: boolean
  status?: QuizOptionStatus
  disabled?: boolean
  onClick: () => void
}

/** Shared answer-option button used by both the catalog and session test flows. */
export function QuizOption({
  text,
  index,
  selected = false,
  status = 'neutral',
  disabled = false,
  onClick,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all',
        status === 'neutral' &&
          (selected
            ? 'border-primary bg-primary/5 ring-1 ring-primary'
            : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40'),
        status === 'correct' && 'border-success bg-success/10',
        status === 'wrong' && 'border-destructive bg-destructive/10',
        status === 'muted' && 'border-border bg-secondary/40',
        disabled && status === 'neutral' && 'cursor-default'
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
          status === 'neutral' &&
            (selected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground'),
          status === 'correct' && 'border-success bg-success text-white',
          status === 'wrong' && 'border-destructive bg-destructive text-white',
          status === 'muted' && 'border-border bg-secondary text-muted-foreground'
        )}
      >
        {status === 'correct' ? (
          <Check size={14} />
        ) : status === 'wrong' ? (
          <X size={14} />
        ) : (
          (LABELS[index] ?? index + 1)
        )}
      </span>
      <span className={cn('flex-1 leading-relaxed', status === 'muted' ? 'text-muted-foreground' : 'text-foreground')}>
        {text}
      </span>
    </button>
  )
}
