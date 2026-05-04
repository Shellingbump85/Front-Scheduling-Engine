import { useState, useRef, useCallback } from 'react'
import { postGenerateSchedule, getJobResult } from '../api/scheduleApi'
import type { ScheduleInput, JobResult, JobStatus } from '../types/schedule'

export type JobPhase =
  | 'idle'
  | 'submitting'
  | 'waiting'
  | 'success'
  | 'error'

interface UseScheduleJobReturn {
  phase: JobPhase
  status: JobStatus | null
  result: JobResult | null
  errorMsg: string | null
  run: (input: ScheduleInput) => Promise<void>
  reset: () => void
}

const POLL_INTERVAL_MS = 3000

export function useScheduleJob(): UseScheduleJobReturn {
  const [phase, setPhase] = useState<JobPhase>('idle')
  const [status, setStatus] = useState<JobStatus | null>(null)
  const [result, setResult] = useState<JobResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const handleSuccess = useCallback(
    (data: JobResult) => {
      cleanup()
      setResult(data)
      setStatus('SUCCESS')
      setPhase('success')
    },
    [cleanup]
  )

  const handleError = useCallback(
    (msg: string) => {
      cleanup()
      setErrorMsg(msg)
      setPhase('error')
    },
    [cleanup]
  )

  const startPolling = useCallback(
    (jobId: string) => {
      pollRef.current = setInterval(async () => {
        try {
          const data = await getJobResult(jobId)
          setStatus(data.status)

          if (data.status === 'SUCCESS') {
            handleSuccess(data)
          } else if (data.status === 'FAILURE') {
            handleError(data.error ?? 'El solver falló')
          }
        } catch (e) {
          handleError(e instanceof Error ? e.message : 'Error de red')
        }
      }, POLL_INTERVAL_MS)
    },
    [handleSuccess, handleError]
  )

  const connectWebSocket = useCallback(
    (wsUrl: string, jobId: string) => {
      // Build absolute WS URL if relative
      const url = wsUrl.startsWith('ws')
        ? wsUrl
        : `ws://${window.location.host}${wsUrl}`

      try {
        const ws = new WebSocket(url)
        wsRef.current = ws

        ws.onmessage = (event) => {
          try {
            const data: JobResult = JSON.parse(event.data)
            if (data.status === 'SUCCESS') handleSuccess(data)
            else if (data.status === 'FAILURE') handleError(data.error ?? 'Falló')
            else setStatus(data.status)
          } catch {
            // non-JSON message, ignore
          }
        }

        ws.onerror = () => {
          // WS failed → fall back to polling
          wsRef.current = null
          startPolling(jobId)
        }

        ws.onclose = () => {
          // If we closed before success, start polling as safety net
          if (phase === 'waiting') startPolling(jobId)
        }
      } catch {
        startPolling(jobId)
      }
    },
    [handleSuccess, handleError, startPolling, phase]
  )

  const run = useCallback(
    async (input: ScheduleInput) => {
      cleanup()
      setPhase('submitting')
      setStatus('PENDING')
      setResult(null)
      setErrorMsg(null)

      try {
        const { job_id, ws_url } = await postGenerateSchedule(input)
        setPhase('waiting')
        setStatus('RUNNING')
        connectWebSocket(ws_url, job_id)
      } catch (e) {
        handleError(e instanceof Error ? e.message : 'Error al enviar la solicitud')
      }
    },
    [cleanup, connectWebSocket, handleError]
  )

  const reset = useCallback(() => {
    cleanup()
    setPhase('idle')
    setStatus(null)
    setResult(null)
    setErrorMsg(null)
  }, [cleanup])

  return { phase, status, result, errorMsg, run, reset }
}
