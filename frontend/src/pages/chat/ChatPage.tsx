import { useRef, useState } from 'react'
import { Send, Plus, Trash2, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useChatSessions,
  useCreateChatSession,
  useChatSession,
  useSendMessage,
  useDeleteChatSession,
} from '@/features/chat/useChat'
import { ChatSessionList } from '@/widgets/ChatSessionList'
import { ChatMessages } from '@/widgets/ChatMessages'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { ASSISTANT_ROLES, QUICK_PHRASES } from '@/shared/constants'
import { cn } from '@/shared/lib/cn'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants'
import type { ChatSession, AssistantRole } from '@/entities/types'

// ── New Chat Modal ─────────────────────────────────────────────────────────────
function NewChatModal({
  open,
  onClose,
  onConfirm,
  isLoading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (role: AssistantRole) => void
  isLoading: boolean
}) {
  const [selectedRole, setSelectedRole] = useState<AssistantRole>('technical')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Новый чат"
      description="Выберите сценарий, под который ассистент будет вести разговор."
      className="max-w-lg"
    >
      <div className="grid gap-3 py-1 sm:grid-cols-3">
        {ASSISTANT_ROLES.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelectedRole(role.value as AssistantRole)}
            className={cn(
              'w-full rounded-lg border-2 p-3.5 text-left transition-all',
              selectedRole === role.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 bg-background'
            )}
          >
            <span className="text-2xl">{role.icon}</span>
            <p className="mt-2 text-sm font-semibold text-foreground">{role.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {role.description}
            </p>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-5">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Отмена
        </Button>
        <Button
          className="flex-1"
          loading={isLoading}
          onClick={() => onConfirm(selectedRole)}
        >
          Создать
        </Button>
      </div>
    </Modal>
  )
}

// ── Delete All Modal ──────────────────────────────────────────────────────────
function DeleteAllModal({
  open,
  onClose,
  onConfirm,
  isLoading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Удалить все чаты?"
      description="История сообщений и все созданные сессии будут удалены без восстановления."
    >
      <p className="text-sm text-muted-foreground mb-5">
        Проверьте, что в чатах не осталось важных заметок.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="destructive" className="flex-1" loading={isLoading} onClick={onConfirm}>
          Удалить всё
        </Button>
      </div>
    </Modal>
  )
}

// ── Chat Input ────────────────────────────────────────────────────────────────
function ChatInput({
  onSend,
  isLoading,
  disabled,
}: {
  onSend: (text: string) => void
  isLoading: boolean
  disabled: boolean
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resetHeight = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
  }

  const autoGrow = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`
  }

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || disabled) return
    onSend(trimmed)
    setValue('')
    // setValue('') doesn't fire onInput, so reset textarea height manually.
    resetHeight()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    // Enter sends, Shift+Enter inserts a new line.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const sendQuick = (phrase: string) => {
    if (isLoading || disabled) return
    onSend(phrase)
  }

  return (
    <div className="border-t border-border bg-card p-3 space-y-2">
      {/* Quick phrases */}
      {!disabled && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PHRASES.map((phrase) => (
            <button
              key={phrase}
              onClick={() => sendQuick(phrase)}
              disabled={isLoading}
              className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              {phrase}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          onInput={autoGrow}
          placeholder={disabled ? 'Выберите или создайте чат' : 'Напишите сообщение...'}
          disabled={disabled || isLoading}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 max-h-32 min-h-[40px]"
        />
        <Button
          size="icon"
          onClick={submit}
          disabled={!value.trim() || disabled || isLoading}
          loading={isLoading}
          aria-label="Отправить"
          className="shrink-0 h-10 w-10"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  )
}

// ── Main Chat Page ─────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const queryClient = useQueryClient()

  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions()
  const { data: sessionDetail } = useChatSession(activeSession?.id ?? '')
  const createSession = useCreateChatSession()
  const deleteSession = useDeleteChatSession()

  const {
    sendMessage,
    isLoading: isSending,
    isTyping,
    optimisticMessages,
    error: sendError,
  } = useSendMessage(activeSession?.id ?? '')

  const handleCreateSession = async (role: AssistantRole) => {
    const roleLabel = ASSISTANT_ROLES.find((r) => r.value === role)?.label ?? role
    const newSession = await createSession.mutateAsync({
      title: roleLabel,
      assistantRole: role,
    })
    setActiveSession(newSession)
    setShowNewModal(false)
    setShowSidebar(false)
  }

  const handleDeleteAll = async () => {
    // Delete each session
    for (const s of sessions) {
      await deleteSession.mutateAsync(s.id)
    }
    setActiveSession(null)
    setShowDeleteModal(false)
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSIONS })
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem-5rem)] md:h-[calc(100dvh-3.5rem)] -mx-4 -my-4 md:-mx-6 md:-my-6 overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Session sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 md:relative md:translate-x-0 md:z-auto md:w-56 lg:w-64',
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-3 md:hidden border-b border-border">
          <span className="text-sm font-semibold">Чаты</span>
          <button onClick={() => setShowSidebar(false)}>
            <X size={18} />
          </button>
        </div>
        {!sessionsLoading && (
          <ChatSessionList
            sessions={sessions}
            activeId={activeSession?.id ?? null}
            onSelect={(s) => { setActiveSession(s); setShowSidebar(false) }}
            onNew={() => setShowNewModal(true)}
            onDeleteAll={() => setShowDeleteModal(true)}
          />
        )}
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Открыть список чатов"
          >
            <Menu size={20} />
          </button>
          {activeSession ? (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{activeSession.title}</p>
              <p className="text-xs text-muted-foreground">
                {ASSISTANT_ROLES.find((r) => r.value === activeSession.assistantRole)?.label}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground flex-1">Выберите чат</p>
          )}
          <Button size="sm" variant="outline" onClick={() => setShowNewModal(true)}>
            <Plus size={14} />
            <span className="hidden sm:inline">Новый чат</span>
          </Button>
          {activeSession && (
            <button
              onClick={() => {
                if (!window.confirm(`Удалить чат «${activeSession.title}»? Историю нельзя восстановить.`)) {
                  return
                }
                deleteSession.mutate(activeSession.id)
                setActiveSession(null)
              }}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Удалить чат"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeSession ? (
            <ChatMessages
              messages={sessionDetail?.messages ?? []}
              optimisticMessages={optimisticMessages}
              isTyping={isTyping}
              errorMessage={sendError}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="text-4xl">💬</div>
              <div>
                <p className="text-sm font-semibold text-foreground">Нет активного чата</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Выберите чат из списка или создайте новый
                </p>
              </div>
              <Button onClick={() => setShowNewModal(true)}>
                <Plus size={15} />
                Новый чат
              </Button>
            </div>
          )}

          {activeSession && (
            <ChatInput
              onSend={sendMessage}
              isLoading={isSending}
              disabled={!activeSession}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <NewChatModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onConfirm={handleCreateSession}
        isLoading={createSession.isPending}
      />
      <DeleteAllModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAll}
        isLoading={deleteSession.isPending}
      />
    </div>
  )
}
