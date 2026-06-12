import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Group, Panel, Separator } from 'react-resizable-panels'
// EditorView/keymap/Prec come from the re-exports of @uiw/react-codemirror so that
// dev pre-bundling never loads a second copy of @codemirror/state (instanceof breaks).
import CodeMirror, { EditorView, keymap, Prec } from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Send,
  Star,
  Terminal,
  TimerReset,
  XCircle,
} from 'lucide-react'
import {
  DIFFICULTY_LABELS,
  LANGUAGE_LABELS,
  type LiveCodingDifficulty,
  type LiveCodingLanguage,
  type LiveCodingTask,
  type LiveCodingTestCase,
} from '@/entities/liveCoding'
import { runLiveCodingTests, type CodeRunResult } from '@/features/live-coding/codeRunner'
import { useLiveCodingProgress } from '@/features/live-coding/useLiveCodingProgress'
import { useLiveCodingTask } from '@/features/live-coding/useLiveCodingTasks'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { cn } from '@/shared/lib/cn'
import { useMediaQuery } from '@/shared/lib/useMediaQuery'
import { toast } from '@/features/theme/useToastStore'

type LeftTab = 'description' | 'interviewer' | 'submission'
type ConsoleTab = 'cases' | 'result'

const leftTabs: Array<{ value: LeftTab; label: string }> = [
  { value: 'description', label: 'Условие' },
  { value: 'interviewer', label: 'Интервьюер' },
  { value: 'submission', label: 'Решение' },
]

const FONT_FAMILY = 'JetBrains Mono, Fira Code, Consolas, monospace'
const MIN_FONT = 11
const MAX_FONT = 20

// The difficulty labels in the shared dict are plural ("Лёгкие"); a single task reads
// better in the singular form.
const DIFFICULTY_SINGULAR: Record<LiveCodingDifficulty, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
}

function difficultyTone(difficulty: LiveCodingDifficulty) {
  if (difficulty === 'easy') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  if (difficulty === 'medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  return 'bg-red-500/10 text-red-600 dark:text-red-400'
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// ── Resize handles ────────────────────────────────────────────────────────────────
// `Separator` renders the draggable strip itself; we style it and centre an indicator.
// Drag state is exposed via the `data-separator="active"` attribute.
function VerticalHandle() {
  return (
    <Separator className="group flex w-3 items-center justify-center outline-none">
      <div className="h-12 w-1 rounded-full bg-border transition-colors group-hover:bg-primary group-data-[separator=active]:bg-primary" />
    </Separator>
  )
}

function HorizontalHandle() {
  return (
    <Separator className="group flex h-3 items-center justify-center outline-none">
      <div className="h-1 w-12 rounded-full bg-border transition-colors group-hover:bg-primary group-data-[separator=active]:bg-primary" />
    </Separator>
  )
}

// ── CodeMirror editor ───────────────────────────────────────────────────────────
function CodeEditor({
  code,
  language,
  fontSize,
  onChange,
}: {
  code: string
  language: LiveCodingLanguage
  fontSize: number
  onChange: (value: string) => void
}) {
  const extensions = useMemo(
    () => [
      javascript({ typescript: language === 'typescript' }),
      EditorView.lineWrapping,
      // The default keymap binds Mod-Enter to "insert blank line"; swallow it so
      // the global run/submit shortcut doesn't also edit the code.
      Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => true }])),
      EditorView.theme({
        '&': { height: '100%', fontSize: `${fontSize}px`, backgroundColor: 'transparent' },
        '.cm-scroller': { fontFamily: FONT_FAMILY },
        '.cm-gutters': { backgroundColor: 'transparent', border: 'none' },
      }),
    ],
    [language, fontSize]
  )

  return (
    <CodeMirror
      value={code}
      onChange={onChange}
      theme={oneDark}
      height="100%"
      extensions={extensions}
      basicSetup={{ foldGutter: false, highlightActiveLine: true }}
      className="h-full"
    />
  )
}

// ── Meta chip ───────────────────────────────────────────────────────────────────
function MetaChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
      {icon}
      {children}
    </span>
  )
}

// ── Description tab ─────────────────────────────────────────────────────────────
function DescriptionTab({ task }: { task: LiveCodingTask }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
          {task.category}
        </span>
        <MetaChip icon={<Clock size={12} />}>~{task.estimatedMinutes} мин</MetaChip>
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{task.description}</p>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Примеры
        </h2>
        <div className="space-y-2">
          {task.examples.map((example, index) => (
            <div key={`${example.input}-${index}`} className="rounded-xl border border-border bg-secondary/50 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-background text-[11px] font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Пример
                </span>
              </div>
              <p className="mt-2 font-mono text-xs text-foreground">
                <span className="text-muted-foreground">Вход: </span>
                {example.input}
              </p>
              <p className="mt-1 font-mono text-xs text-foreground">
                <span className="text-muted-foreground">Выход: </span>
                {example.output}
              </p>
              {example.explanation && (
                <p className="mt-2 border-t border-border pt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {example.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ограничения
        </h2>
        <ul className="space-y-1.5">
          {task.constraints.map((constraint) => (
            <li key={constraint} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {constraint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Interviewer tab — progressive hints framed as a conversation ────────────────
function InterviewerTab({
  notes,
  revealed,
  onReveal,
}: {
  notes: string[]
  revealed: number
  onReveal: () => void
}) {
  const remaining = notes.length - revealed
  const visible = notes.slice(0, revealed)

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Интервьюер</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Сначала попробуй сам — это ближе к настоящему собеседованию. Если застрял, я подскажу
            направление, но не дам готовый ответ.
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {visible.map((note, index) => (
          <motion.div
            key={note}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Lightbulb size={13} />
            </div>
            <div className="min-w-0 rounded-2xl rounded-tl-sm border border-border bg-card px-3 py-2 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Подсказка {index + 1}
              </p>
              <p className="mt-1 text-sm text-foreground">{note}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {remaining > 0 ? (
        <button
          type="button"
          onClick={onReveal}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Lightbulb size={15} className="text-amber-500" />
          Попросить подсказку
          <span className="rounded-full bg-secondary px-1.5 text-[11px] text-muted-foreground">
            осталось {remaining}
          </span>
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : (
        <div className="rounded-xl border border-border bg-secondary/40 p-3 text-center text-xs text-muted-foreground">
          Подсказки закончились. Дальше — только ты и редактор 💪
        </div>
      )}
    </div>
  )
}

// ── Submission tab ──────────────────────────────────────────────────────────────
function SubmissionTab({
  code,
  solved,
  submittedAt,
}: {
  code: string
  solved: boolean
  submittedAt?: string
}) {
  return (
    <div className="space-y-4">
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border p-3',
          solved ? 'border-success/30 bg-success/5' : 'border-border bg-background'
        )}
      >
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            solved ? 'bg-success/15 text-success' : 'bg-secondary text-muted-foreground'
          )}
        >
          {solved ? <CheckCircle2 size={18} /> : <ListChecks size={18} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {solved ? 'Решение принято' : 'Решение ещё не принято'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {submittedAt
              ? `Последняя успешная отправка: ${formatDate(submittedAt)}`
              : 'Код автоматически сохраняется в вашем аккаунте.'}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Текущий код
        </p>
        <pre className="overflow-auto rounded-xl border border-border bg-slate-950 p-3 text-xs leading-5 text-slate-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

// ── Problem panel (left) ────────────────────────────────────────────────────────
function ProblemPanel({
  task,
  activeTab,
  onTabChange,
  code,
  solved,
  submittedAt,
  revealedHints,
  onRevealHint,
}: {
  task: LiveCodingTask
  activeTab: LeftTab
  onTabChange: (tab: LeftTab) => void
  code: string
  solved: boolean
  submittedAt?: string
  revealedHints: number
  onRevealHint: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-2 pt-1">
        {leftTabs.map((tab) => {
          const isHints = tab.value === 'interviewer'
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'relative px-3 py-2.5 text-sm font-medium transition-colors',
                activeTab === tab.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {tab.label}
                {isHints && revealedHints > 0 && (
                  <span className="rounded-full bg-amber-500/15 px-1.5 text-[10px] font-semibold text-amber-500">
                    {revealedHints}
                  </span>
                )}
              </span>
              {activeTab === tab.value && (
                <motion.div
                  layoutId="lc-left-tab"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {activeTab === 'description' && <DescriptionTab task={task} />}
        {activeTab === 'interviewer' && (
          <InterviewerTab notes={task.solutionNotes} revealed={revealedHints} onReveal={onRevealHint} />
        )}
        {activeTab === 'submission' && (
          <SubmissionTab code={code} solved={solved} submittedAt={submittedAt} />
        )}
      </div>
    </div>
  )
}

// ── Editor panel (top-right) ──────────────────────────────────────────────────────
function EditorPanel({
  language,
  code,
  fontSize,
  onChange,
  onReset,
  onFontSize,
}: {
  language: LiveCodingLanguage
  code: string
  fontSize: number
  onChange: (value: string) => void
  onReset: () => void
  onFontSize: (delta: number) => void
}) {
  const [copied, setCopied] = useState(false)
  const lineCount = useMemo(() => code.split('\n').length, [code])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Не удалось скопировать код')
    }
  }

  const iconButton =
    'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {LANGUAGE_LABELS[language]}
        </span>

        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-md border border-border bg-background">
            <button
              type="button"
              onClick={() => onFontSize(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Уменьшить шрифт"
            >
              <span className="text-[11px] font-semibold">A−</span>
            </button>
            <button
              type="button"
              onClick={() => onFontSize(1)}
              className="flex h-7 w-7 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Увеличить шрифт"
            >
              <span className="text-[13px] font-semibold">A+</span>
            </button>
          </div>

          <button type="button" onClick={handleCopy} className={iconButton} aria-label="Скопировать код">
            {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
          </button>
          <button type="button" onClick={onReset} className={iconButton} aria-label="Сбросить код">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <CodeEditor code={code} language={language} fontSize={fontSize} onChange={onChange} />
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-border px-3 py-1 text-[11px] text-muted-foreground">
        <span>{lineCount} строк</span>
        <span className="hidden items-center gap-1 sm:inline-flex">
          <kbd className="rounded border border-border bg-background px-1 font-sans">Ctrl</kbd>+
          <kbd className="rounded border border-border bg-background px-1 font-sans">↵</kbd>
          запустить
        </span>
      </div>
    </div>
  )
}

// ── Test cases tab (console) ────────────────────────────────────────────────────
function CasesTab({
  tests,
  activeCase,
  onSelectCase,
  result,
}: {
  tests: LiveCodingTestCase[]
  activeCase: number
  onSelectCase: (index: number) => void
  result: CodeRunResult | null
}) {
  const test = tests[activeCase]
  if (!test) return null

  const caseResult = result && !result.error ? result.results[activeCase] : undefined

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {tests.map((item, index) => {
          const r = result && !result.error ? result.results[index] : undefined
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onSelectCase(index)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                index === activeCase
                  ? 'border-primary/40 bg-primary/10 text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {r && (
                <span
                  className={cn('h-1.5 w-1.5 rounded-full', r.passed ? 'bg-success' : 'bg-destructive')}
                />
              )}
              Кейс {index + 1}
            </button>
          )
        })}
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-background p-3">
        <p className="text-sm font-medium text-foreground">{test.title}</p>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Вход</p>
          <pre className="mt-1 overflow-auto rounded-lg bg-secondary/60 p-2 font-mono text-xs text-foreground">
            {test.input}
          </pre>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Ожидаемый результат
          </p>
          <pre className="mt-1 overflow-auto rounded-lg bg-secondary/60 p-2 font-mono text-xs text-foreground">
            {test.expected}
          </pre>
        </div>
        {caseResult && (
          <div
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium',
              caseResult.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            )}
          >
            {caseResult.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {caseResult.passed ? 'Пройден' : 'Провален'}
            <span className="ml-auto font-normal opacity-70">{caseResult.durationMs} мс</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Result tab (console) ────────────────────────────────────────────────────────
function ResultTab({
  result,
  tests,
  isRunning,
}: {
  result: CodeRunResult | null
  tests: LiveCodingTestCase[]
  isRunning: boolean
}) {
  if (isRunning) {
    return (
      <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
        <Loader2 size={18} className="animate-spin text-primary" />
        <p>Выполняем тесты в изолированной среде…</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Terminal size={18} className="opacity-60" />
        <p>Запустите код, чтобы увидеть результат тестов.</p>
      </div>
    )
  }

  if (result.error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
          <XCircle size={15} />
          Ошибка выполнения
        </p>
        <pre className="mt-1.5 whitespace-pre-wrap text-xs text-destructive/90">{result.error}</pre>
      </div>
    )
  }

  const passed = result.results.filter((item) => item.passed).length
  const total = result.results.length
  const totalMs = result.results.reduce((sum, item) => sum + item.durationMs, 0)

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
          result.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        )}
      >
        {result.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
        {result.passed ? 'Все тесты пройдены' : 'Тесты провалены'}
        <span className="ml-auto font-normal">
          {passed}/{total} · {totalMs} мс
        </span>
      </div>

      {result.results.map((item, index) => {
        const test = tests[index]
        return (
          <div
            key={item.title}
            className={cn(
              'rounded-xl border p-2.5',
              item.passed ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {item.passed ? (
                  <CheckCircle2 size={14} className="shrink-0 text-success" />
                ) : (
                  <XCircle size={14} className="shrink-0 text-destructive" />
                )}
                <p className="truncate text-sm text-foreground">{item.title}</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{item.durationMs} мс</span>
            </div>
            {!item.passed && test && (
              <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="text-foreground/60">Вход: </span>
                {test.input}
              </p>
            )}
            {item.message && (
              <pre className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed text-destructive">
                {item.message}
              </pre>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Console panel (bottom-right) ──────────────────────────────────────────────────
function ConsolePanel({
  task,
  activeTab,
  onTabChange,
  activeCase,
  onSelectCase,
  runResult,
  isRunning,
}: {
  task: LiveCodingTask
  activeTab: ConsoleTab
  onTabChange: (tab: ConsoleTab) => void
  activeCase: number
  onSelectCase: (index: number) => void
  runResult: CodeRunResult | null
  isRunning: boolean
}) {
  const tabs: Array<{ value: ConsoleTab; label: string; icon: React.ReactNode }> = [
    { value: 'cases', label: 'Тесты', icon: <FlaskConical size={13} /> },
    { value: 'result', label: 'Результат', icon: <ListChecks size={13} /> },
  ]

  const resultBadge =
    runResult && !runResult.error
      ? `${runResult.results.filter((item) => item.passed).length}/${runResult.results.length}`
      : null

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 pt-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
              activeTab === tab.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.value === 'cases' && (
              <span className="rounded-full bg-secondary px-1.5 text-[10px] text-secondary-foreground">
                {task.tests.length}
              </span>
            )}
            {tab.value === 'result' && resultBadge && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px]',
                  runResult?.passed ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
                )}
              >
                {resultBadge}
              </span>
            )}
            {activeTab === tab.value && (
              <motion.div
                layoutId="lc-console-tab"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {activeTab === 'cases' && (
          <CasesTab
            tests={task.tests}
            activeCase={activeCase}
            onSelectCase={onSelectCase}
            result={runResult}
          />
        )}
        {activeTab === 'result' && (
          <ResultTab result={runResult} tests={task.tests} isRunning={isRunning} />
        )}
      </div>
    </div>
  )
}

function TaskSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-14 rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[60vh] rounded-2xl" />
        <Skeleton className="h-[60vh] rounded-2xl" />
      </div>
    </div>
  )
}

export default function LiveCodingTaskPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: task, isLoading } = useLiveCodingTask(slug)
  const { progress, isSolved, isFavorite, toggleFavorite, markSolved, saveCode, getSavedCode } =
    useLiveCodingProgress()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [leftTab, setLeftTab] = useState<LeftTab>('description')
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('cases')
  const [activeCase, setActiveCase] = useState(0)
  const [language, setLanguage] = useState<LiveCodingLanguage>('javascript')
  const [code, setCode] = useState('')
  const [fontSize, setFontSize] = useState(13)
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)
  const [focusMode, setFocusMode] = useState(false)

  // Interview-style timer.
  const [elapsed, setElapsed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)

  // Stable refs so the load effect doesn't re-run on every keystroke.
  const getSavedCodeRef = useRef(getSavedCode)
  getSavedCodeRef.current = getSavedCode
  const saveCodeRef = useRef(saveCode)
  saveCodeRef.current = saveCode
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingSaveRef = useRef<{
    taskId: string
    language: LiveCodingLanguage
    code: string
  } | null>(null)
  // Latest run/submit handlers, so the keyboard listener stays stable.
  const actionsRef = useRef<{ run: () => void; submit: () => void }>({ run: () => {}, submit: () => {} })

  const flushSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    const pending = pendingSaveRef.current
    if (pending) {
      saveCodeRef.current(pending.taskId, pending.language, pending.code)
      pendingSaveRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!task) return
    if (!task.languages.includes(language)) {
      setLanguage(task.languages[0] ?? 'javascript')
    }
  }, [language, task])

  // Load saved/starter code once per task+language; flush pending save on switch/unmount.
  useEffect(() => {
    if (!task) return
    setCode(getSavedCodeRef.current(task.id, language) ?? task.starterCode[language])
    setRunResult(null)
    return () => flushSave()
  }, [task, language, flushSave])

  // Reset per-task UI state when navigating between tasks.
  useEffect(() => {
    setRevealedHints(0)
    setActiveCase(0)
    setConsoleTab('cases')
    setLeftTab('description')
    setElapsed(0)
    setTimerRunning(true)
  }, [task?.id])

  // Tick the session timer.
  useEffect(() => {
    if (!timerRunning || !task) return
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [timerRunning, task])

  // Global shortcuts: Ctrl/Cmd+Enter runs, +Shift submits, Esc leaves focus mode.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        if (event.shiftKey) actionsRef.current.submit()
        else actionsRef.current.run()
      } else if (event.key === 'Escape') {
        setFocusMode(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (isLoading) return <TaskSkeleton />

  if (!task) {
    return (
      <EmptyState
        title="Задача не найдена"
        description="Проверьте ссылку или вернитесь к списку задач."
        action={
          <Button asChild>
            <Link to="/app/live-coding">К списку задач</Link>
          </Button>
        }
      />
    )
  }

  const solved = isSolved(task.id)
  const favorite = isFavorite(task.id)
  const submittedAt = progress.submittedAt[task.id]

  const handleCodeChange = (value: string) => {
    setCode(value)
    // Persist after the user pauses typing — avoids churning progress state on every keystroke.
    pendingSaveRef.current = { taskId: task.id, language, code: value }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(flushSave, 500)
  }

  const runTests = async () => {
    if (isRunning) return null
    setIsRunning(true)
    setConsoleTab('result')
    try {
      const result = await runLiveCodingTests(code, task.tests)
      setRunResult(result)
      return result
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    const result = await runTests()
    if (!result) return
    if (result.passed) {
      markSolved(task.id)
      setTimerRunning(false)
      toast.success('Задача засчитана')
    } else {
      toast.error('Не все тесты пройдены')
    }
  }

  // Keep the keyboard-shortcut handlers pointed at the current closures.
  actionsRef.current = { run: runTests, submit: handleSubmit }

  const handleReset = () => {
    const starter = task.starterCode[language]
    setCode(starter)
    pendingSaveRef.current = null
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    saveCode(task.id, language, starter)
    setRunResult(null)
  }

  const adjustFont = (delta: number) =>
    setFontSize((current) => Math.min(MAX_FONT, Math.max(MIN_FONT, current + delta)))

  const revealHint = () => setRevealedHints((current) => Math.min(task.solutionNotes.length, current + 1))

  const problemPanel = (
    <ProblemPanel
      task={task}
      activeTab={leftTab}
      onTabChange={setLeftTab}
      code={code}
      solved={solved}
      submittedAt={submittedAt}
      revealedHints={revealedHints}
      onRevealHint={revealHint}
    />
  )
  const editorPanel = (
    <EditorPanel
      language={language}
      code={code}
      fontSize={fontSize}
      onChange={handleCodeChange}
      onReset={handleReset}
      onFontSize={adjustFont}
    />
  )
  const consolePanel = (
    <ConsolePanel
      task={task}
      activeTab={consoleTab}
      onTabChange={setConsoleTab}
      activeCase={activeCase}
      onSelectCase={setActiveCase}
      runResult={runResult}
      isRunning={isRunning}
    />
  )

  return (
    <div
      className={cn(
        focusMode
          ? 'fixed inset-0 z-50 flex flex-col gap-3 overflow-y-auto bg-background p-3 sm:p-4'
          : 'flex flex-col gap-4 lg:h-[calc(100vh-7rem)] lg:min-h-[620px]'
      )}
    >
      {/* Header / interview toolbar */}
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm sm:px-4">
        <Link
          to="/app/live-coding"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Назад к списку задач"
        >
          <ArrowLeft size={16} />
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-base font-bold text-foreground md:text-lg">{task.title}</h1>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
              difficultyTone(task.difficulty)
            )}
            title={DIFFICULTY_LABELS[task.difficulty]}
          >
            {DIFFICULTY_SINGULAR[task.difficulty]}
          </span>
          {solved && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              <CheckCircle2 size={11} />
              Решена
            </span>
          )}
        </div>

        {/* Session timer */}
        <div className="hidden items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 sm:flex">
          <Clock size={13} className="text-muted-foreground" />
          <span className="min-w-[42px] text-center font-mono text-xs font-semibold tabular-nums text-foreground">
            {formatTimer(elapsed)}
          </span>
          <button
            type="button"
            onClick={() => setTimerRunning((value) => !value)}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            aria-label={timerRunning ? 'Пауза таймера' : 'Продолжить таймер'}
          >
            {timerRunning ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            type="button"
            onClick={() => {
              setElapsed(0)
              setTimerRunning(true)
            }}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Сбросить таймер"
          >
            <TimerReset size={12} />
          </button>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(task.id)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors',
              favorite ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
            )}
            aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            <Star size={15} className={cn(favorite && 'fill-current')} />
          </button>

          <button
            type="button"
            onClick={() => setFocusMode((value) => !value)}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
            aria-label={focusMode ? 'Выйти из фокус-режима' : 'Фокус-режим'}
            title={focusMode ? 'Выйти из фокус-режима (Esc)' : 'Фокус-режим'}
          >
            {focusMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <Button size="sm" variant="outline" loading={isRunning} onClick={runTests}>
            <Play size={13} />
            Запустить
          </Button>
          <Button size="sm" loading={isRunning} onClick={handleSubmit}>
            <Send size={13} />
            Отправить
          </Button>
        </div>
      </header>

      {/* Workspace */}
      {isDesktop ? (
        <Group orientation="horizontal" className="min-h-0 flex-1">
          <Panel defaultSize="42" minSize="28" className="min-h-0">
            {problemPanel}
          </Panel>
          <VerticalHandle />
          <Panel defaultSize="58" minSize="32" className="min-h-0">
            <Group orientation="vertical" className="h-full">
              <Panel defaultSize="64" minSize="25" className="min-h-0">
                {editorPanel}
              </Panel>
              <HorizontalHandle />
              <Panel defaultSize="36" minSize="15" className="min-h-0">
                {consolePanel}
              </Panel>
            </Group>
          </Panel>
        </Group>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="h-[55vh]">{problemPanel}</div>
          <div className="h-[60vh]">{editorPanel}</div>
          <div className="h-[45vh]">{consolePanel}</div>
        </div>
      )}
    </div>
  )
}
