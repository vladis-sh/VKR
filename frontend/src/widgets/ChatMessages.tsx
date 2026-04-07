import { useEffect, useRef } from 'react'
import { Copy, Check, Bot, User } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { toast } from '@/features/theme/useToastStore'
import type { ChatMessage } from '@/entities/types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  optimisticMessages?: ChatMessage[]
  isTyping?: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Bot size={14} className="text-primary" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Скопировано')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 ml-1 rounded-md p-1 text-muted-foreground hover:text-foreground transition-all"
      aria-label="Копировать"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-end gap-2', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary' : 'bg-primary/10'
        )}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-primary" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn('group flex items-end gap-1 max-w-[75%]', isUser && 'flex-row-reverse')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-secondary text-foreground rounded-bl-sm'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {!isUser && <CopyButton content={message.content} />}
      </div>
    </motion.div>
  )
}

export function ChatMessages({ messages, optimisticMessages = [], isTyping }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const allMessages = [...messages, ...optimisticMessages]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length, isTyping])

  if (allMessages.length === 0 && !isTyping) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Bot size={26} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Начните разговор</p>
          <p className="text-xs text-muted-foreground mt-1">
            Задайте вопрос или выберите быструю фразу ниже
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <AnimatePresence initial={false}>
        {allMessages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </AnimatePresence>
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
