import type { ScheduleInput, JobResult } from '../types/schedule'

const BASE = '/api/v1'

export async function postGenerateSchedule(
  input: ScheduleInput
): Promise<{ job_id: string; ws_url: string }> {
  const res = await fetch(`${BASE}/schedules/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.detail ?? `Error ${res.status}`)
  }

  return res.json()
}

export async function getJobResult(jobId: string): Promise<JobResult> {
  const res = await fetch(`${BASE}/schedules/${jobId}`)

  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar el job`)
  }

  return res.json()
}

export async function deleteJob(jobId: string): Promise<void> {
  await fetch(`${BASE}/schedules/${jobId}`, { method: 'DELETE' })
}
