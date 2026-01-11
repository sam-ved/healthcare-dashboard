import type { Patient, AuthResponse, Visit, Surgery, TriageStats, Analytics } from './types'
import { getAuthHeaders, saveAuth, clearAuth } from './utils/auth'

const API_BASE_URL = 'http://localhost:3000'

// ============ Authentication ============
export async function employeeLogin(employeeId: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/employee-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  const data = await response.json()
  saveAuth(data.token, data.employee)
  return data
}

export function logout(): void {
  clearAuth()
}

// ============ Patient Management ============
export async function getPatients(): Promise<Patient[]> {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Failed to fetch patients')
  return response.json()
}

export async function getPatientById(id: number): Promise<Patient> {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Patient not found')
  return response.json()
}

export async function searchPatientByPidOrPhone(query: string): Promise<Patient | null> {
  const response = await fetch(`${API_BASE_URL}/patients/search?q=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) return null
  return response.json()
}
export async function createPatient(data: {
  name: string
  age: number
  issue: string
  since: string
  fullName?: string
  gender?: string
  phone?: string
  address?: string
  bloodGroup?: string
  allergies?: string
  weight?: number
}): Promise<Patient> {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Failed to create patient')
  return response.json()
}

export async function deletePatient(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Failed to delete patient')
}

// ============ Visit Management ============
export async function getVisitsByDoctor(doctorId: number): Promise<Visit[]> {
  const response = await fetch(`${API_BASE_URL}/visits/doctor/${doctorId}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Failed to fetch visits')
  return response.json()
}

export async function createVisit(data: {
  patientId: number
  doctorId: number
  visitReason: string
  assignedWard?: string
  notes?: string
}): Promise<Visit> {
  const response = await fetch(`${API_BASE_URL}/visits`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Failed to create visit')
  return response.json()
}

export async function updateVisit(id: number, data: {
  status?: string
  assignedWard?: string
  diagnosis?: string
  prescription?: string
  notes?: string
}): Promise<Visit> {
  const response = await fetch(`${API_BASE_URL}/visits/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Failed to update visit')
  return response.json()
}

// ============ Surgery Management ============
export async function createSurgery(data: {
  patientId: number
  doctorId: number
  surgeryType: string
  scheduledFor: string
}): Promise<Surgery> {
  const response = await fetch(`${API_BASE_URL}/surgeries`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Failed to schedule surgery')
  return response.json()
}

// ============ Statistics & Analytics ============
export async function getTriageStats(): Promise<TriageStats> {
  const response = await fetch(`${API_BASE_URL}/stats/triage`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

export async function getAnalytics(): Promise<Analytics> {
  const response = await fetch(`${API_BASE_URL}/stats/analytics`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Failed to fetch analytics')
  return response.json()
}
