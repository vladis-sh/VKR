import { cn } from '@/shared/lib/cn'

export interface CircularProgressProps {
  /** Progress value, 0–100 (clamped and rounded). */
  value: number
  /** Diameter in pixels. */
  size?: number
  /** Ring thickness in pixels. */
  strokeWidth?: number
  /** Extra classes for the wrapper. */
  className?: string
  /** Track color, driven via `currentColor`. */
  trackClassName?: string
  /** Indicator color, driven via `currentColor`. */
  indicatorClassName?: string
  /** Center content. Defaults to the rounded percentage label. */
  children?: React.ReactNode
}

/**
 * Lightweight SVG progress ring used across the app. Colors are controlled with
 * Tailwind text classes (`currentColor`) so it adapts to the active theme.
 */
export function CircularProgress({
  value,
  size = 52,
  strokeWidth = 5,
  className,
  trackClassName = 'text-secondary',
  indicatorClassName = 'text-primary',
  children,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-700 ease-out', indicatorClassName)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        {children ?? <span className="text-xs font-semibold text-foreground">{clamped}%</span>}
      </span>
    </div>
  )
}
