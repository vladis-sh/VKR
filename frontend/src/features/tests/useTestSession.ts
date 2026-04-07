import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { testsApi } from '@/shared/api/tests.api'
import { QUERY_KEYS } from '@/shared/constants'
import { toast } from '@/features/theme/useToastStore'
import type { TestQuestion, TestAnswer, TestMode } from '@/entities/types'

interface UseTestSessionOptions {
  mode: TestMode
  topic?: string
  questions: TestQuestion[]
  sessionId: string
  countdown?: boolean
  initialSeconds?: number
}

export function useTestSession({
  mode,
  topic: _topic,
  questions,
  sessionId,
  countdown = false,
  initialSeconds = 0,
}: UseTestSessionOptions) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<TestAnswer[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(countdown ? initialSeconds : 0)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const hasAnswered = selectedIndex !== null

  const completeSessionMutation = useMutation({
    mutationFn: (data: { durationSeconds: number }) =>
      testsApi.completeSession(sessionId, {
        answers,
        durationSeconds: data.durationSeconds,
      }),
    onSuccess: () => {
      navigate(`/app/tests/results/${sessionId}`)
    },
    onError: () => {
      toast.error('Не удалось сохранить результаты теста')
      navigate(`/app/tests/results/${sessionId}`)
    },
  })

  const handleAnswer = useCallback(
    (index: number) => {
      if (hasAnswered || !currentQuestion) return
      setSelectedIndex(index)

      const isCorrect = index === currentQuestion.correctIndex
      const newAnswer: TestAnswer = {
        questionId: currentQuestion.id,
        selectedIndex: index,
        isCorrect,
      }
      const newAnswers = [...answers, newAnswer]
      setAnswers(newAnswers)

      // One-mistake mode: game over on first wrong answer
      if (mode === 'one-mistake' && !isCorrect) {
        setTimeout(() => {
          setIsGameOver(true)
        }, 800)
      }
    },
    [hasAnswered, currentQuestion, answers, mode]
  )

  const handleNext = useCallback(() => {
    if (!hasAnswered) return

    if (isLastQuestion || isGameOver) {
      const duration = countdown ? initialSeconds - timerSeconds : elapsedSeconds
      completeSessionMutation.mutate({ durationSeconds: Math.max(duration, 1) })
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedIndex(null)
    setShowResult(false)
  }, [
    hasAnswered,
    isLastQuestion,
    isGameOver,
    countdown,
    initialSeconds,
    timerSeconds,
    elapsedSeconds,
    completeSessionMutation,
  ])

  const handleTimeUp = useCallback(() => {
    // For time-attack: auto-submit
    const duration = initialSeconds
    completeSessionMutation.mutate({ durationSeconds: duration })
  }, [initialSeconds, completeSessionMutation])

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedIndex,
    hasAnswered,
    isLastQuestion,
    isGameOver,
    showResult,
    setShowResult,
    handleAnswer,
    handleNext,
    handleTimeUp,
    isSubmitting: completeSessionMutation.isPending,
    answers,
    setTimerSeconds,
    setElapsedSeconds,
  }
}

export function useTestTopics() {
  return useQuery({
    queryKey: QUERY_KEYS.TEST_TOPICS,
    queryFn: () => testsApi.getTopics().then((r) => r.data),
  })
}

export function useTestQuestions(params: { topic?: string; limit?: number; difficulty?: string } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.TEST_QUESTIONS(params),
    queryFn: () => testsApi.getQuestions(params).then((r) => r.data),
    enabled: Object.keys(params).length > 0,
  })
}

export function useTestSessionResult(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TEST_SESSION(id),
    queryFn: () => testsApi.getSession(id).then((r) => r.data),
    enabled: !!id,
  })
}
