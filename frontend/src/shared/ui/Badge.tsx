import { cn } from '@/shared/lib/cn'
import type { KnowledgeLevel } from '@/entities/types'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'level'
  level?: KnowledgeLevel
  size?: 'sm' | 'md'
}

const variantClasses = {
  default: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border border-border',
  destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
  outline: 'border border-border text-foreground',
  success: 'bg-success/10 text-success border border-success/20',
  level: '',
}

const levelClasses: Record<KnowledgeLevel, string> = {
  junior: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  middle: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  senior: 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({
  className,
  variant = 'default',
  level,
  size = 'md',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        sizeClasses[size],
        variant === 'level' && level ? levelClasses[level] : variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
