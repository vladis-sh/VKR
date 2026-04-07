import { Trash2, Plus, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { ASSISTANT_ROLES } from '@/shared/constants'
import type { ChatSession } from '@/entities/types'

interface ChatSessionListProps {
  sessions: ChatSession[]
  activeId: string | null
  onSelect: (session: ChatSession) => void
  onNew: () => void
  onDeleteAll: () => void
  isLoading?: boolean
}

const roleEmoji: Record<string, string> = {
  hr: '👔',
  technical: '💻',
  algorithms: '🧮',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  if (days === 1) return 'Вчера'
  if (days < 7) return `${days} дн. назад`
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function ChatSessionList({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDeleteAll,
}: ChatSessionListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Чаты</span>
        <div className="flex gap-1">
          {sessions.length > 0 && (
            <button
              onClick={onDeleteAll}
              className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Удалить все чаты"
              title="Удалить все"
            >
              <Trash2 size={15} />
            </button>
          )}
          <Button size="icon" onClick={onNew} aria-label="Новый чат" className="h-7 w-7">
            <Plus size={15} />
          </Button>
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence initial={false}>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <MessageSquare size={28} className="text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground text-center">
                Нет чатов.{' '}
                <button onClick={onNew} className="text-primary hover:underline">
                  Создать
                </button>
              </p>
            </div>
          ) : (
            sessions.map((s) => {
              const roleMeta = ASSISTANT_ROLES.find((r) => r.value === s.assistantRole)
              return (
                <motion.button
                  key={s.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => onSelect(s)}
                  className={cn(
                    'w-full flex items-start gap-2.5 rounded-lg p-2.5 text-left transition-colors',
                    activeId === s.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent'
                  )}
                >
                  <span className="text-base shrink-0 mt-0.5">{roleEmoji[s.assistantRole] ?? '💬'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {roleMeta?.label ?? s.assistantRole} · {formatDate(s.updatedAt)}
                    </p>
                  </div>
                </motion.button>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
