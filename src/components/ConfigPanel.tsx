import type { SolverType } from '../types/schedule'

interface Props {
  solver: SolverType
  onSolverChange: (v: SolverType) => void
  disabled: boolean
}

export function ConfigPanel({ solver, onSolverChange, disabled }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Parámetros del Motor</h3>
      
      <div className="flex flex-col border-b border-slate-200 pb-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Metodología de Resolución</label>
        <select
          className="bg-transparent border-none p-0 text-sm font-semibold text-slate-900 focus:ring-0 cursor-pointer uppercase tracking-tight"
          value={solver}
          disabled={disabled}
          onChange={(e) => onSolverChange(e.target.value as SolverType)}
        >
          <option value="pulp_cbc">PULP / CBC (PRECISIÓN)</option>
          <option value="tabu_search">TABU SEARCH (VELOCIDAD)</option>
          <option value="ortools_cpsat">OR-TOOLS (AVANZADO)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col border-b border-slate-200 pb-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Margen de Error</label>
          <span className="text-sm font-semibold text-slate-900">0.05 / OPTIMAL</span>
        </div>
        <div className="flex flex-col border-b border-slate-200 pb-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Tiempo Límite</label>
          <span className="text-sm font-semibold text-slate-900">300 SEGUNDOS</span>
        </div>
      </div>
    </div>
  )
}
