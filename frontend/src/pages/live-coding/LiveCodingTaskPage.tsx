import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Editor, { type BeforeMount, type OnMount } from '@monaco-editor/react'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Code2,
  Lock,
  Play,
  RotateCcw,
  Send,
  Star,
  XCircle,
} from 'lucide-react'
import {
  DIFFICULTY_LABELS,
  LANGUAGE_LABELS,
  LIVE_CODING_TASKS,
  type LiveCodingLanguage,
  type LiveCodingTask,
} from '@/entities/liveCoding'
import {
  runLiveCodingTests,
  type CodeRunResult,
} from '@/features/live-coding/codeRunner'
import { useLiveCodingProgress } from '@/features/live-coding/useLiveCodingProgress'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { cn } from '@/shared/lib/cn'
import { toast } from '@/features/theme/useToastStore'

type LeftTab = 'description' | 'mine' | 'solutions'
type RightTab = 'tests' | 'result'

const leftTabs: Array<{ value: LeftTab; label: string }> = [
  { value: 'description', label: 'Описание' },
  { value: 'mine', label: 'Мои решения' },
  { value: 'solutions', label: 'Решения' },
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
  if (difficulty === 'easy') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (difficulty === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
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
    <div className="overflow-hidden rounded-lg border border-border bg-slate-950">
      <Editor
        height="440px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value ?? '')}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        loading={
          <div className="h-[440px] bg-slate-950 p-4">
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
          fontSize: 14,
          formatOnPaste: true,
          formatOnType: true,
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}

function BuiltInFunctionsPanel({
  onInsert,
}: {
  onInsert: (snippet: string) => void
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Встроенные функции</p>
          <p className="text-xs text-muted-foreground">
            Доступны прямо в решении и в автодополнении Monaco.
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {helperDefinitions.map((helper) => (
          <button
            key={helper.name}
            type="button"
            onClick={() => onInsert(helper.snippet.replace(/\$\{\d+:([^}]+)\}/g, '$1'))}
            className="rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <code className="text-xs font-semibold text-primary">{helper.signature}</code>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {helper.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultPanel({ result }: { result: CodeRunResult | null }) {
  if (!result) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
        Запустите код, чтобы увидеть результат выполнения тестов.
      </div>
    )
  }

  if (result.error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
        <p className="text-sm font-semibold text-destructive">Ошибка выполнения</p>
        <p className="mt-1 text-xs text-destructive/90">{result.error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {result.results.map((item) => (
        <div
          key={item.title}
          className={cn(
            'rounded-lg border p-3',
            item.passed
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-destructive/30 bg-destructive/10'
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {item.passed ? (
                <CheckCircle2 size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-destructive" />
              )}
              <p className="text-sm font-medium text-foreground">{item.title}</p>
            </div>
            <span className="text-xs text-muted-foreground">{item.durationMs}мс</span>
          </div>
          {item.message && (
            <p className="mt-2 text-xs leading-relaxed text-destructive">{item.message}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function LiveCodingTaskPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const task = LIVE_CODING_TASKS.find((item) => item.slug === slug)
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
  const [rightTab, setRightTab] = useState<RightTab>('tests')
  const [language, setLanguage] = useState<LiveCodingLanguage>(
    task?.languages[0] ?? 'javascript'
  )
  const [code, setCode] = useState(task?.starterCode[language] ?? '')
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!task) return
    const savedCode = getSavedCode(task.id, language)
    setCode(savedCode ?? task.starterCode[language])
    setRunResult(null)
  }, [getSavedCode, language, task])

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
    setRightTab('result')
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/app/live-coding')}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Назад к списку задач"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={cn('rounded-md px-2 py-1 text-[10px] font-semibold', difficultyTone(task.difficulty))}>
                {DIFFICULTY_LABELS[task.difficulty]}
              </span>
              {solved && (
                <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  <CheckCircle2 size={11} />
                  Решена
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{task.companies.join(', ')}</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {task.estimatedMinutes} минут
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(task.id)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm transition-colors',
              favorite ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
            )}
          >
            <Star size={15} className={cn(favorite && 'fill-current')} />
            Избранное
          </button>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LiveCodingLanguage)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            aria-label="Язык программирования"
          >
            {task.languages.map((item) => (
              <option key={item} value={item}>
                {LANGUAGE_LABELS[item]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="min-h-[640px] rounded-lg border border-border bg-card shadow-sm">
          <div className="flex border-b border-border px-2 pt-2">
            {leftTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setLeftTab(tab.value)}
                className={cn(
                  'rounded-t-lg px-4 py-2 text-sm font-medium transition-colors',
                  leftTab === tab.value
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-5 p-5">
            {leftTab === 'description' && (
              <>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Описание</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {task.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-foreground">Примеры</h2>
                  <div className="mt-3 space-y-3">
                    {task.examples.map((example) => (
                      <div key={example.input} className="rounded-lg bg-secondary p-3">
                        <p className="font-mono text-xs text-foreground">Input: {example.input}</p>
                        <p className="mt-1 font-mono text-xs text-foreground">Output: {example.output}</p>
                        {example.explanation && (
                          <p className="mt-2 text-xs text-muted-foreground">{example.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-foreground">Ограничения</h2>
                  <ul className="mt-2 space-y-2">
                    {task.constraints.map((constraint) => (
                      <li key={constraint} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {leftTab === 'mine' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {solved ? 'Решение принято' : 'Решение ещё не принято'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {submittedAt
                      ? `Последняя успешная отправка: ${formatDate(submittedAt)}`
                      : 'Код сохраняется локально в браузере, пока вы тренируетесь.'}
                  </p>
                </div>
                <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                  <code>{code}</code>
                </pre>
              </div>
            )}

            {leftTab === 'solutions' && (
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">Подход к решению</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Подсказки помогают проверить направление, но не заменяют самостоятельное решение.
                  </p>
                </div>
                {task.solutionNotes.map((note, index) => (
                  <motion.div
                    key={note}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <p className="text-sm text-muted-foreground">{note}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Code2 size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Редактор кода</p>
                  <p className="text-xs text-muted-foreground">
                    Экспортируйте функцию через module.exports или объявите solution.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw size={14} />
                Сбросить
              </Button>
            </div>
            <CodeEditor code={code} language={language} onChange={handleCodeChange} />
            <div className="mt-3">
              <BuiltInFunctionsPanel onInsert={insertHelper} />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRightTab('tests')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    rightTab === 'tests'
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  )}
                >
                  Тест-кейсы
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('result')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    rightTab === 'result'
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  )}
                >
                  Результат
                </button>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" loading={isRunning} onClick={runTests}>
                  <Play size={14} />
                  Запустить
                </Button>
                <Button size="sm" loading={isRunning} onClick={handleSubmit}>
                  <Send size={14} />
                  Отправить
                </Button>
              </div>
            </div>

            <div className="p-4">
              {rightTab === 'tests' ? (
                <div className="space-y-3">
                  {task.tests.map((test) => (
                    <div key={test.title} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-sm font-medium text-foreground">{test.title}</p>
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        Input: {test.input}
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        Expected: {test.expected}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <ResultPanel result={runResult} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground shadow-sm">
            <Lock size={14} />
            Premium-задачи видны в каталоге, но недоступны для запуска без подписки.
          </div>
        </section>
      </div>
    </div>
  )
}
