import { useEffect, useRef, useState } from 'react'
import { Copy, Check, Bot, User, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { cn } from '@/shared/lib/cn'
import { toast } from '@/features/theme/useToastStore'
import type { ChatMessage } from '@/entities/types'
import type { PendingMessage } from '@/features/chat/useChat'

interface ChatMessagesProps {
  messages: ChatMessage[]
  optimisticMessages?: PendingMessage[]
  isTyping?: boolean
  errorMessage?: string | null
}

// ── Markdown rendering (assistant replies) ──────────────────────────────────────

const CodeSpan: Components['code'] = ({ className, children }) => {
  // Inline code has no language class; fenced blocks get `language-*`/`hljs`
  // from rehype-highlight, which is how we tell the two apart.
  if (!className) {
    return (
      <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.85em]">
        {children}
      </code>
    )
  }
  return <code className={cn('font-mono', className)}>{children}</code>
}

const CodeBlock: Components['pre'] = ({ children }) => {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    const text = preRef.current?.textContent ?? ''
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  return (
    <div className="group/code relative my-2">
      <button
        type="button"
        onClick={copyCode}
        className="absolute right-2 top-2 z-10 rounded-md bg-white/10 p-1 text-gray-300 opacity-0 transition-opacity hover:bg-white/20 hover:text-white group-hover/code:opacity-100"
        aria-label="Копировать код"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      </button>
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-lg bg-[#0d1117] p-3 text-xs leading-relaxed"
      >
        {children}
      </pre>
    </div>
  )
}

const markdownComponents: Components = {
  code: CodeSpan,
  pre: CodeBlock,
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 last:mb-0 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 last:mb-0 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h3 className="mb-2 mt-1 text-base font-semibold">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-2 mt-1 text-base font-semibold">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-1.5 mt-1 text-sm font-semibold">{children}</h4>,
  h4: ({ children }) => <h4 className="mb-1.5 mt-1 text-sm font-semibold">{children}</h4>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-2 py-1 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
  hr: () => <hr className="my-3 border-border" />,
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// ── Pieces ──────────────────────────────────────────────────────────────────────

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

function MessageBubble({ message }: { message: PendingMessage }) {
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
              : 'bg-secondary text-foreground rounded-bl-sm',
            message.failed && 'opacity-70 ring-1 ring-destructive/40'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownMessage content={message.content} />
          )}
          {message.failed && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
              <AlertCircle size={11} />
              Не отправлено
            </p>
          )}
        </div>
        {!isUser && <CopyButton content={message.content} />}
      </div>
    </motion.div>
  )
}

export function ChatMessages({
  messages,
  optimisticMessages = [],
  isTyping,
  errorMessage,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // System messages are an internal concept — never render them.
  const visible = messages.filter((m) => m.role !== 'system')
  const allMessages: PendingMessage[] = [...visible, ...optimisticMessages]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length, isTyping, errorMessage])

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
      {errorMessage && !isTyping && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
