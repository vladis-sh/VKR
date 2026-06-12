import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface ModalProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  hideClose?: boolean
}

export function Modal({
  open,
  onOpenChange,
  onClose,
  title,
  description,
  children,
  className,
  hideClose = false,
}: ModalProps) {
  const handleOpenChange = (value: boolean) => {
    onOpenChange?.(value)
    if (!value) onClose?.()
  }
  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-2xl data-[state=open]:animate-modal-in',
            className
          )}
        >
          {!hideClose && (
            <Dialog.Close
              aria-label="Закрыть"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={16} />
            </Dialog.Close>
          )}
          {title && (
            <Dialog.Title className="mb-1 text-lg font-semibold text-foreground">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="mb-4 text-sm text-muted-foreground">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Dialog }
