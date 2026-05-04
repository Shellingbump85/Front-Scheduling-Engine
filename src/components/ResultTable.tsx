import type { JobResult, ScheduleEntry, ScheduleInput } from '../types/schedule'
import { useExportCSV } from '../hooks/useExportCSV'

const DAY_NAMES = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']

interface Props {
  result: JobResult
  input: ScheduleInput
  onReset: () => void
  variant?: 'full' | 'compact'
}

export function ResultTable({ result, input, onReset, variant = 'full' }: Props) {
  const { exportCSV } = useExportCSV()

  const teacherMap = Object.fromEntries(input.teachers.map(t => [t.id, t]))
  const subjectMap = Object.fromEntries(input.subjects.map(s => [s.id, s]))
  const roomMap    = Object.fromEntries(input.rooms.map(r => [r.id, r]))
  const slotMap    = Object.fromEntries(input.timeslots.map(ts => [ts.id, ts]))

  const assignments: ScheduleEntry[] = (result.assignments ?? []).map(a => {
    const t = teacherMap[a.teacher_id]
    const s = subjectMap[a.subject_id]
    const r = roomMap[a.room_id]
    const ts = slotMap[a.timeslot_id]

    return {
      ...a,
      teacher_name: t?.name ?? a.teacher_id,
      teacher_type: t?.teacher_type ?? 'REGULAR',
      subject_name: s?.name ?? a.subject_id,
      room_name: r?.name ?? a.room_id,
      day: ts?.day ?? 0,
      slot_index: ts?.slot_index ?? 0,
      start_time: ts?.start_time ?? '--:--',
      end_time: ts?.end_time ?? '--:--',
    }
  })

  if (assignments.length === 0) {
    return (
      <div className="py-12 text-center border border-slate-100 rounded">
        <p className="text-slate-400 font-medium tracking-tight">SIN ASIGNACIONES DISPONIBLES</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {variant === 'full' && (
        <div className="flex justify-between items-end border-b border-slate-900 pb-4">
          <div>
            <h2 className="text-2xl font-light tracking-tighter text-slate-900 uppercase">Resultado del Análisis</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">ESTADO: {result.solver_status?.toUpperCase() || 'COMPLETADO'}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => exportCSV(assignments)}
              className="text-[10px] font-bold tracking-widest uppercase hover:text-blue-600 transition-colors"
            >
              Exportar CSV
            </button>
            <button
              onClick={onReset}
              className="text-[10px] font-bold tracking-widest uppercase hover:text-red-600 transition-colors"
            >
              Borrar Todo
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <th className="py-4 pr-4">Horario</th>
              <th className="py-4 pr-4">Asignatura</th>
              <th className="py-4 pr-4">Docente</th>
              <th className="py-4 text-right">Espacio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.map((a, i) => (
              <tr key={i} className="group">
                <td className="py-5 pr-4">
                  <div className="text-[11px] font-bold text-slate-900 leading-none">{DAY_NAMES[a.day]}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{a.start_time} — {a.end_time}</div>
                </td>
                <td className="py-5 pr-4">
                  <div className="text-xs font-semibold text-slate-800 uppercase tracking-tight">{a.subject_name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{a.group_id}</div>
                </td>
                <td className="py-5 pr-4">
                  <div className="text-xs text-slate-600">{a.teacher_name}</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">{a.teacher_type}</div>
                </td>
                <td className="py-5 text-right">
                  <div className="text-xs font-medium text-slate-800">{a.room_name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 uppercase">{a.campus_id}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
