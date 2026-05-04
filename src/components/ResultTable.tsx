import type { JobResult, ScheduleEntry } from '../types/schedule'
import { useExportCSV } from '../hooks/useExportCSV'

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const BADGE_CLASS: Record<string, string> = {
  REGULAR: 'badge-regular',
  PROCOM:  'badge-procom',
  PROJEX:  'badge-projex',
  PROHES:  'badge-prohes',
}

interface Props {
  result: JobResult
  onReset: () => void
}

export function ResultTable({ result, onReset }: Props) {
  const { exportCSV } = useExportCSV()
  const assignments: ScheduleEntry[] = result.result?.assignments ?? []
  const objValue = result.result?.objective_value
  const solveTime = result.result?.solve_time_seconds

  const uniqueTeachers = new Set(assignments.map((a) => a.teacher_id)).size
  const uniqueRooms    = new Set(assignments.map((a) => a.room_id)).size

  const generatedAt = new Date().toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <section className="result-section" aria-label="Resultado del horario">
      <div className="result-header">
        <div className="result-header-left">
          <h2>Horario generado</h2>
          <p>
            {generatedAt}
            {solveTime !== undefined && ` · ${solveTime.toFixed(1)}s de cómputo`}
            {` · solver: ${result.result?.solver_used ?? '—'}`}
          </p>
        </div>

        <div className="result-header-actions">
          <button
            className="btn btn-export"
            onClick={() => exportCSV(assignments)}
            disabled={assignments.length === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar CSV
          </button>

          <button className="btn btn-ghost" onClick={onReset}>
            Reiniciar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-label">Asignaciones</p>
          <p className="stat-value accent">{assignments.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Profesores</p>
          <p className="stat-value">{uniqueTeachers}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Aulas usadas</p>
          <p className="stat-value">{uniqueRooms}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Costo objetivo</p>
          <p className="stat-value">{objValue !== undefined ? objValue.toFixed(2) : '—'}</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        {assignments.length === 0 ? (
          <div className="empty-state">
            El solver no generó asignaciones. Revisa los datos de entrada.
          </div>
        ) : (
          <table aria-label="Tabla de asignaciones del horario">
            <thead>
              <tr>
                <th>Profesor</th>
                <th>Tipo</th>
                <th>Materia</th>
                <th>Grupo</th>
                <th>Aula</th>
                <th>Campus</th>
                <th>Día</th>
                <th>Horario</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr key={`${a.teacher_id}-${a.subject_id}-${a.day}-${a.slot_index}-${i}`}>
                  <td>{a.teacher_name}</td>
                  <td>
                    <span className={`badge ${BADGE_CLASS[a.teacher_type] ?? ''}`}>
                      {a.teacher_type}
                    </span>
                  </td>
                  <td>{a.subject_name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{a.group_id}</td>
                  <td>{a.room_name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{a.campus_id}</td>
                  <td>{DAY_NAMES[a.day] ?? a.day}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {a.start_time} – {a.end_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
