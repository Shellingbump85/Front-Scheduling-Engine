// ─── Input types (matches backend Pydantic schemas) ───────────────────────────

export type TeacherType = 'REGULAR' | 'PROCOM' | 'PROJEX' | 'PROHES'
export type SolverType = 'pulp_cbc' | 'tabu_search'

export interface Teacher {
  id: string
  name: string
  teacher_type: TeacherType
  campus_ids: string[]
  availability_slots: string[]
  max_hours_per_day: number
}

export interface Subject {
  id: string
  name: string
  group_id: string
  required_sessions: number
  campus_id: string
  student_count: number
}

export interface Room {
  id: string
  name: string
  campus_id: string
  capacity: number
}

export interface Timeslot {
  id: string
  day: number
  slot_index: number
  start_time: string
  end_time: string
}

export interface PenaltyWeights {
  penalizacion1: number
  penalizacion2: number
}

export interface ScheduleInput {
  teachers: Teacher[]
  subjects: Subject[]
  rooms: Room[]
  timeslots: Timeslot[]
  penalty_weights: PenaltyWeights
  solver: SolverType
  time_limit_seconds: number
}

// ─── Output types (what the backend returns) ──────────────────────────────────

export interface ScheduleEntry {
  teacher_id: string
  teacher_name: string
  teacher_type: TeacherType
  subject_id: string
  subject_name: string
  group_id: string
  room_id: string
  room_name: string
  campus_id: string
  day: number
  slot_index: number
  start_time: string
  end_time: string
}

export type JobStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE'

export interface JobResult {
  job_id: string
  status: JobStatus
  result?: {
    assignments: ScheduleEntry[]
    objective_value: number
    solver_used: string
    solve_time_seconds: number
  }
  error?: string
  ws_url?: string
}
