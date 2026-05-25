import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Editor, { type BeforeMount, type OnMount } from '@monaco-editor/react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  FlaskConical,
  Play,
  RotateCcw,
  Send,
  Sparkles,
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
import {
  runLiveCodingTests,
  type CodeRunResult,
} from '@/features/live-coding/codeRunner'
import { useLiveCodingProgress } from '@/features/live-coding/useLiveCodingProgress'
import { useLiveCodingTask } from '@/features/live-coding/useLiveCodingTasks'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import { cn } from '@/shared/lib/cn'
import { toast } from '@/features/theme/useToastStore'

type LeftTab = 'description' | 'mine' | 'solutions'
type ConsoleTab = 'tests' | 'result'

const leftTabs: Array<{ value: LeftTab; label: string }> = [
  { value: 'description', label: 'Описание' },
  { value: 'mine', label: 'Моё решение' },
  { value: 'solutions', label: 'Подсказки' },
]

const helperDefinitions = [
  {
    name: 'print',
    signature: 'print(...values)',
    description: 'Выводит значения в результат запуска.',
    snippet: 'print(${1:value})',
  },
  {
    name: 'range',
    signature: 'range(end) / range(start, end, step?)',
    description: 'Создаёт массив чисел, как в Python.',
    snippet: 'range(${1:end})',
  },
  {
    name: 'deepClone',
    signature: 'deepClone(value)',
    description: 'Возвращает глубокую копию значения.',
    snippet: 'deepClone(${1:value})',
  },
  {
    name: 'isEqual',
    signature: 'isEqual(actual, expected)',
    description: 'Глубоко сравнивает массивы, объекты и примитивы.',
    snippet: 'isEqual(${1:actual}, ${2:expected})',
  },
]

const helperTypes = `
declare function print(...values: unknown[]): void;
declare function range(end: number): number[];
declare function range(start: number, end: number, step?: number): number[];
declare function deepClone<T>(value: T): T;
declare function isEqual(actual: unknown, expected: unknown): boolean;
`

function difficultyTone(difficulty: LiveCodingTask['difficulty']) {
  if (difficulty === 'easy')
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (difficulty === 'medium')
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CodeEditor({
  code,
  language,
  onChange,
}: {
  code: string
  language: LiveCodingLanguage
  onChange: (value: string) => void
}) {
  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      helperTypes,
      'file:///live-coding-helpers-js.d.ts'
    )
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      helperTypes,
      'file:///live-coding-helpers-ts.d.ts'
    )

    monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ['p', 'r', 'd', 'i'],
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        return {
          suggestions: helperDefinitions.map((helper) => ({
            label: helper.name,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: helper.snippet,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: helper.signature,
            documentation: helper.description,
            range,
          })),
        }
      },
    })
  }

  const handleMount: OnMount = (editor) => {
    editor.focus()
  }

  return (
    <div className="h-full overflow-hidden bg-slate-950">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value ?? '')}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        loading={
          <div className="h-full bg-slate-950 p-4">
            <div className="mb-5 flex gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-700" />
              <div className="h-2 w-2 rounded-full bg-slate-700" />
              <div className="h-2 w-2 rounded-full bg-slate-700" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="h-3 animate-pulse rounded bg-slate-800"
                  style={{ width: `${88 - (index % 4) * 12}%` }}
                />
              ))}
            </div>
          </div>
        }
        options={{
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          cursorBlinking: 'smooth',
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontLigatures: true,
          fontSize: 13,
          formatOnPaste: true,
          formatOnType: true,
          minimap: { enabled: false },
          padding: { top: 12, bottom: 12 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}

function HelpersMenu({ onInsert }: { onInsert: (snippet: string) => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-2.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700',
          open && 'bg-slate-700'
        )}
        aria-expanded={open}
      >
        <Sparkles size={13} />
        Встроенные функции
        <ChevronDown
          size={12}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-[280px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-[320px]">
          <div className="border-b border-border px-3 py-2">
            <p className="text-xs font-semibold text-foreground">Хелперы в редакторе</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Кликните, чтобы вставить в конец кода.
            </p>
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {helperDefinitions.map((helper) => (
              <li key={helper.name}>
                <button
                  type="button"
                  onClick={() => {
                    onInsert(helper.snippet.replace(/\$\{\d+:([^}]+)\}/g, '$1'))
                    setOpen(false)
                  }}
                  className="block w-full px-3 py-2 text-left transition-colors hover:bg-accent"
                >
                  <code className="text-xs font-semibold text-primary">{helper.signature}</code>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {helper.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

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
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
        <p className="text-sm font-semibold text-destructive">Ошибка выполнения</p>
        <pre className="mt-1 whitespace-pre-wrap text-xs text-destructive/90">
          {result.error}
        </pre>
      </div>
    )
  }

  const passed = result.results.filter((item) => item.passed).length
  const total = result.results.length

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'rounded-md px-3 py-2 text-sm font-semibold',
          result.passed
            ? 'bg-green-500/10 text-green-700 dark:text-green-300'
            : 'bg-destructive/10 text-destructive'
        )}
      >
        {result.passed ? 'Все тесты пройдены' : 'Тесты провалены'} · {passed}/{total}
      </div>
      {result.results.map((item) => (
        <div
          key={item.title}
          className={cn(
            'rounded-md border p-2.5',
            item.passed
              ? 'border-green-500/30 bg-green-500/5'
              : 'border-destructive/30 bg-destructive/5'
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {item.passed ? (
                <CheckCircle2 size={14} className="shrink-0 text-green-600" />
              ) : (
                <XCircle size={14} className="shrink-0 text-destructive" />
              )}
              <p className="truncate text-sm text-foreground">{item.title}</p>
            </div>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {item.durationMs}мс
            </span>
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

export default function LiveCodingTaskPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: task, isLoading } = useLiveCodingTask(slug)
  const {
    progress,
    isSolved,
    isFavorite,
    toggleFavorite,
    markSolved,
    saveCode,
    getSavedCode,
  } = useLiveCodingProgress()
  const [leftTab, setLeftTab] = useState<LeftTab>('description')
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('tests')
  const [language, setLanguage] = useState<LiveCodingLanguage>('javascript')
  const [code, setCode] = useState('')
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!task) return
    if (!task.languages.includes(language)) {
      setLanguage(task.languages[0] ?? 'javascript')
    }
  }, [language, task])

  useEffect(() => {
    if (!task) return
    const savedCode = getSavedCode(task.id, language)
    setCode(savedCode ?? task.starterCode[language])
    setRunResult(null)
  }, [getSavedCode, language, task])

  if (isLoading) return <FullPageSpinner />

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
    saveCode(task.id, language, value)
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
    saveCode(task.id, language, starter)
    setRunResult(null)
  }

  const insertHelper = (snippet: string) => {
    const nextCode = `${code.trimEnd()}\n\n${snippet}`
    handleCodeChange(nextCode)
  }

  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100vh-8rem)] lg:min-h-[640px]">
      {/* Compact header */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <button
          onClick={() => navigate('/app/live-coding')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Назад к списку задач"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-base font-semibold text-foreground">{task.title}</h1>
          <span
            className={cn(
              'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold',
              difficultyTone(task.difficulty)
            )}
          >
            {DIFFICULTY_LABELS[task.difficulty]}
          </span>
          {solved && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
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
              'flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors',
              favorite ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
            )}
            aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            <Star size={15} className={cn(favorite && 'fill-current')} />
          </button>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LiveCodingLanguage)}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
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
      </div>

      <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {/* Left: tabs + content */}
        <section className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:min-h-0">
          <div className="flex shrink-0 border-b border-border px-1 pt-1">
            {leftTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setLeftTab(tab.value)}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium transition-colors',
                  leftTab === tab.value
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                {leftTab === tab.value && (
                  <motion.div
                    layoutId="left-tab-indicator"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 lg:min-h-0">
            {leftTab === 'description' && (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-1.5">
                  {task.companies.map((company) => (
                    <span
                      key={company}
                      className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                    >
                      {company}
                    </span>
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {task.description}
                </p>

                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Примеры
                  </h2>
                  <div className="space-y-2">
                    {task.examples.map((example) => (
                      <div key={example.input} className="rounded-md bg-secondary/60 p-3">
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
                      <li
                        key={constraint}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {leftTab === 'mine' && (
              <div className="space-y-4">
                <div className="rounded-md border border-border bg-background p-3">
                  <p className="text-sm font-semibold text-foreground">
                    {solved ? 'Решение принято' : 'Решение ещё не принято'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {submittedAt
                      ? `Последняя успешная отправка: ${formatDate(submittedAt)}`
                      : 'Код сохраняется локально в браузере.'}
                  </p>
                </div>
                <pre className="max-h-[420px] overflow-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                  <code>{code}</code>
                </pre>
              </div>
            )}

            {leftTab === 'solutions' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Подсказки помогают проверить направление, но не заменяют самостоятельное
                  решение.
                </p>
                {task.solutionNotes.map((note, index) => (
                  <motion.div
                    key={note}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <p className="text-sm text-foreground">{note}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right: editor + console */}
        <section className="flex flex-col gap-3 lg:min-h-0">
          <div className="flex h-[65vh] min-h-[360px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:h-auto lg:min-h-[320px] lg:flex-1">
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-slate-900 px-3 py-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="font-mono">{LANGUAGE_LABELS[language]}</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpersMenu onInsert={insertHelper} />
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-700 bg-slate-800/60 px-2.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
                >
                  <RotateCcw size={12} />
                  Сбросить
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <CodeEditor code={code} language={language} onChange={handleCodeChange} />
            </div>
          </div>

          <div className="flex max-h-[360px] min-h-[200px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 pt-2">
              <button
                type="button"
                onClick={() => setConsoleTab('tests')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors',
                  consoleTab === 'tests'
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
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
                onClick={() => setConsoleTab('result')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors',
                  consoleTab === 'result'
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Terminal size={13} />
                Результат
                {runResult && !runResult.error && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[10px]',
                      runResult.passed
                        ? 'bg-green-500/15 text-green-600 dark:text-green-300'
                        : 'bg-destructive/15 text-destructive'
                    )}
                  >
                    {runResult.results.filter((item) => item.passed).length}/
                    {runResult.results.length}
                  </span>
                )}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {consoleTab === 'tests' ? (
                <div className="space-y-2">
                  {task.tests.map((test) => (
                    <div
                      key={test.title}
                      className="rounded-md border border-border bg-background p-2.5"
                    >
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
        </section>
      </div>
    </div>
  )
}
