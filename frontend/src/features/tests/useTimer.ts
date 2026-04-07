import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTimerOptions {
  initialSeconds: number
  countdown?: boolean
  onExpire?: () => void
  autoStart?: boolean
}

export function useTimer({
  initialSeconds,
  countdown = false,
  onExpire,
  autoStart = true,
}: UseTimerOptions) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const reset = useCallback(() => {
    stop()
    setSeconds(initialSeconds)
  }, [stop, initialSeconds])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (countdown) {
          if (prev <= 1) {
            stop()
            onExpireRef.current?.()
            return 0
          }
          return prev - 1
        }
        return prev + 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, countdown, stop])

  return { seconds, isRunning, start, stop, reset }
}
