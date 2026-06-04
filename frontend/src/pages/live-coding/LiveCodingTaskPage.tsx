import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FlaskConical,
  Play,
  RotateCcw,
  Send,
  Star,
  Terminal,
  XCircle,
} from 'lucide-react'
import {
  DIFFICULTY_LABELS,
  LANGUAGE_LABELS,
  type LiveCodingLanguage,
  type LiveCodingTask,
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

type LeftTab = 'description' | 'solutions' | 'mine'
type ConsoleTab = 'tests' | 'result'

const leftTabs: Array<{ value: LeftTab; label: string }> = [
  { value: 'description', label: 'Описание' },
  { value: 'solutions', label: 'Подсказки' },
  { value: 'mine', label: 'Моё решение' },
]

const editorTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px', backgroundColor: 'transparent' },
  '.cm-scroller': { fontFamily: 'JetBrains Mono, Consolas, monospace' },
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none' },
})

function difficultyTone(difficulty: LiveCodingTask['difficulty']) {
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

// ── Resize handles ────────────────────────────────────────────────────────────────
function VerticalHandle() {
  return (
    <PanelResizeHandle className="group flex w-3 items-center justify-center outline-none">
      <div className="h-12 w-1 rounded-full bg-border transition-colors group-hover:bg-primary group-data-[resize-handle-state=drag]:bg-primary" />
    </PanelResizeHandle>
  )
}

function HorizontalHandle() {
  return (
    <PanelResizeHandle className="group flex h-3 items-center justify-center outline-none">
      <div className="h-1 w-12 rounded-full bg-border transition-colors group-hover:bg-primary group-data-[resize-handle-state=drag]:bg-primary" />
    </PanelResizeHandle>
  )
}

// ── CodeMirror editor ───────────────────────────────────────────────────────────
function CodeEditor({
  code,
  language,
  onChange,
}: {
  code: string
  language: LiveCodingLanguage
  onChange: (value: string) => void
}) {
  const extensions = useMemo(
    () => [javascript({ typescript: language === 'typescript' }), EditorView.lineWrapping, editorTheme],
    [language]
  )

  return (
    <CodeMirror
      value={code}
      onChange={onChange}
      theme={oneDark}
      height="100%"
      extensions={extensions}
      basicSetup={{ foldGutter: false }}
      className="h-full"
    />
  )
}

// ── Run result panel ──────────────────────────────────────────────────────────────
function ResultPanel({ result }: { result: CodeRunResult | null }) {
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
        <p className="text-sm font-semibold text-destructive">Ошибка выполнения</p>
        <pre className="mt-1 whitespace-pre-wrap text-xs text-destructive/90">{result.error}</pre>
      </div>
    )
  }

  const passed = result.results.filter((item) => item.passed).length
  const total = result.results.length

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'rounded-xl px-3 py-2 text-sm font-semibold',
          result.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        )}
      >
        {result.passed ? 'Все тесты пройдены' : 'Тесты провалены'} · {passed}/{total}
      </div>
      {result.results.map((item) => (
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
            <span className="shrink-0 text-[11px] text-muted-foreground">{item.durationMs}мс</span>
          </div>
          {item.message && (
            <pre className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed text-destructive">
              {item.message}
            </pre>
          )}
        </div>
      ))}
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
}: {
  task: LiveCodingTask
  activeTab: LeftTab
  onTabChange: (tab: LeftTab) => void
  code: string
  solved: boolean
  submittedAt?: string
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 gap-1 border-b border-border px-2 pt-1">
        {leftTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'relative px-3 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {activeTab === tab.value && (
              <motion.div
                layoutId="lc-left-tab"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {activeTab === 'description' && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {task.category}
              </span>
              {task.companies.map((company) => (
                <span
                  key={company}
                  className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                >
                  {company}
                </span>
              ))}
            </div>

            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {task.description}
            </p>

            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Примеры
              </h2>
              <div className="space-y-2">
                {task.examples.map((example) => (
                  <div key={example.input} className="rounded-xl bg-secondary/60 p-3">
                    <p className="font-mono text-xs text-foreground">
                      <span className="text-muted-foreground">Input:</span> {example.input}
                    </p>
                    <p className="mt-1 font-mono text-xs text-foreground">
                      <span className="text-muted-foreground">Output:</span> {example.output}
                    </p>
                    {example.explanation && (
                      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
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
        )}

        {activeTab === 'solutions' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Подсказки помогают проверить направление, но не заменяют самостоятельное решение.
            </p>
            {task.solutionNotes.map((note, index) => (
              <motion.div
                key={note}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-xl border border-border bg-background p-3"
              >
                <p className="text-sm text-foreground">{note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'mine' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-sm font-semibold text-foreground">
                {solved ? 'Решение принято' : 'Решение ещё не принято'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {submittedAt
                  ? `Последняя успешная отправка: ${formatDate(submittedAt)}`
                  : 'Код сохраняется в вашем аккаунте.'}
              </p>
            </div>
            <pre className="overflow-auto rounded-xl bg-slate-950 p-3 text-xs leading-5 text-slate-100">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Editor panel (top-right) ──────────────────────────────────────────────────────
function EditorPanel({
  language,
  code,
  onChange,
  onReset,
}: {
  language: LiveCodingLanguage
  code: string
  onChange: (value: string) => void
  onReset: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">{LANGUAGE_LABELS[language]}</span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <RotateCcw size={12} />
          Сбросить
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <CodeEditor code={code} language={language} onChange={onChange} />
      </div>
    </div>
  )
}

// ── Console panel (bottom-right) ──────────────────────────────────────────────────
function ConsolePanel({
  task,
  activeTab,
  onTabChange,
  runResult,
}: {
  task: LiveCodingTask
  activeTab: ConsoleTab
  onTabChange: (tab: ConsoleTab) => void
  runResult: CodeRunResult | null
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 pt-2">
        <button
          type="button"
          onClick={() => onTabChange('tests')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors',
            activeTab === 'tests' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <FlaskConical size={13} />
          Тесты
          <span className="rounded-full bg-secondary px-1.5 text-[10px] text-secondary-foreground">
            {task.tests.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange('result')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors',
            activeTab === 'result' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Terminal size={13} />
          Результат
          {runResult && !runResult.error && (
            <span
              className={cn(
                'rounded-full px-1.5 text-[10px]',
                runResult.passed ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
              )}
            >
              {runResult.results.filter((item) => item.passed).length}/{runResult.results.length}
            </span>
          )}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {activeTab === 'tests' ? (
          <div className="space-y-2">
            {task.tests.map((test) => (
              <div key={test.title} className="rounded-xl border border-border bg-background p-2.5">
                <p className="text-sm font-medium text-foreground">{test.title}</p>
                <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                  <span className="text-foreground/60">Input:</span> {test.input}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  <span className="text-foreground/60">Expected:</span> {test.expected}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <ResultPanel result={runResult} />
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
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('tests')
  const [language, setLanguage] = useState<LiveCodingLanguage>('javascript')
  const [code, setCode] = useState('')
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

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

  if (task.isPremium) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          title="Задача по подписке"
          description="Эта задача закрыта для текущего тарифа. В списке задач она помечена Premium."
          action={
            <Button asChild>
              <Link to="/app/live-coding">Вернуться к Live Coding</Link>
            </Button>
          }
        />
      </div>
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
    if (result.passed) {
      markSolved(task.id)
      toast.success('Задача засчитана')
    } else {
      toast.error('Не все тесты пройдены')
    }
  }

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

  const problemPanel = (
    <ProblemPanel
      task={task}
      activeTab={leftTab}
      onTabChange={setLeftTab}
      code={code}
      solved={solved}
      submittedAt={submittedAt}
    />
  )
  const editorPanel = (
    <EditorPanel language={language} code={code} onChange={handleCodeChange} onReset={handleReset} />
  )
  const consolePanel = (
    <ConsolePanel task={task} activeTab={consoleTab} onTabChange={setConsoleTab} runResult={runResult} />
  )

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-7rem)] lg:min-h-[620px]">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
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
          >
            {DIFFICULTY_LABELS[task.difficulty]}
          </span>
          {solved && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              <CheckCircle2 size={11} />
              Решена
            </span>
          )}
        </div>

        <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
          <Clock size={13} />
          {task.estimatedMinutes} мин
        </span>

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

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LiveCodingLanguage)}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus:ring-2 focus:ring-ring"
            aria-label="Язык программирования"
          >
            {task.languages.map((item) => (
              <option key={item} value={item}>
                {LANGUAGE_LABELS[item]}
              </option>
            ))}
          </select>

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
        <PanelGroup direction="horizontal" className="min-h-0 flex-1">
          <Panel defaultSize={42} minSize={28} className="min-h-0">
            {problemPanel}
          </Panel>
          <VerticalHandle />
          <Panel defaultSize={58} minSize={32} className="min-h-0">
            <PanelGroup direction="vertical" className="h-full">
              <Panel defaultSize={64} minSize={25} className="min-h-0">
                {editorPanel}
              </Panel>
              <HorizontalHandle />
              <Panel defaultSize={36} minSize={15} className="min-h-0">
                {consolePanel}
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
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
