import { useEffect, useState } from 'react'
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
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'idle'
  )
  const isLoading = Boolean(src) && (imageStatus === 'idle' || imageStatus === 'loading')

  useEffect(() => {
    setImageStatus(src ? 'loading' : 'idle')
  }, [src])

  return (
    <RadixAvatar.Root
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-secondary',
        sizeClasses[size],
        className
      )}
    >
      <RadixAvatar.Image
        src={src}
        alt={name}
        className="aspect-square h-full w-full object-cover"
        onLoadingStatusChange={setImageStatus}
      />
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center bg-secondary">
          <span className="h-1/3 w-1/3 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        </span>
      )}
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
        delayMs={600}
      >
        {initials || '?'}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
