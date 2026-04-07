import * as RadixAvatar from '@radix-ui/react-avatar'
import { cn } from '@/shared/lib/cn'
import { getInitials } from '@/shared/lib/utils'

export interface AvatarProps {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

export function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  const initials = getInitials(name)

  return (
    <RadixAvatar.Root
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeClasses[size],
        className
      )}
    >
      <RadixAvatar.Image
        src={src}
        alt={name}
        className="aspect-square h-full w-full object-cover"
      />
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
        delayMs={600}
      >
        {initials || '?'}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
