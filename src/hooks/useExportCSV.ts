import type { ScheduleEntry } from '../types/schedule'

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export function useExportCSV() {
  const exportCSV = (assignments: ScheduleEntry[]) => {
    const headers = [
      'Profesor',
      'Tipo',
      'Materia',
      'Grupo',
      'Aula',
      'Campus',
      'Día',
      'Inicio',
      'Fin',
    ]

    const rows = assignments.map((a) => [
      a.teacher_name,
      a.teacher_type,
      a.subject_name,
      a.group_id,
      a.room_name,
      a.campus_id,
      DAY_NAMES[a.day] ?? a.day,
      a.start_time,
      a.end_time,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `horario_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return { exportCSV }
}
