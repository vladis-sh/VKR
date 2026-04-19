import { useCallback, useEffect, useState } from 'react'
import type { LiveCodingLanguage } from '@/entities/liveCoding'

interface LiveCodingProgress {
  solved: string[]
  favorites: string[]
  codeByTask: Record<string, Partial<Record<LiveCodingLanguage, string>>>
  submittedAt: Record<string, string>
}

const STORAGE_KEY = 'prepai.live-coding.progress'

const emptyProgress: LiveCodingProgress = {
  solved: [],
  favorites: [],
  codeByTask: {},
  submittedAt: {},
}

function readProgress(): LiveCodingProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress

    return { ...emptyProgress, ...JSON.parse(raw) } as LiveCodingProgress
  } catch {
    return emptyProgress
  }
}

function writeProgress(progress: LiveCodingProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useLiveCodingProgress() {
  const [progress, setProgress] = useState<LiveCodingProgress>(() => readProgress())

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setProgress(readProgress())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const commit = useCallback((updater: (current: LiveCodingProgress) => LiveCodingProgress) => {
    setProgress((current) => {
      const next = updater(current)
      writeProgress(next)
      return next
    })
  }, [])

  const isSolved = useCallback((taskId: string) => progress.solved.includes(taskId), [progress.solved])
  const isFavorite = useCallback(
    (taskId: string) => progress.favorites.includes(taskId),
    [progress.favorites]
  )

  const toggleFavorite = useCallback(
    (taskId: string) => {
      commit((current) => {
        const favorites = current.favorites.includes(taskId)
          ? current.favorites.filter((id) => id !== taskId)
          : [...current.favorites, taskId]

        return { ...current, favorites }
      })
    },
    [commit]
  )

  const markSolved = useCallback(
    (taskId: string) => {
      commit((current) => ({
        ...current,
        solved: current.solved.includes(taskId) ? current.solved : [...current.solved, taskId],
        submittedAt: { ...current.submittedAt, [taskId]: new Date().toISOString() },
      }))
    },
    [commit]
  )

  const saveCode = useCallback(
    (taskId: string, language: LiveCodingLanguage, code: string) => {
      commit((current) => ({
        ...current,
        codeByTask: {
          ...current.codeByTask,
          [taskId]: {
            ...current.codeByTask[taskId],
            [language]: code,
          },
        },
      }))
    },
    [commit]
  )

  const getSavedCode = useCallback(
    (taskId: string, language: LiveCodingLanguage) => progress.codeByTask[taskId]?.[language],
    [progress.codeByTask]
  )

  return {
    progress,
    isSolved,
    isFavorite,
    toggleFavorite,
    markSolved,
    saveCode,
    getSavedCode,
  }
}
