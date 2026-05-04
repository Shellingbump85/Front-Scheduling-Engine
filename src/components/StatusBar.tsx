import type { JobPhase } from '../hooks/useScheduleJob'

const MESSAGES: Record<JobPhase, string> = {
  idle: '',
  submitting: 'Enviando solicitud al servidor...',
  waiting: 'Solver ejecutando — esperando resultado por WebSocket...',
  success: 'Horario generado correctamente',
  error: '',
}

interface Props {
  phase: JobPhase
  errorMsg: string | null
}

export function StatusBar({ phase, errorMsg }: Props) {
  if (phase === 'idle') return null

  const cls =
    phase === 'success' ? 'success' :
    phase === 'error'   ? 'error'   :
    'running'

  const text =
    phase === 'error' ? (errorMsg ?? 'Ocurrió un error') : MESSAGES[phase]

  return (
    <div className={`status-bar ${cls}`} role="status" aria-live="polite">
      <span className={`status-dot ${phase === 'submitting' || phase === 'waiting' ? 'pulse' : ''}`} />
      {text}
    </div>
  )
}
