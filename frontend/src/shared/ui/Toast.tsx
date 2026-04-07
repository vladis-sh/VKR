import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useToastStore } from '@/features/theme/useToastStore'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

const icons = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error: <XCircle size={18} className="text-destructive shrink-0" />,
  info: <Info size={18} className="text-primary shrink-0" />,
}

const variantBorder = {
  success: 'border-green-200 dark:border-green-800',
  error: 'border-destructive/30',
  info: 'border-primary/30',
}

function ToastItemComponent({ toast }: { toast: ToastItem }) {
  const { remove } = useToastStore()

  useEffect(() => {
    const timer = setTimeout(() => remove(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, remove])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={cn(
        'flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg min-w-[280px] max-w-sm',
        variantBorder[toast.variant]
      )}
    >
      {icons[toast.variant]}
      <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
      <button
        onClick={() => remove(toast.id)}
        className="ml-1 shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts } = useToastStore()

  return (
    <div className="fixed bottom-20 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-6 md:right-6 md:left-auto md:translate-x-0 md:items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItemComponent key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
