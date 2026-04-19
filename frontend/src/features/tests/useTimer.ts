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
  const expiredRef = useRef(false)
  onExpireRef.current = onExpire

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    expiredRef.current = false
    setIsRunning(true)
  }, [])

  const reset = useCallback(() => {
    stop()
    expiredRef.current = false
    setSeconds(initialSeconds)
  }, [stop, initialSeconds])

  useEffect(() => {
    setSeconds(initialSeconds)
    expiredRef.current = false
  }, [initialSeconds, countdown])

  useEffect(() => {
    setIsRunning(autoStart)
  }, [autoStart])

  useEffect(() => {
    if (!isRunning) return
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (countdown) {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setIsRunning(false)
            if (!expiredRef.current) {
              expiredRef.current = true
              onExpireRef.current?.()
            }
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
        intervalRef.current = null
      }
    }
  }, [isRunning, countdown])

  return { seconds, isRunning, start, stop, reset }
}
