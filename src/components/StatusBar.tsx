import type { JobPhase } from '../hooks/useScheduleJob'

const MESSAGES: Record<JobPhase, string> = {
  idle: '',
  submitting: 'Sincronizando parámetros...',
  waiting: 'Analizando restricciones...',
  success: 'Análisis finalizado.',
  error: '',
}

interface Props {
  phase: JobPhase
  errorMsg: string | null
}

export function StatusBar({ phase, errorMsg }: Props) {
  if (phase === 'idle') return null

  const isError = phase === 'error'
  const isRunning = phase === 'submitting' || phase === 'waiting'

  const text = isError ? (errorMsg ?? 'Fallo en el motor') : MESSAGES[phase]

  return (
    <div className="py-6 border-t border-slate-100 flex items-center gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <div className={`w-1 h-1 rounded-full ${isError ? 'bg-red-500' : 'bg-slate-900'} ${isRunning ? 'animate-pulse' : ''}`} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{text}</span>
      </div>
    </div>
  )
}
