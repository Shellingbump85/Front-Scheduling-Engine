import type { SolverType } from '../types/schedule'

interface Props {
  solver: SolverType
  onSolverChange: (v: SolverType) => void
  disabled: boolean
}

export function ConfigPanel({ solver, onSolverChange, disabled }: Props) {
  return (
    <div className="config-panel" style={{ gridTemplateColumns: '1fr' }}>
      <div className="field">
        <label htmlFor="solver">Método de cálculo</label>
        <select
          id="solver"
          value={solver}
          disabled={disabled}
          onChange={(e) => onSolverChange(e.target.value as SolverType)}
        >
          <option value="pulp_cbc">Exacto — pulp_cbc (recomendado)</option>
          <option value="tabu_search">Heurístico — tabu_search (más rápido, menos preciso)</option>
        </select>
      </div>
    </div>
  )
}