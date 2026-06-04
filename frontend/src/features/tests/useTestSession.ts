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
  const [revealed, setRevealed] = useState<
    Record<string, { correctIndex: number; explanation?: string }>
  >({})
  const [isChecking, setIsChecking] = useState(false)

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
    async (index: number) => {
      if (hasAnswered || isChecking || !currentQuestion) return
      setIsChecking(true)
      setSelectedIndex(index)

      try {
        // Correctness is verified server-side; the answer key is never shipped
        // to the client up front.
        const { data } = await testsApi.checkAnswer(currentQuestion.id, index)
        setRevealed((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            correctIndex: data.correctIndex,
            explanation: data.explanation,
          },
        }))
        setAnswers((prev) => [
          ...prev,
          { questionId: currentQuestion.id, selectedIndex: index, isCorrect: data.isCorrect },
        ])

        // One-mistake mode: game over on first wrong answer
        if (mode === 'one-mistake' && !data.isCorrect) {
          setTimeout(() => setIsGameOver(true), 800)
        }
      } catch {
        // Let the user retry the answer.
        setSelectedIndex(null)
        toast.error('Не удалось проверить ответ. Попробуйте ещё раз.')
      } finally {
        setIsChecking(false)
      }
    },
    [hasAnswered, isChecking, currentQuestion, mode]
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
    revealed,
    isChecking,
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
