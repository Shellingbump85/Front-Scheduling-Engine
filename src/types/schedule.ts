// ─── Input types (matches backend Pydantic schemas) ───────────────────────────

export type TeacherType = 'REGULAR' | 'PROCOM' | 'PROJEX' | 'PROHES'
export type SolverType = 'pulp_cbc' | 'tabu_search'

export interface AvailabilitySlot {
  day: number
  slot_index: number
}

export interface Teacher {
  id: string
  name: string
  teacher_type: TeacherType
  campus_ids: string[]
  availability_slots: AvailabilitySlot[]
  max_hours_per_day: number
  ntpphes?: number
}

export interface Subject {
  id: string
  name: string
  group_id: string
  required_sessions: number
  campus_id: string
  student_count: number
  eligible_teacher_ids?: string[]
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

export interface JobAssignment {
  teacher_id: string
  subject_id: string
  room_id: string
  timeslot_id: string
  campus_id: string
  group_id: string
}

export interface JobResult {
  job_id: string
  status: JobStatus
  penalty_score?: number
  solver_status?: string
  error_message?: string
  assignments?: JobAssignment[]
  created_at?: string
  completed_at?: string
}

export interface ScheduleEntry extends JobAssignment {
  teacher_name: string
  teacher_type: TeacherType
  subject_name: string
  room_name: string
  day: number
  slot_index: number
  start_time: string
  end_time: string
}
