import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCcw } from 'lucide-react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Dynamic import failure ("Loading chunk ... failed") is the most common case here.
    // Surface to console so it shows up in dev tools; production error reporter can hook in later.
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback

    const message = this.state.error?.message ?? 'Неизвестная ошибка'
    const isChunkError = /Loading chunk|Failed to fetch dynamically imported module/i.test(
      message
    )

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          {isChunkError ? 'Не удалось загрузить страницу' : 'Что-то пошло не так'}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isChunkError
            ? 'Возможно, приложение обновилось. Обновите страницу, чтобы загрузить новую версию.'
            : 'Попробуйте обновить страницу. Если ошибка повторяется — напишите нам.'}
        </p>
        <Button onClick={this.handleReload}>
          <RefreshCcw size={16} />
          Обновить страницу
        </Button>
      </div>
    )
  }
}
